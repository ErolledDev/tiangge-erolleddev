import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, getDoc, orderBy, Timestamp, onSnapshot } from 'firebase/firestore';

export interface HelpdeskTicket {
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  subject: string;
  category: 'technical' | 'billing' | 'feature_request' | 'general';
  priority: 'low' | 'medium' | 'high';
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  hasAdminReply?: boolean;
  openedByAdmin?: boolean;
  lastNotifiedStatus?: string;
}

export interface TicketReply {
  id?: string;
  ticketId: string;
  userId: string;
  userEmail: string;
  userName: string;
  isAdmin: boolean;
  message: string;
  createdAt: Date;
}

export interface TicketNotification {
  id?: string;
  userId: string;
  ticketId: string;
  ticketSubject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export const createTicket = async (
  userId: string,
  userEmail: string,
  userName: string,
  subject: string,
  category: 'technical' | 'billing' | 'feature_request' | 'general',
  priority: 'low' | 'medium' | 'high',
  description: string
): Promise<string> => {
  try {
    if (!db) throw new Error('Firebase not initialized');

    const ticketData: Omit<HelpdeskTicket, 'id'> = {
      userId,
      userEmail,
      userName,
      subject,
      category,
      priority,
      description,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      hasAdminReply: false,
      openedByAdmin: false,
      lastNotifiedStatus: undefined
    };

    const ticketsRef = collection(db, 'helpdesk_tickets');
    const docRef = await addDoc(ticketsRef, ticketData);

    return docRef.id;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};

export const getUserTickets = async (userId: string): Promise<HelpdeskTicket[]> => {
  try {
    if (!db) return [];

    const ticketsRef = collection(db, 'helpdesk_tickets');
    const q = query(
      ticketsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const tickets: HelpdeskTicket[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      tickets.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
      } as HelpdeskTicket);
    });

    return tickets;
  } catch (error) {
    console.error('Error getting user tickets:', error);
    return [];
  }
};

export const subscribeToUserTickets = (
  userId: string,
  callback: (tickets: HelpdeskTicket[]) => void
): (() => void) => {
  try {
    if (!db) {
      console.error('Firebase DB not initialized');
      callback([]);
      return () => {};
    }

    console.log('Setting up ticket subscription for user:', userId);
    const ticketsRef = collection(db, 'helpdesk_tickets');
    const q = query(
      ticketsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        console.log('Ticket subscription received:', querySnapshot.size, 'tickets');
        const tickets: HelpdeskTicket[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          tickets.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
          } as HelpdeskTicket);
        });
        console.log('Processed tickets:', tickets.length);
        callback(tickets);
      },
      (error) => {
        console.error('Error in ticket subscription:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        // If there's an error (like missing index), still call callback with empty array
        callback([]);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to user tickets:', error);
    callback([]);
    return () => {};
  }
};

export const getAllTickets = async (): Promise<HelpdeskTicket[]> => {
  try {
    if (!db) return [];

    const ticketsRef = collection(db, 'helpdesk_tickets');
    const q = query(ticketsRef, orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    const tickets: HelpdeskTicket[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      tickets.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
      } as HelpdeskTicket);
    });

    return tickets;
  } catch (error) {
    console.error('Error getting all tickets:', error);
    return [];
  }
};

export const getTicket = async (ticketId: string): Promise<HelpdeskTicket | null> => {
  try {
    if (!db) return null;

    const ticketRef = doc(db, 'helpdesk_tickets', ticketId);
    const ticketSnap = await getDoc(ticketRef);

    if (!ticketSnap.exists()) return null;

    const data = ticketSnap.data();
    return {
      id: ticketSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
    } as HelpdeskTicket;
  } catch (error) {
    console.error('Error getting ticket:', error);
    return null;
  }
};

export const updateTicketStatus = async (
  ticketId: string,
  status: 'open' | 'in_progress' | 'resolved' | 'closed',
  notifyUser: boolean = false
): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');

    const ticketRef = doc(db, 'helpdesk_tickets', ticketId);
    const ticket = await getTicket(ticketId);

    await updateDoc(ticketRef, {
      status,
      updatedAt: new Date(),
      lastNotifiedStatus: notifyUser ? status : ticket?.lastNotifiedStatus
    });

    if (notifyUser && ticket) {
      const statusMessages: Record<string, string> = {
        open: 'reopened',
        in_progress: 'is now being reviewed by our team',
        resolved: 'has been resolved',
        closed: 'has been closed'
      };

      const message = `Your ticket "${ticket.subject}" ${statusMessages[status]}.`;
      await sendTicketNotification(ticket.userId, ticketId, ticket.subject, message);
    }
  } catch (error) {
    console.error('Error updating ticket status:', error);
    throw error;
  }
};

export const addTicketReply = async (
  ticketId: string,
  userId: string,
  userEmail: string,
  userName: string,
  isAdmin: boolean,
  message: string
): Promise<string> => {
  try {
    if (!db) throw new Error('Firebase not initialized');

    const replyData: Omit<TicketReply, 'id'> = {
      ticketId,
      userId,
      userEmail,
      userName,
      isAdmin,
      message,
      createdAt: new Date()
    };

    const repliesRef = collection(db, 'helpdesk_tickets', ticketId, 'replies');
    const docRef = await addDoc(repliesRef, replyData);

    if (isAdmin) {
      const ticketRef = doc(db, 'helpdesk_tickets', ticketId);
      await updateDoc(ticketRef, {
        hasAdminReply: true,
        updatedAt: new Date()
      });

      const ticket = await getTicket(ticketId);
      if (ticket) {
        const notificationData: Omit<TicketNotification, 'id'> = {
          userId: ticket.userId,
          ticketId,
          ticketSubject: ticket.subject,
          message: `New reply from support on: ${ticket.subject}`,
          isRead: false,
          createdAt: new Date()
        };

        const notificationsRef = collection(db, 'ticket_notifications');
        await addDoc(notificationsRef, notificationData);
      }
    }

    return docRef.id;
  } catch (error) {
    console.error('Error adding ticket reply:', error);
    throw error;
  }
};

export const getTicketReplies = async (ticketId: string): Promise<TicketReply[]> => {
  try {
    if (!db) return [];

    const repliesRef = collection(db, 'helpdesk_tickets', ticketId, 'replies');
    const q = query(repliesRef, orderBy('createdAt', 'asc'));

    const querySnapshot = await getDocs(q);
    const replies: TicketReply[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      replies.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt
      } as TicketReply);
    });

    return replies;
  } catch (error) {
    console.error('Error getting ticket replies:', error);
    return [];
  }
};

export const subscribeToTicketReplies = (
  ticketId: string,
  callback: (replies: TicketReply[]) => void
): (() => void) => {
  try {
    if (!db) return () => {};

    const repliesRef = collection(db, 'helpdesk_tickets', ticketId, 'replies');
    const q = query(repliesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const replies: TicketReply[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        replies.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt
        } as TicketReply);
      });
      callback(replies);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to ticket replies:', error);
    return () => {};
  }
};

export const getUserTicketNotifications = async (userId: string): Promise<TicketNotification[]> => {
  try {
    if (!db) return [];

    const notificationsRef = collection(db, 'ticket_notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const notifications: TicketNotification[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      notifications.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt
      } as TicketNotification);
    });

    return notifications;
  } catch (error) {
    console.error('Error getting user ticket notifications:', error);
    return [];
  }
};

export const markTicketNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');

    const notificationRef = doc(db, 'ticket_notifications', notificationId);
    await updateDoc(notificationRef, {
      isRead: true
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const subscribeToTicketNotifications = (
  userId: string,
  callback: (notifications: TicketNotification[]) => void
): (() => void) => {
  try {
    if (!db) return () => {};

    const notificationsRef = collection(db, 'ticket_notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notifications: TicketNotification[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notifications.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt
        } as TicketNotification);
      });
      callback(notifications);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to ticket notifications:', error);
    return () => {};
  }
};

export const clearTicketNotifications = async (ticketId: string, userId: string): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');

    const notificationsRef = collection(db, 'ticket_notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', userId),
      where('ticketId', '==', ticketId)
    );

    const querySnapshot = await getDocs(q);
    const updatePromises = querySnapshot.docs.map(doc =>
      updateDoc(doc.ref, { isRead: true })
    );

    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error clearing ticket notifications:', error);
    throw error;
  }
};

export const markTicketAsOpened = async (ticketId: string): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');

    const ticketRef = doc(db, 'helpdesk_tickets', ticketId);
    const ticket = await getTicket(ticketId);

    if (!ticket?.openedByAdmin) {
      await updateDoc(ticketRef, {
        openedByAdmin: true,
        updatedAt: new Date()
      });

      if (ticket) {
        const message = `Your ticket "${ticket.subject}" is now being reviewed by our support team.`;
        await sendTicketNotification(ticket.userId, ticketId, ticket.subject, message);
      }
    }
  } catch (error) {
    console.error('Error marking ticket as opened:', error);
    throw error;
  }
};

export const getUnreadTicketsCount = async (): Promise<number> => {
  try {
    if (!db) return 0;

    const ticketsRef = collection(db, 'helpdesk_tickets');
    const q = query(
      ticketsRef,
      where('openedByAdmin', '==', false)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting unread tickets count:', error);
    return 0;
  }
};

export const subscribeToUnreadTicketsCount = (
  callback: (count: number) => void
): (() => void) => {
  try {
    if (!db) {
      callback(0);
      return () => {};
    }

    const ticketsRef = collection(db, 'helpdesk_tickets');
    const q = query(
      ticketsRef,
      where('openedByAdmin', '==', false)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        callback(querySnapshot.size);
      },
      (error) => {
        console.error('Error in unread tickets subscription:', error);
        callback(0);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to unread tickets:', error);
    callback(0);
    return () => {};
  }
};

export const sendTicketNotification = async (
  userId: string,
  ticketId: string,
  ticketSubject: string,
  message: string
): Promise<void> => {
  try {
    if (!db) throw new Error('Firebase not initialized');

    const notificationData: Omit<TicketNotification, 'id'> = {
      userId,
      ticketId,
      ticketSubject,
      message,
      isRead: false,
      createdAt: new Date()
    };

    const notificationsRef = collection(db, 'ticket_notifications');
    await addDoc(notificationsRef, notificationData);
  } catch (error) {
    console.error('Error sending ticket notification:', error);
    throw error;
  }
};

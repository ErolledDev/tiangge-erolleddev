'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { getAllTickets, getTicket, updateTicketStatus, addTicketReply, getTicketReplies, subscribeToTicketReplies, HelpdeskTicket, TicketReply } from '@/lib/helpdesk';
import { MessageSquare, Clock, CheckCircle, XCircle, AlertCircle, ChevronLeft, Send, Filter } from 'lucide-react';
import AdminRoute from '@/components/AdminRoute';

function HelpdeskManagementContent() {
  const { user, userProfile } = useAuth();
  const { showToast } = useToast();

  const [tickets, setTickets] = useState<HelpdeskTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<HelpdeskTicket | null>(null);
  const [ticketReplies, setTicketReplies] = useState<TicketReply[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    if (!selectedTicket) return;

    setLoadingReplies(true);
    const unsubscribe = subscribeToTicketReplies(selectedTicket.id!, (replies) => {
      setTicketReplies(replies);
      setLoadingReplies(false);
    });

    return () => unsubscribe();
  }, [selectedTicket]);

  const loadTickets = async () => {
    setLoadingTickets(true);
    try {
      const allTickets = await getAllTickets();
      setTickets(allTickets);
    } catch (error) {
      console.error('Error loading tickets:', error);
      showToast('Failed to load tickets', 'error');
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleTicketClick = async (ticket: HelpdeskTicket) => {
    setSelectedTicket(ticket);
  };

  const handleBackToList = () => {
    setSelectedTicket(null);
    setTicketReplies([]);
    setReplyMessage('');
  };

  const handleStatusChange = async (ticketId: string, newStatus: 'open' | 'in_progress' | 'resolved' | 'closed') => {
    try {
      await updateTicketStatus(ticketId, newStatus);
      showToast('Ticket status updated', 'success');

      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }

      loadTickets();
    } catch (error) {
      console.error('Error updating ticket status:', error);
      showToast('Failed to update ticket status', 'error');
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !userProfile || !selectedTicket || !replyMessage.trim()) return;

    setSendingReply(true);

    try {
      await addTicketReply(
        selectedTicket.id!,
        user.uid,
        userProfile.email,
        userProfile.displayName || userProfile.email,
        true,
        replyMessage
      );

      showToast('Reply sent successfully', 'success');
      setReplyMessage('');

      if (selectedTicket.status === 'open') {
        await handleStatusChange(selectedTicket.id!, 'in_progress');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      showToast('Failed to send reply', 'error');
    } finally {
      setSendingReply(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'closed':
        return <XCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      open: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[priority as keyof typeof styles]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  const filteredTickets = statusFilter === 'all'
    ? tickets
    : tickets.filter(ticket => ticket.status === statusFilter);

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    closed: tickets.filter(t => t.status === 'closed').length
  };

  if (selectedTicket) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <button
          onClick={handleBackToList}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to all tickets
        </button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {getStatusIcon(selectedTicket.status)}
                <h1 className="text-2xl font-bold text-gray-900">{selectedTicket.subject}</h1>
              </div>
              <div className="flex items-center gap-2 flex-wrap mb-4">
                {getStatusBadge(selectedTicket.status)}
                {getPriorityBadge(selectedTicket.priority)}
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                  {selectedTicket.category.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Change Status
              </label>
              <select
                value={selectedTicket.status}
                onChange={(e) => handleStatusChange(selectedTicket.id!, e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-500">From:</span>
                <span className="ml-2 font-medium">{selectedTicket.userName}</span>
              </div>
              <div>
                <span className="text-gray-500">Email:</span>
                <span className="ml-2 font-medium">{selectedTicket.userEmail}</span>
              </div>
              <div>
                <span className="text-gray-500">Created:</span>
                <span className="ml-2">{selectedTicket.createdAt.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-500">Updated:</span>
                <span className="ml-2">{selectedTicket.updatedAt.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Description:</h3>
              <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">{selectedTicket.description}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Conversation ({ticketReplies.length + 1})
            </h2>

            {loadingReplies ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {selectedTicket.userName}
                      </span>
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-600 text-white">
                        TICKET CREATOR
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {selectedTicket.createdAt.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>
                {ticketReplies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`p-4 rounded-lg ${
                      reply.isAdmin
                        ? 'bg-primary-50 border border-primary-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {reply.userName}
                        </span>
                        {reply.isAdmin && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-600 text-white">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {reply.createdAt.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{reply.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSendReply} className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send Reply
            </label>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-3"
              placeholder="Type your reply here..."
              required
            />
            <button
              type="submit"
              disabled={sendingReply || !replyMessage.trim()}
              className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 mr-2" />
              {sendingReply ? 'Sending...' : 'Send Reply'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Helpdesk Management</h1>
        <p className="text-gray-600 mt-2">Manage and respond to user support tickets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Tickets</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{ticketStats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Open</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{ticketStats.open}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">In Progress</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{ticketStats.inProgress}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Resolved</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{ticketStats.resolved}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Closed</p>
          <p className="text-2xl font-bold text-gray-600 mt-1">{ticketStats.closed}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">All Tickets</h2>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {loadingTickets ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No tickets found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => handleTicketClick(ticket)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(ticket.status)}
                      <h3 className="text-lg font-semibold text-gray-900">{ticket.subject}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      From: <span className="font-medium">{ticket.userName}</span> ({ticket.userEmail})
                    </p>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {ticket.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {ticket.category.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xs text-gray-500">
                      {ticket.createdAt.toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {ticket.createdAt.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HelpdeskManagementPage() {
  return (
    <AdminRoute>
      <HelpdeskManagementContent />
    </AdminRoute>
  );
}

import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { faqs } from '../../data/faqs';
import {
  HelpCircle,
  MessageSquare,
  Search,
  ChevronDown,
  ChevronUp,
  Send,
  User,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

export const SupportPage: React.FC = () => {
  const { userProfile, orders, showToast } = useShop();

  const [activeFaqCategory, setActiveFaqCategory] = useState<string>('All');
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(faqs[0].id);

  // Live Chat Simulation State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'agent',
      text: `Good day ${userProfile.name.split(' ')[0]}! Welcome to AURA Private Client Concierge. How may I assist your shopping or shipment today?`,
      time: 'Just now',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Support Ticket Form State
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Order & Delivery Queries');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const categoriesList = ['All', 'Orders & Tracking', 'Returns & Refunds', 'Payments & Offers', 'Authenticity & Warranty'];

  const filteredFaqs = faqs.filter((faq) => {
    if (activeFaqCategory !== 'All' && faq.category !== activeFaqCategory) {
      return false;
    }
    if (faqSearch.trim()) {
      const q = faqSearch.toLowerCase();
      return (
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: text.trim(),
      time: 'Just now',
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = 'Thank you for reaching out. A Senior Concierge Specialist has received your request.';
      const lower = text.toLowerCase();

      if (lower.includes('track') || lower.includes('order')) {
        const latestOrder = orders[0];
        reply = `Your latest order #${latestOrder.orderNumber} is currently "${latestOrder.status}" with arrival scheduled for ${latestOrder.estimatedDelivery}. You can view the live airway map under My Orders.`;
      } else if (lower.includes('return') || lower.includes('refund')) {
        reply = 'AURA offers a complimentary 10-day doorstep return policy. Simply navigate to My Orders, click "Return / Replace" and our courier will inspect and collect the item with instant refund initiation.';
      } else if (lower.includes('coupon') || lower.includes('discount')) {
        reply = 'You currently have code FESTIVAL50 active on your account granting up to ₹7,500 instant discount on electronics. Would you like me to guide you to the Offers gallery?';
      } else {
        reply = `I have logged this under your Diamond VIP client profile. Our direct phone desk is also available toll-free at 1800-889-AURA for urgent inquiries.`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: 'agent-' + Date.now(),
          sender: 'agent',
          text: reply,
          time: 'Just now',
        },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    setTicketSubmitted(true);
    showToast('Ticket Generated', 'Support Ticket #TK-8892 created with 2-hour SLA response', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4" /> 24/7 Client Assistance
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
          AURA Help Center & Concierge
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Instant answers to delivery, authentication, returns, or live consultation with our dedicated customer support team.
        </p>

        {/* Search FAQs Input */}
        <div className="relative max-w-md mx-auto pt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 mt-1" />
          <input
            type="text"
            placeholder="Search FAQs (e.g. delivery time, returns, warranty)..."
            value={faqSearch}
            onChange={(e) => setFaqSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: FAQs Accordion (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFaqCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  activeFaqCategory === cat
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isExpanded = expandedFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/50 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Support Ticket Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              Generate a Concierge Support Ticket
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Need assistance with an invoice amendment, warranty documentation, or logistics escalation?
            </p>

            {ticketSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Ticket #TK-8892 Created Successfully
                </div>
                Your ticket has been assigned to a Senior Concierge Officer. Guaranteed response within 2 hours.
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Issue Category</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5"
                    >
                      <option>Order & Delivery Queries</option>
                      <option>Returns & Doorstep Pickup</option>
                      <option>Product Warranty & Repairs</option>
                      <option>Payment & Invoicing</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Schedule technician delivery"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Message Details</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide order number or specifics..."
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2.5"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Submit Ticket
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right: Live Concierge Chat Simulation (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl sticky top-28 flex flex-col h-[560px]">
            {/* Chat Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-indigo-400">
                  A
                </div>
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    AURA Concierge Officer
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[10px] text-slate-300">Active · Average reply &lt; 30s</span>
                </div>
              </div>
            </div>

            {/* Quick Action Chips */}
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto text-[10px]">
              {['Track my order', 'Return policy', 'Apply coupon', 'Delivery times'].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 whitespace-nowrap cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-50/50 dark:bg-slate-950/30">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1 text-[11px] text-slate-400 italic pl-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1">Concierge is replying...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2"
            >
              <input
                type="text"
                placeholder="Type your message here..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

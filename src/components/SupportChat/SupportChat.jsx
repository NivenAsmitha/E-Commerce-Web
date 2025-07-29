import React, { useEffect, useState } from "react";
import { Send, MessageCircle, Clock, AlertCircle } from "lucide-react";

export default function SupportChat({ userId: propUserId }) {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");

  const API_BASE = "http://localhost/kaizen-backend";

  // Get user ID from props or localStorage
  useEffect(() => {
    if (propUserId) {
      setUserId(propUserId);
    } else {
      const id = localStorage.getItem("user_id");
      if (id) setUserId(id);
    }
  }, [propUserId]);

  // Fetch messages
  const fetchMessages = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_BASE}/get_messages.php?user_id=${userId}`);
      const data = await res.json();
      setMessages(data || []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setError("Unable to load chat.");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  // Send message
  const handleSend = async () => {
    if (!msg.trim() || !userId || loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/send_message.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, message: msg.trim() }),
      });
      const result = await res.json();

      if (result.success) {
        setMsg("");
        fetchMessages();
      } else {
        setError(result.error || "Failed to send message.");
      }
    } catch (err) {
      console.error("Send error:", err);
      setError("Network error while sending.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!userId) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow text-center text-yellow-600 border border-yellow-300">
        <MessageCircle className="mx-auto mb-2" size={48} />
        <p className="text-lg font-semibold">
          ⚠️ Please log in to chat with support.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg mt-6">
      {/* Header */}
      <div className="mb-4 border-b pb-3">
        <h2 className="text-2xl font-bold text-pink-600 flex items-center gap-2">
          <MessageCircle size={20} /> Customer Support
        </h2>
        <p className="text-sm text-gray-500">Our team will respond shortly.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Chat Messages */}
      <div className="mb-4 max-h-96 overflow-y-auto space-y-3 bg-gray-50 dark:bg-gray-800 p-3 rounded">
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center">No messages yet.</div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="space-y-2">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-pink-200 dark:bg-pink-600 text-black dark:text-white px-4 py-2 rounded-lg max-w-xs shadow-sm">
                  <p>{m.message}</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(m.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Support Reply */}
              {m.reply && (
                <div className="flex justify-start">
                  <div className="bg-green-100 dark:bg-green-700 text-black dark:text-white px-4 py-2 rounded-lg max-w-xs shadow-sm">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-200">
                      Support:
                    </p>
                    <p>{m.reply}</p>
                    {m.replied_at && (
                      <p className="text-xs text-gray-500 dark:text-gray-300 mt-1 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(m.replied_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="flex flex-col gap-2">
        <textarea
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-800 dark:text-white"
          rows={3}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button
          className={`bg-pink-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
            loading || !msg.trim()
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-pink-600"
          }`}
          onClick={handleSend}
          disabled={loading || !msg.trim()}
        >
          <Send size={16} />
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

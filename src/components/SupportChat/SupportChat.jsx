import React, { useEffect, useState } from "react";

export default function SupportChat({ userId: propUserId }) {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // Load userId from props or localStorage
  useEffect(() => {
    if (propUserId) {
      setUserId(propUserId);
    } else {
      try {
        const stored = JSON.parse(localStorage.getItem("user"));
        if (stored?.id > 0) {
          setUserId(stored.id);
        } else {
          console.warn("No valid user in localStorage");
        }
      } catch (err) {
        console.error("Failed to parse localStorage user:", err);
      }
    }
  }, [propUserId]);

  // Fetch messages
  const fetchMessages = () => {
    if (!userId) return;
    fetch(`http://localhost/kaizen-backend/get_messages.php?user_id=${userId}`)
      .then((res) => res.json())
      .then(setMessages)
      .catch((err) => console.error("Failed to fetch messages:", err));
  };

  useEffect(() => {
    fetchMessages();
  }, [userId]);

  useEffect(() => {
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  // Send message
  const handleSend = async () => {
    if (!msg.trim() || !userId) return;
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost/kaizen-backend/send_message.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, message: msg }),
        }
      );
      const result = await res.json();
      if (!result.success) {
        console.error("Send failed:", result);
        alert("Message failed to send.");
      }
      setMsg("");
      fetchMessages();
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Error sending message.");
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="text-center text-red-500 mt-10">
        ⚠️ User not logged in. Please login or set localStorage.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Customer Support</h2>

      <div className="mb-4 max-h-80 overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <div className="text-gray-400">No messages yet.</div>
        ) : (
          messages.map((m) => (
            <div key={m.id}>
              <div className="font-semibold text-primary">{m.message}</div>
              {m.reply && (
                <div className="ml-4 text-green-600">
                  <b>Support:</b> {m.reply}
                </div>
              )}
              <div className="text-xs text-gray-400">
                {new Date(m.created_at).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

      <textarea
        className="w-full border rounded p-2"
        rows={2}
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Type your message..."
      />
      <button
        className="bg-primary text-white rounded px-4 py-2 mt-2"
        disabled={loading}
        onClick={handleSend}
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
}

import React, { useEffect, useState } from "react";

export default function SupportChat({ userId }) {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`http://localhost/kaizen-backend/get_messages.php?user_id=${userId}`)
      .then((res) => res.json())
      .then(setMessages);
  }, [userId]);

  const handleSend = async () => {
    if (!msg.trim()) return;
    setLoading(true);
    await fetch("http://localhost/kaizen-backend/send_message.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, message: msg }),
    });
    setMsg("");
    setLoading(false);
    fetch(`http://localhost/kaizen-backend/get_messages.php?user_id=${userId}`)
      .then((res) => res.json())
      .then(setMessages);
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 p-6 rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4">Customer Support</h2>
      <div className="mb-4 space-y-3 max-h-80 overflow-y-auto">
        {messages.map((m) => (
          <div key={m.id}>
            <div className="font-semibold text-primary">{m.message}</div>
            {m.reply && (
              <div className="ml-4 mt-1 text-green-600 dark:text-green-400">
                <b>Support:</b> {m.reply}
              </div>
            )}
          </div>
        ))}
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

import React, { useEffect, useState } from "react";

export default function SupportDashboard({ supportId }) {
  const [messages, setMessages] = useState([]);
  const [replyMap, setReplyMap] = useState({});

  useEffect(() => {
    fetch(`http://localhost/kaizen-backend/get_messages.php?support=1`)
      .then((res) => res.json())
      .then(setMessages);
  }, []);

  const handleReply = async (id) => {
    const reply = replyMap[id];
    if (!reply) return;
    await fetch("http://localhost/kaizen-backend/reply_message.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, reply, support_id: supportId }),
    });
    fetch(`http://localhost/kaizen-backend/get_messages.php?support=1`)
      .then((res) => res.json())
      .then(setMessages);
    setReplyMap((rm) => ({ ...rm, [id]: "" }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 p-6 rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4">Support Dashboard</h2>
      <div className="space-y-6">
        {messages.map((m) => (
          <div key={m.id} className="p-4 rounded border">
            <div>
              <b>User:</b> {m.username || m.user_id}
              <div className="text-primary">{m.message}</div>
            </div>
            {m.reply ? (
              <div className="mt-2 text-green-700 dark:text-green-400">
                <b>Replied:</b> {m.reply}
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  className="border rounded px-2 py-1 w-full"
                  value={replyMap[m.id] || ""}
                  onChange={(e) =>
                    setReplyMap((rm) => ({ ...rm, [m.id]: e.target.value }))
                  }
                  placeholder="Reply to user..."
                />
                <button
                  className="bg-primary text-white px-4 py-1 rounded"
                  onClick={() => handleReply(m.id)}
                >
                  Reply
                </button>
              </div>
            )}
            <div className="text-xs text-gray-400 mt-1">
              {new Date(m.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

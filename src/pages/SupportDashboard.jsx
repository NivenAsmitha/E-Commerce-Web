import React, { useEffect, useState } from "react";

export default function SupportDashboard({ supportId }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chat, setChat] = useState([]);
  const [reply, setReply] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    fetch("http://localhost/kaizen-backend/get_open_users.php")
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => {
        console.error("Failed to fetch open users:", err);
        setUsers([]);
      });
  }, [refresh]);

  useEffect(() => {
    if (!selectedUser) return;
    fetch(
      `http://localhost/kaizen-backend/get_messages.php?user_id=${selectedUser.user_id}`
    )
      .then((res) => res.json())
      .then(setChat)
      .catch(() => setChat([]));
  }, [selectedUser, refresh]);

  useEffect(() => {
    const interval = setInterval(() => setRefresh((r) => r + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleReply = async () => {
    if (!reply.trim() || !selectedUser || !supportId) return;

    const openMessages = chat.filter((m) => !m.reply);
    if (openMessages.length === 0) return;

    let failed = false;

    for (const msg of openMessages) {
      const payload = {
        id: msg.id,
        reply: reply.trim(),
        support_id: supportId,
      };

      try {
        const res = await fetch(
          "http://localhost/kaizen-backend/reply_message.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        const result = await res.json();

        if (!result.success) {
          console.error("Reply failed:", result);
          failed = true;
        }
      } catch (err) {
        console.error("Network error:", err);
        failed = true;
      }
    }

    if (failed) {
      alert("Some replies failed. Check console for details.");
    } else {
      setReply("");
      setRefresh((r) => r + 1);
    }
  };

  return (
    <div className="flex bg-white rounded-xl shadow-lg my-8 mx-auto max-w-4xl min-h-[500px]">
      {/* Sidebar */}
      <aside className="w-1/3 bg-pink-50 border-r p-6 rounded-l-xl">
        <h2 className="text-lg font-bold mb-4 text-pink-700">Open Users</h2>
        {users.length === 0 ? (
          <div className="text-gray-400">No open chats.</div>
        ) : (
          <ul>
            {users.map((u, i) => (
              <li
                key={`${u.user_id}-${i}`}
                className={`cursor-pointer px-2 py-2 rounded mb-1 hover:bg-pink-100 ${
                  selectedUser?.user_id === u.user_id ? "bg-pink-200" : ""
                }`}
                onClick={() => setSelectedUser(u)}
              >
                {u.username}
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* Chat Panel */}
      <main className="flex-1 p-6">
        {!selectedUser ? (
          <div className="text-center text-gray-400 my-32">
            Select a user to view messages
          </div>
        ) : (
          <div>
            <h3 className="font-bold text-lg mb-3 text-primary">
              Chat with{" "}
              <span className="text-pink-600">{selectedUser.username}</span>
            </h3>

            <div className="bg-gray-100 p-3 rounded h-64 overflow-y-auto space-y-4 mb-4">
              {chat.length === 0 ? (
                <div className="text-gray-400">No messages yet.</div>
              ) : (
                chat.map((msg) => (
                  <div key={msg.id}>
                    <div className="font-semibold text-pink-800">
                      {msg.message}
                    </div>
                    {msg.reply && (
                      <div className="ml-4 text-green-600">
                        <b>Support:</b> {msg.reply}
                      </div>
                    )}
                    <div className="text-xs text-gray-400">
                      {new Date(msg.created_at).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>

            {chat.some((m) => !m.reply) && (
              <div className="flex gap-2">
                <input
                  type="text"
                  className="border rounded px-2 py-1 flex-1"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Reply to user..."
                />
                <button
                  className="bg-primary text-white px-4 py-1 rounded"
                  onClick={handleReply}
                >
                  Send
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// src/components/SupportDashboard.jsx

import React, { useEffect, useState } from "react";
import { SendHorizontal } from "lucide-react";

const SupportDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyValue, setReplyValue] = useState("");
  const supportId = localStorage.getItem("supportId"); // ✅ required

  // Fetch open users on load
  useEffect(() => {
    fetch("http://localhost/kaizen-backend/get_open_users.php")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // Fetch messages for selected user
  useEffect(() => {
    if (!selectedUserId) return;

    fetch(
      `http://localhost/kaizen-backend/get_messages.php?user_id=${selectedUserId}`
    )
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Error fetching messages:", err));
  }, [selectedUserId]);

  // Send reply to user
  const handleReply = async () => {
    if (!replyValue.trim() || !supportId || !selectedUserId) return;

    const latestMessage = messages[messages.length - 1];
    const messageId = latestMessage?.id;

    try {
      const res = await fetch(
        "http://localhost/kaizen-backend/reply_message.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: messageId,
            reply: replyValue,
            support_id: supportId,
          }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setReplyValue("");
        // Refresh messages
        const refreshed = await fetch(
          `http://localhost/kaizen-backend/get_messages.php?user_id=${selectedUserId}`
        );
        const refreshedMessages = await refreshed.json();
        setMessages(refreshedMessages);
      } else {
        alert(data.error || "Failed to send reply");
      }
    } catch (err) {
      alert("Reply error: " + err.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left: User List */}
      <div className="w-1/4 border-r overflow-y-auto bg-pink-100">
        <h2 className="text-xl font-bold p-4 text-pink-800">Open Chats</h2>
        {users.length === 0 && (
          <p className="px-4 text-sm text-gray-600">No active users.</p>
        )}
        {users.map((user) => (
          <div
            key={user.user_id}
            onClick={() => setSelectedUserId(user.user_id)}
            className={`cursor-pointer px-4 py-3 hover:bg-pink-200 ${
              selectedUserId === user.user_id
                ? "bg-pink-300 font-semibold text-pink-900"
                : "text-gray-800"
            }`}
          >
            {user.username}
          </div>
        ))}
      </div>

      {/* Right: Chat Area */}
      <div className="w-3/4 flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {selectedUserId ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 flex ${
                  msg.reply ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 rounded-lg max-w-md ${
                    msg.reply
                      ? "bg-pink-400 text-white"
                      : "bg-white border border-pink-300"
                  }`}
                >
                  {msg.reply || msg.message}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center mt-10">
              Select a user to view messages
            </p>
          )}
        </div>

        {/* Reply Input */}
        {selectedUserId && (
          <div className="p-4 border-t bg-white flex items-center">
            <input
              type="text"
              placeholder="Type your reply..."
              className="flex-1 border border-gray-300 p-2 rounded mr-2"
              value={replyValue}
              onChange={(e) => setReplyValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleReply()}
            />
            <button
              onClick={handleReply}
              className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded"
            >
              <SendHorizontal className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportDashboard;

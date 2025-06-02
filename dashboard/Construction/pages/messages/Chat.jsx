import React, { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";

export default function Chat({ activeUser, messages, onSend }) {
  const messageEndRef = useRef(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setNewMessage("");
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex-1 flex flex-col bg-neutral-900 h-screen overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-800 bg-neutral-950 flex-shrink-0">
        <div className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden">
          <img
            src={activeUser?.avatar}
            alt={activeUser?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-base font-medium text-white">
          {activeUser?.name}
        </div>
      </div>

      {/* Scrollable chat body */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.from === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-5 py-3 rounded-2xl text-sm leading-relaxed break-words max-w-[50%] ${
                msg.from === "me"
                  ? "bg-neutral-700 text-white text-right"
                  : "bg-neutral-800 text-white text-left"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {/* Input footer */}
      <div className="sticky bottom-0 z-20 bg-neutral-950 border-t border-neutral-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleEnter}
            placeholder="Type a message..."
            className="flex-1 px-5 py-3 rounded-full bg-neutral-800 text-white text-sm focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 transition p-3 rounded-full"
          >
            <FiSend className="text-white w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

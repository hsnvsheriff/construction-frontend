import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Chat from "./Chat";

const users = [
  { id: 1, name: "Ali Rezai", lastMessage: "I'll send the update soon.", avatar: "https://i.pravatar.cc/36?img=32" },
  { id: 2, name: "Project Manager", lastMessage: "Site A needs inspection.", avatar: "https://i.pravatar.cc/36?img=33" },
  { id: 3, name: "Sarah from QA", lastMessage: "Fixed the bug you mentioned.", avatar: "https://i.pravatar.cc/36?img=34" },
  { id: 4, name: "Ahmed (Supplier)", lastMessage: "Delivery confirmed.", avatar: "https://i.pravatar.cc/36?img=35" },
  { id: 5, name: "Site B Electrician", lastMessage: "Power restored.", avatar: "https://i.pravatar.cc/36?img=36" },
  { id: 6, name: "Logistics", lastMessage: "Truck dispatched.", avatar: "https://i.pravatar.cc/36?img=37" },
  { id: 7, name: "Nina", lastMessage: "Double-checked the blueprint.", avatar: "https://i.pravatar.cc/36?img=38" },
];

const initialMessages = {
  1: [
    { from: "them", text: "Hey, any updates?" },
    { from: "me", text: "Almost done. Will send tonight." },
  ],
  2: [{ from: "them", text: "Checklist reviewed?" }],
};

export default function Messages() {
  const [activeUserId, setActiveUserId] = useState(1);
  const [allMessages, setAllMessages] = useState(initialMessages);

  const activeUser = users.find((u) => u.id === activeUserId);
  const messages = allMessages[activeUserId] || [];

  const handleSend = (newText) => {
    setAllMessages((prev) => ({
      ...prev,
      [activeUserId]: [...(prev[activeUserId] || []), { from: "me", text: newText }],
    }));
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full flex bg-neutral-900 text-white overflow-hidden">
      <Sidebar
        users={users}
        activeUserId={activeUserId}
        setActiveUserId={setActiveUserId}
      />
      <Chat
        activeUser={activeUser}
        messages={messages}
        onSend={handleSend}
      />
    </div>
  );
}

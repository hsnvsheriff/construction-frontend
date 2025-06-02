import React from "react";

export default function Sidebar({ users, activeUserId, setActiveUserId }) {
  return (
    <div className="w-[280px] border-r border-neutral-800 bg-neutral-950 flex flex-col">
      <div className="px-4 py-3 text-lg font-semibold border-b border-neutral-800">
        Messages
      </div>
      <div className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => setActiveUserId(user.id)}
            className={`cursor-pointer flex items-center px-4 py-3 border-b border-neutral-800 gap-3 hover:bg-neutral-800 transition ${
              activeUserId === user.id ? "bg-neutral-800" : ""
            }`}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="min-w-0">
              <div className="font-medium text-sm truncate">{user.name}</div>
              <div className="text-xs text-neutral-400 truncate">{user.lastMessage}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

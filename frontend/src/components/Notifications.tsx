import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markNotificationRead } from "../api/notifications";
import socket from "../socket";

export default function Notifications() {
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  useEffect(() => {
    const handler = () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };

    socket.on("notification:new", handler);

    return () => {
      socket.off("notification:new", handler);
    };
  }, [queryClient]);

  const handleClick = async (id: string) => {
    await markNotificationRead(id);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  return (
    <div className="relative group">
      <button className="relative p-2 text-slate-500 hover:text-indigo-600 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {notifications.some(n => !n.isRead) && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        )}
      </button>

      {/* Dropdown Panel */}
      <div className="absolute right-0 mt-2 w-80 z-50 transform scale-95 opacity-0 invisible group-hover:scale-100 group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right">
        <div className="glass-panel rounded-xl shadow-xl overflow-hidden ring-1 ring-black/5">
          <div className="px-4 py-3 border-b border-slate-100 bg-white/50">
            <h3 className="font-semibold text-slate-800 text-sm">Notifications</h3>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 && (
              <div className="p-4 text-center text-sm text-slate-500">
                No new notifications
              </div>
            )}
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 border-b border-slate-50 hover:bg-indigo-50/50 cursor-pointer transition-colors ${n.isRead ? "opacity-60" : "bg-indigo-50/30"}`}
                onClick={() => handleClick(n.id)}
              >
                <p className="text-sm text-slate-700 leading-snug">{n.message}</p>
                <p className="text-[10px] text-slate-400 mt-1">{new Date().toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

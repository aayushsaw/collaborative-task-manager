import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import CreateTaskForm from "../components/CreateTaskForm";
import TaskList from "../components/TaskList";
import Notifications from "../components/Notifications";

import { getTasks } from "../api/tasks";
import socket from "../socket";

import type { Task } from "../types/task";
import { useAuth } from "../context/auth-context";

export default function Dashboard() {
  // -----------------------------
  // Auth & Socket
  // -----------------------------
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user?.id) {
      socket.emit("join", user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    socket.on("task:created", () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });

    socket.on("task:updated", () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });

    return () => {
      socket.off("task:created");
      socket.off("task:updated");
    };
  }, [queryClient]);

  // -----------------------------
  // Filter & Sort State
  // -----------------------------
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // -----------------------------
  // Fetch Tasks
  // -----------------------------
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", status, priority, sortOrder],
    queryFn: () =>
      getTasks({
        status: status || undefined,
        priority: priority || undefined,
        sortByDueDate: sortOrder,
      }),
  });

  // -----------------------------
  // Derived Views (CORRECT LOGIC)
  // -----------------------------
  const assignedTasks = tasks.filter(
    (task: Task) => task.assignedToId === user?.id
  );

  const createdTasks = tasks.filter(
    (task: Task) => task.creatorId === user?.id
  );

  const overdueTasks = tasks.filter(
    (task: Task) => new Date(task.dueDate) < new Date()
  );

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-50">
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Welcome back, {user?.name}</p>
        </div>
        <div className="flex gap-2">
          <CreateTaskForm />
          <div className="p-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/40 shadow-sm">
            <Notifications />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center group hover:-translate-y-1 transition-transform">
          <span className="text-4xl font-bold text-indigo-600 mb-1">{assignedTasks.length}</span>
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Assigned</span>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center group hover:-translate-y-1 transition-transform">
          <span className="text-4xl font-bold text-purple-600 mb-1">{createdTasks.length}</span>
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Created</span>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center group hover:-translate-y-1 transition-transform">
          <span className="text-4xl font-bold text-amber-500 mb-1">{tasks.filter((t: any) => t.status === 'IN_PROGRESS').length}</span>
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">In Progress</span>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center group hover:-translate-y-1 transition-transform">
          <span className="text-4xl font-bold text-red-500 mb-1">{overdueTasks.length}</span>
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Overdue</span>
        </div>
      </div>

      {/* Filters & Sorting */}
      <div className="glass-panel p-4 rounded-xl flex flex-wrap gap-4 items-center">
        <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-2">Filters</span>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="p-2 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Status</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="REVIEW">Review</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="p-2 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>

        <div className="w-px h-8 bg-slate-200 mx-2 hidden md:block"></div>

        <select
          value={sortOrder}
          onChange={(e) =>
            setSortOrder(e.target.value as "asc" | "desc")
          }
          className="p-2 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="asc">Due Date (Earliest)</option>
          <option value="desc">Due Date (Latest)</option>
        </select>
      </div>

      {isLoading && (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 pb-12">
        {/* We wrap lists in specific containers or just render them. TaskList likely maps over tasks. 
              Let's pass a className to TaskList if it accepts one, or update TaskList next.
          */}
        <div className="xl:col-span-1">
          <TaskList title="Assigned to Me" tasks={assignedTasks} />
        </div>
        <div className="xl:col-span-1">
          <TaskList title="Created by Me" tasks={createdTasks} />
        </div>
        <div className="xl:col-span-1">
          <TaskList title="Overdue Tasks" tasks={overdueTasks} />
        </div>
      </div>
    </div>
  );
}

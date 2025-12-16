import { useState } from "react";
import { AxiosError } from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "../api/client";
import { getUsers } from "../api/users";
import type { User } from "../types/user";

// Define validation schema
const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  dueDate: z.string().min(1, "Due Date is required"),
  assignedToId: z.string().min(1, "Assignee is required"),
});

type CreateTaskFormValues = z.infer<typeof createTaskSchema>;

export default function CreateTaskForm() {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      dueDate: "",
      assignedToId: "",
    },
  });

  // -----------------------------
  // Fetch Users for Dropdown
  // -----------------------------
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  // -----------------------------
  // Handlers
  // -----------------------------
  const onSubmit = async (data: CreateTaskFormValues) => {
    setServerError("");
    try {
      await api.post("/tasks", {
        ...data,
        dueDate: new Date(data.dueDate).toISOString(),
      });

      // Refresh all task lists
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      // Reset form & Close modal
      reset();
      (document.getElementById('create-task-modal') as HTMLDialogElement)?.close();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setServerError(error.response?.data?.message || "Failed to create task");
    }
  };

  return (
    <div className="md:w-96">
      <button
        onClick={() => { (document.getElementById('create-task-modal') as HTMLDialogElement)?.showModal() }}
        className="btn-primary w-full shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        New Task
      </button>

      <dialog id="create-task-modal" className="modal m-auto bg-transparent p-0 backdrop:bg-slate-900/40 backdrop:backdrop-blur-sm rounded-2xl shadow-2xl">
        <div className="glass-panel p-6 w-[90vw] max-w-lg animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-800">Create New Task</h2>
            <form method="dialog">
              <button className="text-slate-400 hover:text-slate-600 transition-colors" onClick={() => reset()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </form>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{serverError}</div>}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input
                {...register("title")}
                placeholder="e.g. Redesign Landing Page"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 text-slate-700"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                {...register("description")}
                placeholder="Add details about the task..."
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 text-slate-700"
                rows={3}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select
                  {...register("priority")}
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
                {errors.priority && <p className="text-red-500 text-xs mt-1">{errors.priority.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                <input
                  type="datetime-local"
                  {...register("dueDate")}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-700"
                />
                {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Assignee</label>
              <select
                {...register("assignedToId")}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700"
              >
                <option value="">{usersLoading ? "Loading users..." : "Select Team Member"}</option>
                {users.map((user: User) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              {errors.assignedToId && <p className="text-red-500 text-xs mt-1">{errors.assignedToId.message}</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-3 text-lg shadow-xl shadow-indigo-500/20"
              >
                {isSubmitting ? "Creating..." : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}

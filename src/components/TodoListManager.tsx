'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, Plus, Trash2, Calendar, AlertCircle, 
  CheckCircle2, Circle, Clock, Tag, Sparkles 
} from 'lucide-react';

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate?: string | null;
  createdAt: string;
}

export const TodoListManager: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'DONE'>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/todos');
      const data = await res.json();
      if (data.todos) {
        setTodos(data.todos);
      }
    } catch (err) {
      console.error('Error fetching todos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          priority,
          dueDate: dueDate || null,
        }),
      });

      if (res.ok) {
        setNewTitle('');
        setDueDate('');
        fetchTodos();
      }
    } catch (err) {
      console.error('Error adding todo:', err);
    }
  };

  const handleToggleTodo = async (id: string, currentStatus: boolean) => {
    // Optimistic UI update
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !currentStatus } : t))
    );

    try {
      await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, completed: !currentStatus }),
      });
    } catch (err) {
      console.error('Error toggling todo:', err);
      fetchTodos();
    }
  };

  const handleDeleteTodo = async (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    try {
      await fetch(`/api/todos?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Error deleting todo:', err);
      fetchTodos();
    }
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === 'ACTIVE') return !t.completed;
    if (filter === 'DONE') return t.completed;
    return true;
  });

  const PRIORITY_BADGES = {
    HIGH: { label: 'Ưu Tiên Cao 🔴', bg: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
    MEDIUM: { label: 'Trung Bình 🟡', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    LOW: { label: 'Ưu Tiên Thấp 🔵', bg: 'bg-sky-500/10 text-sky-500 border-sky-500/20' },
  };

  return (
    <div className="modern-card p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1117]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Danh Sách ViệC Cần Làm (Todo List)</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quản lý các nhiệm vụ cần thực hiện trong ngày với độ ưu tiên rõ ràng
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          {[
            { id: 'ALL', label: 'Tất Cả' },
            { id: 'ACTIVE', label: 'Đang Làm' },
            { id: 'DONE', label: 'Đã Xong' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f.id
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form: Add New Todo */}
      <form onSubmit={handleAddTodo} className="mb-6 space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Nhập việc cần làm hôm nay (VD: Mua thực phẩm nấu cơm, đọc 10 trang sách...)..."
            className="flex-1 w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D1117] text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D1117] text-xs font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="HIGH">🔴 Ưu Tiên Cao</option>
              <option value="MEDIUM">🟡 Trung Bình</option>
              <option value="LOW">🔵 Ưu Tiên Thấp</option>
            </select>

            <button
              type="submit"
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Việc</span>
            </button>
          </div>
        </div>
      </form>

      {/* Todo Items List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-slate-200/50 dark:bg-slate-800/40 animate-pulse" />
          ))}
        </div>
      ) : filteredTodos.length > 0 ? (
        <div className="space-y-2.5">
          {filteredTodos.map((todo) => {
            const pBadge = PRIORITY_BADGES[todo.priority] || PRIORITY_BADGES.MEDIUM;
            return (
              <div
                key={todo.id}
                className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                  todo.completed
                    ? 'bg-slate-100/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                    : 'bg-white dark:bg-[#161B22] border-slate-200 dark:border-slate-800 hover:border-amber-500/50 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggleTodo(todo.id, todo.completed)}
                    className="flex-shrink-0 text-amber-500 hover:scale-110 transition-transform"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400 hover:text-amber-500" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <span className={`text-sm font-semibold block truncate ${
                      todo.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'
                    }`}>
                      {todo.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${pBadge.bg}`}>
                    {pBadge.label}
                  </span>

                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Xóa công việc"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center border-dashed border-2 border-slate-200 dark:border-slate-800 rounded-2xl">
          <CheckSquare className="w-10 h-10 text-amber-500 mx-auto mb-2" />
          <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">
            Chưa có công việc nào trong danh sách
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Hãy nhập việc cần làm ở form trên để lên kế hoạch công việc!
          </p>
        </div>
      )}

    </div>
  );
};

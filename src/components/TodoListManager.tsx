'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, Plus, Trash2, Calendar, AlertCircle, 
  Clock, CheckCircle2, Circle, Sparkles, Filter 
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

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
      const res = await fetch('/api/todos', { cache: 'no-store' });
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

      const data = await res.json();
      if (data.todo) {
        setTodos([data.todo, ...todos]);
        setNewTitle('');
        setDueDate('');
      }
    } catch (err) {
      console.error('Error adding todo:', err);
    }
  };

  const handleToggleTodo = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: nextStatus } : t))
    );

    try {
      await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          completed: nextStatus,
        }),
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

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="modern-card p-4 sm:p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1117]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex-shrink-0">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 whitespace-nowrap">
              <span>Danh Sách Việc Cần Làm (Todo List)</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quản lý task công việc ngắn hạn, ưu tiên theo màu sắc
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'ALL', label: 'Tất cả' },
            { id: 'ACTIVE', label: `Đang làm (${activeCount})` },
            { id: 'DONE', label: 'Đã xong' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                filter === f.id
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAddTodo} className="flex flex-col sm:flex-row items-stretch gap-2.5 mb-6">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Thêm công việc cần làm hôm nay (VD: Mua sách, hoàn thành báo cáo)..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500"
        />

        <div className="flex items-center gap-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="HIGH">🔴 Cao</option>
            <option value="MEDIUM">🟡 Vừa</option>
            <option value="LOW">🔵 Thấp</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
          />

          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md active:scale-95 transition-all whitespace-nowrap flex-shrink-0"
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            <span>Thêm Task</span>
          </button>
        </div>
      </form>

      {/* Todo Items List */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
          ))}
        </div>
      ) : filteredTodos.length > 0 ? (
        <div className="space-y-2.5">
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                todo.completed
                  ? 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                  : 'bg-slate-50 dark:bg-[#161B22] border-slate-200 dark:border-slate-800 hover:border-amber-500/40'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  onClick={() => handleToggleTodo(todo.id, todo.completed)}
                  className={`p-1 rounded-lg transition-all flex-shrink-0 ${
                    todo.completed ? 'text-emerald-500' : 'text-slate-400 hover:text-amber-500'
                  }`}
                >
                  {todo.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </button>

                <div className="min-w-0 flex-1">
                  <p className={`text-xs sm:text-sm font-bold truncate ${
                    todo.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'
                  }`}>
                    {todo.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                  todo.priority === 'HIGH'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    : todo.priority === 'MEDIUM'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                }`}>
                  {todo.priority === 'HIGH' ? 'Gấp 🔴' : todo.priority === 'MEDIUM' ? 'Vừa 🟡' : 'Thong thả 🔵'}
                </span>

                {todo.dueDate && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 whitespace-nowrap">
                    <Calendar className="w-3 h-3" />
                    <span>{todo.dueDate}</span>
                  </span>
                )}

                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                  title="Xóa công việc"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center border-dashed border-2 border-slate-200 dark:border-slate-800 rounded-2xl">
          <CheckCircle2 className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Chưa có công việc nào. Nhập tiêu đề ở trên để tạo task mới nhé!
          </p>
        </div>
      )}

    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { X, PlusCircle, Sparkles, Moon, Dumbbell, BookOpen, Utensils, Sun, Clock } from 'lucide-react';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
}

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  isOpen,
  onClose,
  onAdded,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('CUSTOM');
  const [icon, setIcon] = useState('Sparkles');
  const [timeOfDay, setTimeOfDay] = useState('ANYTIME');
  const [targetDays, setTargetDays] = useState(7);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          icon,
          timeOfDay,
          targetDaysPerWeek: targetDays,
        }),
      });

      if (res.ok) {
        onAdded();
        onClose();
        setTitle('');
        setDescription('');
      }
    } catch (err) {
      console.error('Error adding habit:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="clay-card w-full max-w-md p-6 relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-slate-800 text-indigo-600">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-slate-100">
              Thêm Thói Quen Mới ✨
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Loại bỏ thói quen xấu, xây dựng kỷ luật mới
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Tên thói quen *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Đánh răng & Skincare tối, Đọc sách 15p..."
              className="w-full p-3 rounded-xl border border-amber-200 dark:border-slate-700 bg-amber-50/20 dark:bg-slate-800 text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Mô tả ngắn
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="VD: Giúp mặt sạch mụn, tự tin hơn mỗi sáng"
              className="w-full p-3 rounded-xl border border-amber-200 dark:border-slate-700 bg-amber-50/20 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Time of Day selection */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
              Thời điểm thực hiện ⏰
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'MORNING', label: 'Buổi Sáng 🌅' },
                { key: 'EVENING', label: 'Buổi Tối 🌙' },
                { key: 'ANYTIME', label: 'Bất Kỳ Lúc Nào ⚡' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setTimeOfDay(item.key)}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                    timeOfDay === item.key
                      ? 'border-amber-500 bg-amber-500 text-white shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Icon selection */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
              Biểu tượng Icon
            </label>
            <div className="flex gap-3">
              {[
                { iconName: 'Sparkles', iconComp: <Sparkles className="w-5 h-5 text-amber-500" /> },
                { iconName: 'Moon', iconComp: <Moon className="w-5 h-5 text-indigo-500" /> },
                { iconName: 'Dumbbell', iconComp: <Dumbbell className="w-5 h-5 text-emerald-500" /> },
                { iconName: 'BookOpen', iconComp: <BookOpen className="w-5 h-5 text-sky-500" /> },
                { iconName: 'Utensils', iconComp: <Utensils className="w-5 h-5 text-rose-500" /> },
              ].map((item) => (
                <button
                  key={item.iconName}
                  type="button"
                  onClick={() => setIcon(item.iconName)}
                  className={`p-3 rounded-2xl border flex items-center justify-center transition-all ${
                    icon === item.iconName
                      ? 'border-amber-500 bg-amber-100 dark:bg-slate-800 ring-2 ring-amber-500'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.iconComp}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-sm shadow-clay-btn hover:from-amber-600 hover:to-amber-700"
            >
              Thêm Thói Quen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { X, Sparkles, Sun, Moon, Clock, Calendar, Check } from 'lucide-react';
import { format } from 'date-fns';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
}

const ICONS = [
  { id: 'Sparkles', emoji: '✨', label: 'Tỏa sáng' },
  { id: 'Smile', emoji: '🪥', label: 'Vệ sinh cá nhân' },
  { id: 'Dumbbell', emoji: '🏋️', label: 'Thể dục' },
  { id: 'Book', emoji: '📚', label: 'Học tập' },
  { id: 'Cooking', emoji: '🍱', label: 'Nấu ăn' },
  { id: 'Bed', emoji: '🌙', label: 'Ngủ sớm' },
  { id: 'Water', emoji: '💧', label: 'Uống nước' },
  { id: 'Heart', emoji: '❤️', label: 'Sức khỏe' },
];

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  isOpen,
  onClose,
  onAdded,
}) => {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('ANYTIME');
  const [selectedIcon, setSelectedIcon] = useState('Sparkles');
  const [startDate, setStartDate] = useState(todayStr);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Vui lòng nhập tên thói quen!');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          timeOfDay,
          icon: selectedIcon,
          startDate: startDate || todayStr,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTitle('');
        setDescription('');
        setTimeOfDay('ANYTIME');
        setSelectedIcon('Sparkles');
        setStartDate(todayStr);
        onAdded();
        onClose();
      } else {
        setErrorMsg(data.error || 'Có lỗi xảy ra khi tạo thói quen.');
      }
    } catch (err) {
      console.error('Error adding habit:', err);
      setErrorMsg('Không thể kết nối đến server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg modern-card bg-white dark:bg-[#0D1117] border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Thêm Thói Quen Mới ✨
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Loại bỏ thói quen xấu, xây dựng kỷ luật mới
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tên thói quen <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Đánh răng & Skincare tối, Tập chống đẩy 20 cái..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Mô tả ngắn
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="VD: Giúp mặt sạch mụn, tự tin hơn mỗi sáng..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Start Date Selection (Ngày Bắt Đầu 📅) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>Ngày bắt đầu thói quen 📅</span>
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#161B22] text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none font-sans"
            />
          </div>

          {/* Time of Day Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Thời điểm thực hiện ⏰
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'MORNING', label: 'Buổi Sáng 🌅' },
                { id: 'EVENING', label: 'Buổi Tối 🌙' },
                { id: 'ANYTIME', label: 'Bất Kỳ Lúc Nào ⚡' },
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTimeOfDay(t.id)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    timeOfDay === t.id
                      ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                      : 'bg-slate-50 dark:bg-[#161B22] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Biểu tượng Icon
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {ICONS.map((icon) => (
                <button
                  type="button"
                  key={icon.id}
                  onClick={() => setSelectedIcon(icon.id)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    selectedIcon === icon.id
                      ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500'
                      : 'bg-slate-50 dark:bg-[#161B22] border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                  title={icon.label}
                >
                  <span className="text-xl">{icon.emoji}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang tạo...' : 'Thêm Thói Quen'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

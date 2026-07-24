'use client';

import React from 'react';
import { Camera, Calendar, Image as ImageIcon, Sparkles } from 'lucide-react';

interface PhotoGalleryProps {
  proofImageUrl?: string | null;
  notes?: string | null;
  logDate: string;
  onOpenUpload: () => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  proofImageUrl,
  notes,
  logDate,
  onOpenUpload,
}) => {
  return (
    <div className="modern-card p-5 sm:p-8 mt-6 bg-white/90 dark:bg-[#0D1117]/90 border border-slate-200 dark:border-slate-800">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex-shrink-0">
            <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
              Kho Ảnh Minh Chứng 📸
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Lưu giữ hình ảnh cơm tự nấu, phòng tập, da mặt skincare mỗi ngày
            </p>
          </div>
        </div>

        <button
          onClick={onOpenUpload}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs sm:text-sm shadow-md hover:from-amber-600 hover:to-orange-600 transition-all whitespace-nowrap flex-shrink-0 self-start sm:self-auto"
        >
          <Camera className="w-4 h-4 flex-shrink-0" />
          <span>{proofImageUrl ? 'Đổi Ảnh Nỗ Lực' : 'Tải Ảnh Nỗ Lực'}</span>
        </button>
      </div>

      {proofImageUrl ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-md group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={proofImageUrl}
              alt="Supabase Daily Effort Proof"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 text-amber-300 text-xs font-bold backdrop-blur-md flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{logDate}</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 mb-2 uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Nhật ký nỗ lực hôm nay
            </span>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 italic leading-relaxed">
              {notes || 'Hôm nay bạn đã chiến thắng sự lười biếng và ghi điểm nỗ lực xuất sắc!'}
            </p>
          </div>
        </div>
      ) : (
        <div 
          onClick={onOpenUpload}
          className="border-2 border-dashed border-amber-500/30 rounded-3xl p-6 sm:p-8 text-center cursor-pointer hover:border-amber-500 bg-amber-500/5 transition-all"
        >
          <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 mx-auto mb-3 animate-bounce-subtle" />
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Chưa có ảnh minh chứng hôm nay
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Bấm vào đây để tải ảnh bữa cơm tự nấu 🍱, da mặt skincare 🧼 hoặc dụng cụ tập gym 🏋️!
          </p>
        </div>
      )}

    </div>
  );
};

'use client';

import React, { useState, useRef } from 'react';
import { X, UploadCloud, Image as ImageIcon, Loader2, CheckCircle, Sparkles } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (imageUrl: string, notes: string) => void;
  currentNotes?: string;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentNotes = '',
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>(currentNotes);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('Kích thước ảnh tối đa là 10MB');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMsg(null);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !notes.trim()) {
      setErrorMsg('Vui lòng chọn ảnh minh chứng hoặc viết ghi chú');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);

    try {
      let uploadedUrl = '';

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('notes', notes);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Tải ảnh lên Supabase thất bại');
        }
        uploadedUrl = data.imageUrl;
      } else {
        // Just note update
        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes }),
        });
      }

      onSuccess(uploadedUrl, notes);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Có lỗi xảy ra khi tải ảnh');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="clay-card w-full max-w-lg p-6 relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-amber-100 dark:bg-slate-800 text-amber-600">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-slate-100">
              Upload Ảnh Minh Chứng Nỗ Lực 📸
            </h2>
            <p className="text-xs text-amber-800/80 dark:text-slate-400">
              Lưu trực tiếp vào Supabase Storage (`daily-photos`)
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          
          {/* File Picker / Preview Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
              previewUrl
                ? 'border-amber-400 bg-amber-50/50 dark:bg-slate-800/50'
                : 'border-slate-300 dark:border-slate-700 hover:border-amber-400 bg-slate-50 dark:bg-slate-800/30'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Proof preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 px-3 py-1 rounded-full bg-slate-900/70 text-white text-xs font-semibold backdrop-blur-sm">
                  Bấm để đổi ảnh khác
                </div>
              </div>
            ) : (
              <div className="text-center">
                <ImageIcon className="w-10 h-10 text-amber-500 mx-auto mb-2 animate-bounce-subtle" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Nhấp để tải ảnh minh chứng lên (Bữa cơm, phòng tập, da mặt sạch,...)
                </p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG tối đa 10MB</p>
              </div>
            )}
          </div>

          {/* Notes input */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
              Ghi chú nỗ lực hôm nay ✍️
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Dù mệt nhưng vẫn chạy 2km và tự tay nấu món gà xào nấm 🍱!"
              className="w-full p-3 rounded-2xl border border-amber-200 dark:border-slate-700 bg-amber-50/30 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {errorMsg && (
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl border border-rose-200">
              ⚠️ {errorMsg}
            </p>
          )}

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-clay-btn transition-all disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang Upload...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Lưu Nỗ Lực Hàng Ngày</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

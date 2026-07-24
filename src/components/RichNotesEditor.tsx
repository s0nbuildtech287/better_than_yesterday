'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Trash2, Save, Table, Heading1, Heading2, Heading3, 
  List, ListOrdered, CheckSquare, Quote, Sparkles, Pin, Bookmark 
} from 'lucide-react';

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  category: string;
  pinned: boolean;
  updatedAt: string;
}

export const RichNotesEditor: React.FC = () => {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'EDIT' | 'PREVIEW'>('EDIT');

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/notes', { cache: 'no-store' });
      const data = await res.json();
      if (data.notes && data.notes.length > 0) {
        setNotes(data.notes);
        if (!activeNoteId) {
          setActiveNoteId(data.notes[0].id);
          setTitle(data.notes[0].title);
          setContent(data.notes[0].content);
        }
      } else {
        setNotes([]);
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSelectNote = (note: NoteItem) => {
    setActiveNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleCreateNewNote = async () => {
    try {
      const defaultContent = `# Tiêu Đề Ghi Chú Mới 📝\n\n## 1. Ý lớn H1\n- Ý con 1.1\n  - Ý bé hơn 1.1.1\n  - Ý bé hơn 1.1.2\n\n## 2. Bảng Theo Dõi\n| Hạng Mục | Chi Tiết | Trạng Thái |\n| --- | --- | --- |\n| Công việc 1 | Chuẩn bị báo cáo | Hoàn thành |\n| Công việc 2 | Đánh giá tiến độ | Đang làm |\n`;

      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Ghi chú mới',
          content: defaultContent,
        }),
      });

      const data = await res.json();
      if (data.note) {
        setNotes([data.note, ...notes]);
        setActiveNoteId(data.note.id);
        setTitle(data.note.title);
        setContent(data.note.content);
      }
    } catch (err) {
      console.error('Error creating note:', err);
    }
  };

  const handleSaveNote = async () => {
    if (!activeNoteId) return;
    setIsSaving(true);

    try {
      await fetch('/api/notes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeNoteId,
          title,
          content,
        }),
      });

      setNotes((prev) =>
        prev.map((n) => (n.id === activeNoteId ? { ...n, title, content } : n))
      );
    } catch (err) {
      console.error('Error saving note:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await fetch(`/api/notes?id=${id}`, { method: 'DELETE' });
      const updated = notes.filter((n) => n.id !== id);
      setNotes(updated);
      if (updated.length > 0) {
        setActiveNoteId(updated[0].id);
        setTitle(updated[0].title);
        setContent(updated[0].content);
      } else {
        setActiveNoteId(null);
        setTitle('');
        setContent('');
      }
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  const insertSnippet = (snippet: string) => {
    setContent((prev) => prev + '\n' + snippet);
  };

  return (
    <div className="modern-card p-4 sm:p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1117] min-h-[500px] flex flex-col justify-between">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 whitespace-nowrap">
              <span>Ghi Chú Notion-Style</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Phân cấp ý lớn, ý bé, chèn bảng Table & lưu trực tiếp Database
            </p>
          </div>
        </div>

        <button
          onClick={handleCreateNewNote}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all whitespace-nowrap flex-shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 flex-shrink-0" />
          <span>Tạo Ghi Chú Mới</span>
        </button>
      </div>

      {/* Main Grid: Left Notes List + Right Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        
        {/* Left Sidebar Notes List */}
        <div className="lg:col-span-1 border-r border-slate-200 dark:border-slate-800/80 pr-0 lg:pr-4 space-y-2 max-h-[300px] lg:max-h-[500px] overflow-y-auto">
          <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2">
            Danh Sách Ghi Chú ({notes.length})
          </div>

          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => handleSelectNote(note)}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                activeNoteId === note.id
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-500 font-bold'
                  : 'bg-slate-50 dark:bg-[#161B22] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 truncate min-w-0">
                <Bookmark className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs truncate whitespace-nowrap">{note.title || 'Chưa đặt tên'}</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNote(note.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity flex-shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Right Editor Area */}
        <div className="lg:col-span-3 space-y-4 flex flex-col min-w-0">
          {activeNoteId ? (
            <>
              {/* Note Title & Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Tiêu đề ghi chú..."
                  className="text-base sm:text-lg font-bold bg-transparent border-b border-slate-200 dark:border-slate-800 pb-1 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 flex-1 min-w-0"
                />

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setViewMode(viewMode === 'EDIT' ? 'PREVIEW' : 'EDIT')}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap"
                  >
                    {viewMode === 'EDIT' ? '👁️ Xem Trước' : '✏️ Chỉnh Sửa'}
                  </button>

                  <button
                    onClick={handleSaveNote}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap"
                  >
                    <Save className="w-4 h-4 flex-shrink-0" />
                    <span>{isSaving ? 'Đang lưu...' : 'Lưu Ghi Chú'}</span>
                  </button>
                </div>
              </div>

              {/* Formatting Toolbar */}
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 text-xs overflow-x-auto no-scrollbar">
                <button
                  onClick={() => insertSnippet('# Ý Lớn H1')}
                  className="px-2.5 py-1 rounded bg-white dark:bg-[#0D1117] hover:bg-amber-500/20 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1 whitespace-nowrap flex-shrink-0"
                  title="Chèn Ý Lớn H1"
                >
                  <Heading1 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span>H1 (Ý lớn)</span>
                </button>

                <button
                  onClick={() => insertSnippet('## Ý Vừa H2')}
                  className="px-2.5 py-1 rounded bg-white dark:bg-[#0D1117] hover:bg-amber-500/20 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1 whitespace-nowrap flex-shrink-0"
                  title="Chèn Ý Vừa H2"
                >
                  <Heading2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span>H2 (Ý vừa)</span>
                </button>

                <button
                  onClick={() => insertSnippet('### Ý Nhỏ H3')}
                  className="px-2.5 py-1 rounded bg-white dark:bg-[#0D1117] hover:bg-amber-500/20 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1 whitespace-nowrap flex-shrink-0"
                  title="Chèn Ý Nhỏ H3"
                >
                  <Heading3 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>H3 (Ý nhỏ)</span>
                </button>

                <button
                  onClick={() => insertSnippet('- Ý con 1\n  - Ý bé hơn 1.1\n    - Ý bé hơn nữa 1.1.1')}
                  className="px-2.5 py-1 rounded bg-white dark:bg-[#0D1117] hover:bg-amber-500/20 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1 whitespace-nowrap flex-shrink-0"
                  title="Thụt lề ý bé"
                >
                  <List className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                  <span>Ý Bé Thụt Lề</span>
                </button>

                <button
                  onClick={() => insertSnippet('| Tiêu Đề 1 | Tiêu Đề 2 | Tiêu Đề 3 |\n| --- | --- | --- |\n| Nội dung 1 | Nội dung 2 | Nội dung 3 |\n| Nội dung 4 | Nội dung 5 | Nội dung 6 |')}
                  className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold flex items-center gap-1 border border-amber-500/30 whitespace-nowrap flex-shrink-0"
                  title="Chèn Bảng Table"
                >
                  <Table className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span>Chèn Bảng (Table)</span>
                </button>

                <button
                  onClick={() => insertSnippet('> 💡 Ghi chú quan trọng: Hãy duy trì kỷ luật mỗi ngày!')}
                  className="px-2.5 py-1 rounded bg-white dark:bg-[#0D1117] hover:bg-amber-500/20 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1 whitespace-nowrap flex-shrink-0"
                >
                  <Quote className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                  <span>Quote</span>
                </button>
              </div>

              {/* Editor vs Preview Mode */}
              {viewMode === 'EDIT' ? (
                <textarea
                  rows={12}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Bắt đầu gõ ghi chú của bạn tại đây..."
                  className="w-full flex-1 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#0D1117] text-slate-100 font-mono text-xs leading-relaxed focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              ) : (
                <div className="w-full flex-1 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#161B22] text-slate-100 font-sans prose dark:prose-invert max-w-none text-xs leading-relaxed whitespace-pre-wrap">
                  {content}
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center border-dashed border-2 border-slate-200 dark:border-slate-800 rounded-2xl my-auto">
              <FileText className="w-10 h-10 text-amber-500 mx-auto mb-2" />
              <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                Chưa chọn ghi chú nào
              </h4>
              <p className="text-xs text-slate-500 mt-1 mb-3">
                Hãy chọn 1 ghi chú bên trái hoặc bấm tạo ghi chú mới!
              </p>
              <button
                onClick={handleCreateNewNote}
                className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs whitespace-nowrap"
              >
                Tạo Ghi Chú Mới
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import { FaTrash, FaPen, FaCheck, FaTimes } from 'react-icons/fa';
import { FiZap } from 'react-icons/fi';
import { t } from '@extension/i18n';

interface Bookmark {
  id: number;
  title: string;
  content: string;
}

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onBookmarkSelect: (content: string) => void;
  onBookmarkUpdateTitle?: (id: number, title: string) => void;
  onBookmarkDelete?: (id: number) => void;
  onBookmarkReorder?: (draggedId: number, targetId: number) => void;
  isDarkMode?: boolean;
}

const BookmarkList: React.FC<BookmarkListProps> = ({
  bookmarks,
  onBookmarkSelect,
  onBookmarkUpdateTitle,
  onBookmarkDelete,
  onBookmarkReorder,
  isDarkMode = false,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = (bookmark: Bookmark) => {
    setEditingId(bookmark.id);
    setEditTitle(bookmark.title);
  };

  const handleSaveEdit = (id: number) => {
    if (onBookmarkUpdateTitle && editTitle.trim()) {
      onBookmarkUpdateTitle(id, editTitle);
    }
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedId(id);
    e.dataTransfer.setData('text/plain', id.toString());
    // Add more transparent effect
    e.currentTarget.classList.add('opacity-25');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-25');
    setDraggedId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (draggedId === null || draggedId === targetId) return;

    if (onBookmarkReorder) {
      onBookmarkReorder(draggedId, targetId);
    }
  };

  // Focus the input field when entering edit mode
  useEffect(() => {
    if (editingId !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  if (bookmarks.length === 0) return null;

  return (
    <div className="px-4 pb-6">
      <div className="mb-2.5 flex items-center gap-1.5">
        <FiZap className="size-3.5 text-sky-500" />
        <h3 className={`text-[11px] font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {t('chat_bookmarks_header')}
        </h3>
      </div>

      <div className="flex flex-col gap-2">
        {bookmarks.map(bookmark => (
          <div
            key={bookmark.id}
            draggable={editingId !== bookmark.id}
            onDragStart={e => handleDragStart(e, bookmark.id)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, bookmark.id)}
            className={`group relative flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all ${
              isDarkMode
                ? 'border-white/5 bg-slate-900/60 hover:border-sky-500/40 hover:bg-slate-900'
                : 'border-slate-200/70 bg-white shadow-sm hover:border-sky-300 hover:shadow-md'
            }`}>
            {editingId === bookmark.id ? (
              <div className="flex w-full items-center gap-1.5">
                <input
                  ref={inputRef}
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSaveEdit(bookmark.id);
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  className={`min-w-0 grow rounded-lg border px-2 py-1 text-sm outline-none ${
                    isDarkMode
                      ? 'border-sky-500/40 bg-slate-800 text-slate-200'
                      : 'border-sky-200 bg-white text-slate-700'
                  }`}
                />
                <button
                  onClick={() => handleSaveEdit(bookmark.id)}
                  className={`rounded-lg p-1.5 transition-colors ${
                    isDarkMode
                      ? 'text-emerald-400 hover:bg-white/5'
                      : 'text-emerald-500 hover:bg-slate-100'
                  }`}
                  aria-label={t('chat_bookmarks_saveEdit')}
                  type="button">
                  <FaCheck size={13} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className={`rounded-lg p-1.5 transition-colors ${
                    isDarkMode ? 'text-rose-400 hover:bg-white/5' : 'text-rose-500 hover:bg-slate-100'
                  }`}
                  aria-label={t('chat_bookmarks_cancelEdit')}
                  type="button">
                  <FaTimes size={13} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onBookmarkSelect(bookmark.content)}
                className="flex w-full min-w-0 items-center gap-2.5 text-left">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400/20 to-blue-500/20 text-sm">
                  <FiZap className="size-3.5 text-sky-500" />
                </span>
                <span
                  className={`min-w-0 flex-1 truncate text-sm font-medium ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                  {bookmark.title}
                </span>
                <span
                  className={`mr-12 shrink-0 text-[10px] font-medium opacity-0 transition-opacity group-hover:opacity-100 ${
                    isDarkMode ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                  Run
                </span>
              </button>
            )}

            {editingId !== bookmark.id && (
              <>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleEditClick(bookmark);
                  }}
                  className={`absolute right-8 top-1/2 z-10 -translate-y-1/2 rounded-lg p-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${
                    isDarkMode ? 'text-sky-400 hover:bg-white/10' : 'text-sky-500 hover:bg-slate-100'
                  }`}
                  aria-label={t('chat_bookmarks_edit')}
                  type="button">
                  <FaPen size={12} />
                </button>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    if (onBookmarkDelete) {
                      onBookmarkDelete(bookmark.id);
                    }
                  }}
                  className={`absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-lg p-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${
                    isDarkMode ? 'text-slate-400 hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                  aria-label={t('chat_bookmarks_delete')}
                  type="button">
                  <FaTrash size={12} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarkList;

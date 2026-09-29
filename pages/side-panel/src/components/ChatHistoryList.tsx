/* eslint-disable react/prop-types */
import { FaTrash } from 'react-icons/fa';
import { BsBookmark } from 'react-icons/bs';
import { FiInbox } from 'react-icons/fi';
import { t } from '@extension/i18n';

interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
}

interface ChatHistoryListProps {
  sessions: ChatSession[];
  onSessionSelect: (sessionId: string) => void;
  onSessionDelete: (sessionId: string) => void;
  onSessionBookmark: (sessionId: string) => void;
  visible: boolean;
  isDarkMode?: boolean;
}

const ChatHistoryList: React.FC<ChatHistoryListProps> = ({
  sessions,
  onSessionSelect,
  onSessionDelete,
  onSessionBookmark,
  visible,
  isDarkMode = false,
}) => {
  if (!visible) return null;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="h-full overflow-y-auto px-4 py-4">
      {sessions.length === 0 ? (
        <div
          className={`mt-16 flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-10 text-center ${
            isDarkMode ? 'border-white/10 text-slate-400' : 'border-slate-300 text-slate-500'
          }`}>
          <FiInbox className="size-6" />
          <p className="text-xs font-medium">{t('chat_history_empty')}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {sessions.map(session => (
            <div
              key={session.id}
              className={`group relative flex items-center gap-3 rounded-xl border px-3 py-3 transition-all ${
                isDarkMode
                  ? 'border-white/5 bg-slate-900/60 hover:border-sky-500/40 hover:bg-slate-900'
                  : 'border-slate-200/70 bg-white shadow-sm hover:border-sky-300 hover:shadow-md'
              }`}>
              <button onClick={() => onSessionSelect(session.id)} className="min-w-0 flex-1 text-left" type="button">
                <h3 className={`truncate pr-16 text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  {session.title}
                </h3>
                <p className={`mt-0.5 text-[11px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {formatDate(session.createdAt)}
                </p>
              </button>

              <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                {onSessionBookmark && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onSessionBookmark(session.id);
                    }}
                    className={`rounded-lg p-1.5 ${
                      isDarkMode ? 'text-sky-400 hover:bg-white/10' : 'text-sky-500 hover:bg-slate-100'
                    }`}
                    aria-label={t('chat_history_bookmark')}
                    type="button">
                    <BsBookmark size={13} />
                  </button>
                )}

                <button
                  onClick={e => {
                    e.stopPropagation();
                    onSessionDelete(session.id);
                  }}
                  className={`rounded-lg p-1.5 ${
                    isDarkMode ? 'text-slate-400 hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                  aria-label={t('chat_history_delete')}
                  type="button">
                  <FaTrash size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistoryList;

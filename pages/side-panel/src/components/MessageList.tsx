import type { Message } from '@extension/storage';
import { ACTOR_PROFILES } from '../types/message';
import { memo } from 'react';

interface MessageListProps {
  messages: Message[];
  isDarkMode?: boolean;
}

const PROGRESS_MESSAGE = 'Showing progress...';

export default memo(function MessageList({ messages, isDarkMode = false }: MessageListProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {messages.map((message, index) => (
        <MessageBlock
          key={`${message.actor}-${message.timestamp}-${index}`}
          message={message}
          isSameActor={index > 0 ? messages[index - 1].actor === message.actor : false}
          isDarkMode={isDarkMode}
        />
      ))}
    </div>
  );
});

interface MessageBlockProps {
  message: Message;
  isSameActor: boolean;
  isDarkMode?: boolean;
}

function MessageBlock({ message, isSameActor, isDarkMode = false }: MessageBlockProps) {
  if (!message.actor) {
    console.error('No actor found');
    return <div />;
  }

  const actor = ACTOR_PROFILES[message.actor as keyof typeof ACTOR_PROFILES];
  const isProgress = message.content === PROGRESS_MESSAGE;
  const isUser = message.actor === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-gradient-to-br from-sky-500 to-blue-600 px-3.5 py-2 text-sm leading-relaxed text-white shadow-lg shadow-sky-500/20">
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5">
      <div className="w-7 shrink-0">
        {!isSameActor && (
          <div
            className="flex size-7 items-center justify-center rounded-full shadow-sm"
            style={{ backgroundColor: actor.iconBackground }}>
            <img src={actor.icon} alt={actor.name} className="size-4" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        {!isSameActor && (
          <div className="mb-1 flex items-baseline gap-2">
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              {actor.name}
            </span>
            {!isProgress && (
              <span className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {formatTimestamp(message.timestamp)}
              </span>
            )}
          </div>
        )}

        {isProgress ? (
          <div className="flex items-center gap-2 py-1">
            <div className={`h-1 flex-1 overflow-hidden rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
              <div className="h-full w-1/3 animate-progress rounded-full bg-gradient-to-r from-sky-400 to-blue-500" />
            </div>
            <span className={`shrink-0 text-[10px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Working
            </span>
          </div>
        ) : (
          <div
            className={`rounded-2xl rounded-tl-md border px-3 py-2 text-sm leading-relaxed ${
              isDarkMode
                ? 'border-white/5 bg-slate-900/70 text-slate-300'
                : 'border-slate-200/70 bg-white text-slate-700 shadow-sm'
            }`}>
            <div className="whitespace-pre-wrap break-words">{message.content}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Formats a timestamp (in milliseconds) to a readable time string
 * @param timestamp Unix timestamp in milliseconds
 * @returns Formatted time string
 */
function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();

  // Check if the message is from today
  const isToday = date.toDateString() === now.toDateString();

  // Check if the message is from yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  // Check if the message is from this year
  const isThisYear = date.getFullYear() === now.getFullYear();

  // Format the time (HH:MM)
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isToday) {
    return timeStr; // Just show the time for today's messages
  }

  if (isYesterday) {
    return `Yesterday, ${timeStr}`;
  }

  if (isThisYear) {
    // Show month and day for this year
    return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
  }

  // Show full date for older messages
  return `${date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}, ${timeStr}`;
}

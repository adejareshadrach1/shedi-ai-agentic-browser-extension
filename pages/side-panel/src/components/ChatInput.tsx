import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { FaMicrophone } from 'react-icons/fa';
import { FiPaperclip, FiArrowUp, FiSquare, FiX, FiRotateCcw } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { t } from '@extension/i18n';

interface ChatInputProps {
  onSendMessage: (text: string, displayText?: string) => void;
  onStopTask: () => void;
  onMicClick?: () => void;
  isRecording?: boolean;
  isProcessingSpeech?: boolean;
  disabled: boolean;
  showStopButton: boolean;
  setContent?: (setter: (text: string) => void) => void;
  isDarkMode?: boolean;
  // Historical session ID - if provided, shows replay button instead of send button
  historicalSessionId?: string | null;
  onReplay?: (sessionId: string) => void;
}

// File attachment interface
interface AttachedFile {
  name: string;
  content: string;
  type: string;
}

export default function ChatInput({
  onSendMessage,
  onStopTask,
  onMicClick,
  isRecording = false,
  isProcessingSpeech = false,
  disabled,
  showStopButton,
  setContent,
  isDarkMode = false,
  historicalSessionId,
  onReplay,
}: ChatInputProps) {
  const [text, setText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const isSendButtonDisabled = useMemo(
    () => disabled || (text.trim() === '' && attachedFiles.length === 0),
    [disabled, text, attachedFiles],
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle text changes and resize textarea
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);

    // Resize textarea
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
    }
  };

  // Expose a method to set content from outside
  useEffect(() => {
    if (setContent) {
      setContent(setText);
    }
  }, [setContent]);

  // Initial resize when component mounts
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
    }
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedText = text.trim();

      if (trimmedText || attachedFiles.length > 0) {
        let messageContent = trimmedText;
        let displayContent = trimmedText;

        // Security: Clearly separate user input from file content
        // The background service will sanitize file content using guardrails
        if (attachedFiles.length > 0) {
          const fileContents = attachedFiles
            .map(file => {
              // Tag file content for background service to identify and sanitize
              return `\n\n<nano_file_content type="file" name="${file.name}">\n${file.content}\n</nano_file_content>`;
            })
            .join('\n');

          // Combine user message with tagged file content (for background service)
          messageContent = trimmedText
            ? `${trimmedText}\n\n<nano_attached_files>${fileContents}</nano_attached_files>`
            : `<nano_attached_files>${fileContents}</nano_attached_files>`;

          // Create display version with only filenames (for UI)
          const fileList = attachedFiles.map(file => `📎 ${file.name}`).join('\n');
          displayContent = trimmedText ? `${trimmedText}\n\n${fileList}` : fileList;
        }

        onSendMessage(messageContent, displayContent);
        setText('');
        setAttachedFiles([]);
      }
    },
    [text, attachedFiles, onSendMessage],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit],
  );

  const handleReplay = useCallback(() => {
    if (historicalSessionId && onReplay) {
      onReplay(historicalSessionId);
    }
  }, [historicalSessionId, onReplay]);

  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: AttachedFile[] = [];
    const allowedTypes = ['.txt', '.md', '.markdown', '.json', '.csv', '.log', '.xml', '.yaml', '.yml'];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();

      // Check if file type is allowed
      if (!allowedTypes.includes(fileExt)) {
        console.warn(`File type ${fileExt} not supported. Only text-based files are allowed.`);
        continue;
      }

      // Check file size (limit to 1MB)
      if (file.size > 1024 * 1024) {
        console.warn(`File ${file.name} is too large. Maximum size is 1MB.`);
        continue;
      }

      try {
        const content = await file.text();
        newFiles.push({
          name: file.name,
          content,
          type: file.type || 'text/plain',
        });
      } catch (error) {
        console.error(`Error reading file ${file.name}:`, error);
      }
    }

    if (newFiles.length > 0) {
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const iconButtonClass = (active = false) =>
    `rounded-lg p-2 transition-colors ${
      disabled
        ? 'cursor-not-allowed opacity-40'
        : active
          ? 'bg-rose-500 text-white hover:bg-rose-600'
          : isDarkMode
            ? 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
    }`;

  return (
    <form onSubmit={handleSubmit} aria-label={t('chat_input_form')}>
      <div
        className={`overflow-hidden rounded-2xl border transition-all focus-within:ring-2 focus-within:ring-sky-500/25 ${
          disabled
            ? isDarkMode
              ? 'border-white/5 bg-slate-900/50'
              : 'border-slate-200 bg-slate-100'
            : isDarkMode
              ? 'border-white/10 bg-slate-900 focus-within:border-sky-500/50'
              : 'border-slate-200 bg-white shadow-sm focus-within:border-sky-400'
        }`}>
        {/* File attachments display */}
        {attachedFiles.length > 0 && (
          <div
            className={`flex flex-wrap gap-1.5 border-b p-2 ${
              isDarkMode ? 'border-white/5 bg-slate-800/50' : 'border-slate-100 bg-slate-50'
            }`}>
            {attachedFiles.map((file, index) => (
              <div
                key={index}
                className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] ${
                  isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600 shadow-sm'
                }`}>
                <FiPaperclip className="size-3" />
                <span className="max-w-[140px] truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className={`ml-0.5 rounded transition-colors ${
                    isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-200'
                  }`}
                  aria-label={`Remove ${file.name}`}>
                  <FiX className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-disabled={disabled}
          rows={1}
          className={`max-h-[100px] w-full resize-none border-none bg-transparent px-3.5 pt-3 text-sm leading-relaxed outline-none placeholder:text-slate-400 ${
            disabled
              ? 'cursor-not-allowed text-slate-400'
              : isDarkMode
                ? 'text-slate-200'
                : 'text-slate-800'
          }`}
          placeholder={attachedFiles.length > 0 ? 'Add a message (optional)...' : t('chat_input_placeholder')}
          aria-label={t('chat_input_editor')}
        />

        <div className="flex items-center justify-between px-2 pb-2 pt-1">
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={handleFileSelect}
              disabled={disabled}
              aria-label="Attach files"
              title="Attach text files (txt, md, json, csv, etc.)"
              className={iconButtonClass()}>
              <FiPaperclip className="size-4" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".txt,.md,.markdown,.json,.csv,.log,.xml,.yaml,.yml"
              onChange={handleFileChange}
              className="hidden"
              aria-hidden="true"
            />

            {onMicClick && (
              <button
                type="button"
                onClick={onMicClick}
                disabled={disabled || isProcessingSpeech}
                aria-label={
                  isProcessingSpeech
                    ? t('chat_stt_processing')
                    : isRecording
                      ? t('chat_stt_recording_stop')
                      : t('chat_stt_input_start')
                }
                className={iconButtonClass(isRecording)}>
                {isProcessingSpeech ? (
                  <AiOutlineLoading3Quarters className="size-4 animate-spin" />
                ) : (
                  <FaMicrophone className={`size-4 ${isRecording ? 'animate-pulse' : ''}`} />
                )}
              </button>
            )}
          </div>

          {showStopButton ? (
            <button
              type="button"
              onClick={onStopTask}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-rose-600">
              <FiSquare className="size-3" />
              {t('chat_buttons_stop')}
            </button>
          ) : historicalSessionId ? (
            <button
              type="button"
              onClick={handleReplay}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-600">
              <FiRotateCcw className="size-3.5" />
              {t('chat_buttons_replay')}
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSendButtonDisabled}
              aria-disabled={isSendButtonDisabled}
              aria-label={t('chat_buttons_send')}
              className={`inline-flex size-8 items-center justify-center rounded-xl transition-all ${
                isSendButtonDisabled
                  ? isDarkMode
                    ? 'cursor-not-allowed bg-slate-800 text-slate-600'
                    : 'cursor-not-allowed bg-slate-100 text-slate-400'
                  : 'bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/25 hover:scale-105 active:scale-95'
              }`}>
              <FiArrowUp className="size-4" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

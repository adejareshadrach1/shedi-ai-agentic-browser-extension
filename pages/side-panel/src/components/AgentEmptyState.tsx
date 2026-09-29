import { FiGlobe, FiMousePointer, FiEdit3, FiDatabase } from 'react-icons/fi';
import { t } from '@extension/i18n';

interface AgentEmptyStateProps {
  isDarkMode?: boolean;
}

const CAPABILITIES = [
  { icon: FiGlobe, label: 'Browse' },
  { icon: FiMousePointer, label: 'Click' },
  { icon: FiEdit3, label: 'Fill forms' },
  { icon: FiDatabase, label: 'Extract data' },
];

/**
 * Hero shown when a task session is empty. Keeps the panel feeling like an
 * agent console rather than an empty chat.
 */
export default function AgentEmptyState({ isDarkMode = false }: AgentEmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-2 pb-6 pt-4 text-center">
      <div className="relative mb-4">
        <div
          className={`absolute inset-0 animate-pulse rounded-2xl blur-xl ${
            isDarkMode ? 'bg-sky-500/25' : 'bg-sky-400/30'
          }`}
        />
        <div className="relative flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shadow-sky-500/30">
          <img src="/icon-128.png" alt="Shedi AI" className="size-8" />
        </div>
      </div>

      <h1 className={`text-lg font-semibold tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
        {t('chat_input_placeholder')}
      </h1>
      <p className={`mt-1 max-w-[280px] text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        Describe a task in plain language. Shedi AI drives your browser, reports progress live, and can continue with
        follow-ups.
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
        {CAPABILITIES.map(({ icon: Icon, label }) => (
          <span
            key={label}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
              isDarkMode
                ? 'border-white/5 bg-white/5 text-slate-300'
                : 'border-slate-200 bg-white text-slate-600 shadow-sm'
            }`}>
            <Icon className="size-3 text-sky-500" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

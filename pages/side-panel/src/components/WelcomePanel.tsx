import { FiArrowUpRight, FiCpu } from 'react-icons/fi';
import { t } from '@extension/i18n';

interface WelcomePanelProps {
  isDarkMode?: boolean;
}

/**
 * First-run state: no LLM provider configured yet.
 */
export default function WelcomePanel({ isDarkMode = false }: WelcomePanelProps) {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div
        className={`w-full max-w-sm rounded-2xl border p-6 text-center shadow-xl ${
          isDarkMode ? 'border-white/5 bg-slate-900/70 shadow-black/30' : 'border-slate-200/70 bg-white shadow-slate-200/60'
        }`}>
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shadow-sky-500/30">
          <img src="/icon-128.png" alt="Shedi AI" className="size-8" />
        </div>

        <h2 className={`text-base font-semibold tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
          {t('welcome_title')}
        </h2>
        <p className={`mt-1.5 text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {t('welcome_instruction')}
        </p>

        <button
          type="button"
          onClick={() => chrome.runtime.openOptionsPage()}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-transform hover:scale-[1.02] active:scale-[0.99]">
          <FiCpu className="size-4" />
          {t('welcome_openSettings')}
        </button>

        <a
          href="https://shedi.ai/docs"
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-4 inline-flex items-center gap-1 text-[11px] font-medium transition-colors ${
            isDarkMode ? 'text-slate-400 hover:text-sky-300' : 'text-slate-500 hover:text-sky-600'
          }`}>
          {t('welcome_quickStart')}
          <FiArrowUpRight className="size-3" />
        </a>
      </div>
    </div>
  );
}

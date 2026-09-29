import { useMemo } from 'react';

export interface TimelineStep {
  id: string;
  actor: string;
  content: string;
  timestamp: number;
}

interface AgentStatusBarProps {
  isDarkMode: boolean;
  active: boolean;
  steps: TimelineStep[];
}

/** Friendly, human phrasing for raw agent events. */
function friendlyLabel(step: TimelineStep): string {
  const content = step.content.trim();
  const actor = step.actor.toLowerCase();

  if (actor.includes('planner')) {
    if (content.toLowerCase().startsWith('planning')) return 'Analyzing page layout...';
    return content ? `Planning: ${truncate(content, 80)}` : 'Analyzing page layout...';
  }
  if (actor.includes('navigator')) {
    if (content.toLowerCase().startsWith('navigating')) return 'Interacting with the page...';
    return truncate(content, 80) || 'Interacting with the page...';
  }
  return truncate(content, 80) || 'Working...';
}

function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ');
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

const ACTOR_DOT: Record<string, string> = {
  planner: 'bg-violet-400',
  navigator: 'bg-sky-400',
  system: 'bg-emerald-400',
};

export const AgentStatusBar = ({ isDarkMode, active, steps }: AgentStatusBarProps) => {
  const visibleSteps = useMemo(() => steps.slice(-4), [steps]);
  const latest = visibleSteps[visibleSteps.length - 1];

  const shell = isDarkMode ? 'border-white/5 bg-[#0f1524]/85' : 'border-slate-200/70 bg-white/85';

  return (
    <div className={`border-b px-3.5 py-2.5 backdrop-blur-xl ${shell}`}>
      {/* Glowing agent badge */}
      <div className="flex items-center gap-2.5">
        <span className="relative flex size-2.5">
          {active && (
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky-400 opacity-60" />
          )}
          <span
            className={`relative inline-flex size-2.5 rounded-full ${
              active ? 'bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]' : isDarkMode ? 'bg-slate-600' : 'bg-slate-300'
            }`}
          />
        </span>
        <span
          className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
          {active ? latest ? friendlyLabel(latest) : 'Agent active' : 'Agent idle'}
        </span>
      </div>

      {/* Progress timeline */}
      {active && visibleSteps.length > 0 && (
        <ol className="mt-2.5 space-y-1.5">
          {visibleSteps.map((step, i) => {
            const isLatest = i === visibleSteps.length - 1;
            const dot = ACTOR_DOT[step.actor.toLowerCase()] ?? 'bg-slate-400';
            return (
              <li key={step.id} className="flex items-start gap-2">
                <span className="relative mt-1.5 flex size-1.5">
                  {isLatest && (
                    <span className={`absolute inline-flex size-full animate-ping rounded-full ${dot} opacity-50`} />
                  )}
                  <span className={`relative inline-flex size-1.5 rounded-full ${dot}`} />
                </span>
                <span
                  className={`text-xs leading-5 ${
                    isLatest
                      ? isDarkMode
                        ? 'text-slate-100'
                        : 'text-slate-900'
                      : isDarkMode
                        ? 'text-slate-500'
                        : 'text-slate-400'
                  }`}>
                  {friendlyLabel(step)}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export default AgentStatusBar;

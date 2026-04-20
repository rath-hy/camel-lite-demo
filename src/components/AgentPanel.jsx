import { useEffect, useRef } from 'react';

const STEP_ICONS = {
  thought:    '💭',
  action:     '⚙',
  capability: '🏷',
  warning:    '⚠',
  tool_call:  '▶',
  check:      '🔒',
};

export default function AgentPanel({ title, subtitle, steps, isRunning, done, type }) {
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [steps, isRunning]);

  const logSteps = steps.filter((s) => s.type !== 'verdict');
  const verdict  = steps.find((s)  => s.type === 'verdict');

  return (
    <div className={`panel agent-panel agent-${type}`}>
      <div className="panel-header">
        <span className={`panel-badge badge-${type}`}>
          {type === 'undefended' ? 'UNDEFENDED' : 'CAMEL-PROTECTED'}
        </span>
        <h2 className="panel-title">{title}</h2>
        <p className="panel-subtitle">{subtitle}</p>
      </div>

      <div className="agent-log" ref={logRef}>
        {logSteps.length === 0 && !isRunning && (
          <div className="log-empty">Waiting to run…</div>
        )}

        {logSteps.map((step, i) => (
          <div key={i} className={`log-step step-${step.type}`}>
            <span className="step-icon" aria-hidden="true">
              {STEP_ICONS[step.type] ?? '•'}
            </span>
            <pre className="step-text">{step.text}</pre>
          </div>
        ))}

        {isRunning && (
          <div className="log-step step-running">
            <span className="step-icon thinking-dots">•••</span>
            <span className="step-text step-thinking">processing…</span>
          </div>
        )}
      </div>

      {done && verdict && (
        <div className={`verdict verdict-${verdict.result}`}>
          <div className="verdict-title">
            {verdict.result === 'hijacked' ? 'HIJACKED ❌' : 'ATTACK BLOCKED ✅'}
          </div>
          <div className="verdict-detail">{verdict.text}</div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef } from 'react';

const STEP_ICONS = {
  p_llm:        '●',
  p_llm_action: '⚙',
  q_llm:        '◆',
  capability:   '🏷',
  warning:      '⚠',
  tool_call:    '▶',
  check:        '🔒',
  thought:      '💭',
  action:       '⚙',
};

// Groups steps so consecutive q_llm steps (with surrounding boundaries)
// render as a single quarantine-zone block.
function groupSteps(steps) {
  const groups = [];
  let i = 0;
  while (i < steps.length) {
    const step = steps[i];
    if (step.type === 'boundary_enter') {
      const inner = [];
      let exitStep = null;
      i++;
      while (i < steps.length && steps[i].type !== 'boundary_exit') {
        inner.push(steps[i]);
        i++;
      }
      if (i < steps.length && steps[i].type === 'boundary_exit') {
        exitStep = steps[i];
        i++;
      }
      groups.push({ kind: 'quarantine', enterStep: step, inner, exitStep });
    } else {
      groups.push({ kind: 'step', step });
      i++;
    }
  }
  return groups;
}

function LogStep({ step }) {
  return (
    <div className={`log-step step-${step.type}`}>
      <span className="step-icon" aria-hidden="true">
        {STEP_ICONS[step.type] ?? '•'}
      </span>
      <pre className="step-text">{step.text}</pre>
    </div>
  );
}

export default function AgentPanel({ title, subtitle, steps, isRunning, done, type }) {
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [steps, isRunning]);

  const logSteps = steps.filter((s) => s.type !== 'verdict');
  const verdict  = steps.find((s)  => s.type === 'verdict');
  const groups   = groupSteps(logSteps);

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

        {groups.map((group, gi) => {
          if (group.kind === 'quarantine') {
            return (
              <div key={gi} className="quarantine-zone">
                <div className="quarantine-header">
                  <span aria-hidden="true">▼</span>
                  <span>{group.enterStep.text}</span>
                </div>

                {group.inner.map((s, si) => <LogStep key={si} step={s} />)}

                {group.exitStep && (
                  <div className="quarantine-footer">
                    <span aria-hidden="true">▲</span>
                    <span>{group.exitStep.text}</span>
                  </div>
                )}
              </div>
            );
          }
          return <LogStep key={gi} step={group.step} />;
        })}

        {isRunning && (
          <div className="log-step step-running">
            <span className="step-icon">•••</span>
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

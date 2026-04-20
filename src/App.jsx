import { useState, useCallback } from 'react';
import SetupPanel from './components/SetupPanel.jsx';
import AgentPanel from './components/AgentPanel.jsx';
import { runUndefendedAgent } from './agents/undefendedAgent.js';
import { runProtectedAgent } from './agents/protectedAgent.js';
import './App.css';

export default function App() {
  const [hasStarted,      setHasStarted]      = useState(false);
  const [undefendedSteps, setUndefendedSteps] = useState([]);
  const [protectedSteps,  setProtectedSteps]  = useState([]);
  const [undefendedDone,  setUndefendedDone]  = useState(false);
  const [protectedDone,   setProtectedDone]   = useState(false);

  const handleRun = useCallback(() => {
    if (hasStarted) return;
    setHasStarted(true);

    runUndefendedAgent({
      onStep: (step) => setUndefendedSteps((prev) => [...prev, step]),
      onDone: () => setUndefendedDone(true),
    });

    runProtectedAgent({
      onStep: (step) => setProtectedSteps((prev) => [...prev, step]),
      onDone: () => setProtectedDone(true),
    });
  }, [hasStarted]);

  const isRunning = hasStarted && (!undefendedDone || !protectedDone);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <h1 className="app-title">Prompt Injection Demo</h1>
          <p className="app-desc">
            Visualizing how{' '}
            <a
              href="https://arxiv.org/abs/2503.18813"
              target="_blank"
              rel="noreferrer"
              className="camel-link"
            >
              CaMeL
            </a>{' '}
            capability-based security blocks prompt injection — by design.
          </p>
        </div>
      </header>

      <main className="panels">
        <SetupPanel
          onRun={handleRun}
          isRunning={isRunning}
          hasStarted={hasStarted}
        />
        <AgentPanel
          title="Undefended Agent"
          subtitle="Follows any instruction found in email — no capability checks"
          steps={undefendedSteps}
          isRunning={hasStarted && !undefendedDone}
          done={undefendedDone}
          type="undefended"
        />
        <AgentPanel
          title="CaMeL-Protected Agent"
          subtitle="P-LLM (trusted) + Q-LLM (quarantined) — injection is structurally isolated, then capability-checked"
          steps={protectedSteps}
          isRunning={hasStarted && !protectedDone}
          done={protectedDone}
          type="protected"
        />
      </main>
    </div>
  );
}

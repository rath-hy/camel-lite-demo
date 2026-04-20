import { MOCK_EMAIL, USER_INSTRUCTION } from '../mockData.js';

export default function SetupPanel({ onRun, isRunning, hasStarted }) {
  return (
    <div className="panel setup-panel">
      <div className="panel-header">
        <span className="panel-badge badge-setup">SETUP</span>
        <h2 className="panel-title">The Scenario</h2>
        <p className="panel-subtitle">
          An AI email assistant receives a task — and a poisoned inbox.
        </p>
      </div>

      <div className="panel-body">
        <div className="setup-section">
          <div className="setup-section-label">User Instruction</div>
          <div className="instruction-box">
            <span className="quote-mark">"</span>
            {USER_INSTRUCTION}
            <span className="quote-mark">"</span>
          </div>
        </div>

        <div className="setup-section">
          <div className="setup-section-label">Inbox — Latest Email</div>
          <div className="email-box">
            <div className="email-headers">
              <div className="email-row">
                <span className="email-field">From:</span>
                <span>{MOCK_EMAIL.from}</span>
              </div>
              <div className="email-row">
                <span className="email-field">Subject:</span>
                <span>{MOCK_EMAIL.subject}</span>
              </div>
              <div className="email-row">
                <span className="email-field">Date:</span>
                <span>{MOCK_EMAIL.date}</span>
              </div>
              <div className="email-row">
                <span className="email-field">Attachment:</span>
                <span className="email-attachment">📎 {MOCK_EMAIL.attachment}</span>
              </div>
            </div>
            <div className="email-body">
              {MOCK_EMAIL.bodySegments.map((seg, i) =>
                seg.injected ? (
                  <span key={i} className="injected-text">{seg.text}</span>
                ) : (
                  <span key={i}>{seg.text}</span>
                )
              )}
            </div>
          </div>
          <div className="injection-legend">
            <span className="injected-swatch" aria-hidden="true" />
            Injected attacker payload
          </div>
        </div>
      </div>

      <div className="panel-footer">
        <button
          className="run-button"
          onClick={onRun}
          disabled={isRunning || hasStarted}
        >
          {isRunning ? '⚡ Running…' : hasStarted ? '✓ Complete' : '▶ Run Attack'}
        </button>
      </div>
    </div>
  );
}

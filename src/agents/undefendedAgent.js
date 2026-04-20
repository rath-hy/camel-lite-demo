import { UNDEFENDED_STEPS } from '../mockData.js';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function runUndefendedAgent({ onStep, onDone }) {
  let cancelled = false;

  async function run() {
    for (const step of UNDEFENDED_STEPS) {
      if (cancelled) return;
      const ms = step.type === 'tool_call' ? 1000 : 650 + Math.random() * 550;
      await delay(ms);
      if (cancelled) return;
      onStep(step);
    }
    onDone();
  }

  run();
  return () => { cancelled = true; };
}

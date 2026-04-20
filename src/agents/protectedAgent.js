import { PROTECTED_STEPS } from '../mockData.js';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function runProtectedAgent({ onStep, onDone }) {
  let cancelled = false;

  async function run() {
    for (const step of PROTECTED_STEPS) {
      if (cancelled) return;
      const ms =
        step.type === 'capability' ? 900 :
        step.type === 'check'      ? 1200 :
        650 + Math.random() * 550;
      await delay(ms);
      if (cancelled) return;
      onStep(step);
    }
    onDone();
  }

  run();
  return () => { cancelled = true; };
}

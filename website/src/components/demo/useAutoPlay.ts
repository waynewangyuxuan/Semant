import { useEffect, useRef, useState, useCallback } from "react";

interface AnimationStep {
  action: () => void;
  delay: number; // ms to wait AFTER this step before next
}

/**
 * Runs a sequence of animation steps in a loop.
 * Pauses when user interacts, resumes after idle timeout.
 */
export function useAutoPlay(steps: AnimationStep[], idleResumeMs = 5000) {
  const [paused, setPaused] = useState(false);
  const stepRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const pause = useCallback(() => {
    setPaused(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setPaused(false);
    }, idleResumeMs);
  }, [idleResumeMs]);

  useEffect(() => {
    if (paused || steps.length === 0) return;

    const runStep = () => {
      const step = steps[stepRef.current];
      step.action();
      stepRef.current = (stepRef.current + 1) % steps.length;
      timerRef.current = setTimeout(runStep, step.delay);
    };

    timerRef.current = setTimeout(runStep, 1000); // initial delay

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [paused, steps]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  return { paused, pause };
}

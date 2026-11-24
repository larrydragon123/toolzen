import { useLayoutEffect, useRef } from 'preact/hooks';
import { toolAnalytics } from '../utils/toolAnalytics';

// A live calculator can render defaults or update its clock without any user action.
export function useLiveToolAnalytics(slug: string, operation: string, hasResult: boolean) {
  const edited = useRef(false);
  const track = toolAnalytics(slug);
  useLayoutEffect(() => {
    if (!edited.current) return;
    edited.current = false;
    if (hasResult) track('tool_complete', operation);
  });
  return () => {
    if (!edited.current) track('tool_start', operation);
    edited.current = true;
  };
}

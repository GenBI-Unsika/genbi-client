import { useEffect, useRef, useState } from 'react';
import { subscribeApiInFlight } from '../utils/api.js';

const SHOW_DELAY_MS = 200;

export default function TopLoadingBar() {
  const [visible, setVisible] = useState(false);
  const pendingRef = useRef(0);
  const showTimerRef = useRef(null);

  useEffect(() => {
    return subscribeApiInFlight((count) => {
      pendingRef.current = count;

      if (count > 0) {
        if (visible) return;
        if (showTimerRef.current) return;

        showTimerRef.current = window.setTimeout(() => {
          showTimerRef.current = null;
          if (pendingRef.current > 0) setVisible(true);
        }, SHOW_DELAY_MS);
        return;
      }

      // count === 0
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
        showTimerRef.current = null;
      }
      if (visible) setVisible(false);
    });
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="top-loading-bar" role="progressbar" aria-label="Memuat" aria-busy="true">
      <div className="top-loading-bar__inner" />
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { getOpenStatus } from '@/lib/site';

export function OpenStatus() {
  const [status, setStatus] = useState<ReturnType<typeof getOpenStatus> | null>(
    null,
  );

  useEffect(() => {
    const update = () => setStatus(getOpenStatus(new Date()));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!status) return null;

  return (
    <p className="inline-flex items-center gap-2 text-xs font-semibold text-primary">
      <span
        aria-hidden
        className={`size-2 rounded-full ${status.open ? 'bg-emerald-600' : 'bg-muted-foreground'}`}
      />
      {status.label}
    </p>
  );
}

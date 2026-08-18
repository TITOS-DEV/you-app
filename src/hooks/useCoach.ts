import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect } from 'react';
import { db } from '@/lib/db';
import * as coachService from '@/services/coachService';

export function useCoachMessages() {
  useEffect(() => {
    void coachService.ensureTodayCoachFeed();
  }, []);

  const messages = useLiveQuery(() => db.coachMessages.toArray(), []);
  return (messages ?? []).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export type UserSession = {
  id: string;
  role: 'principal' | 'teacher' | 'student';
  name: string;
  email: string;
};

const STORAGE_KEY = 'schooltime_session';

export const sessionStorage = {
  get(): UserSession | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as UserSession;
    } catch {
      return null;
    }
  },
  set(session: UserSession) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  },
  clear() {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(STORAGE_KEY);
  },
};


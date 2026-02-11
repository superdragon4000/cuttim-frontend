'use client';

import {Provider} from 'react-redux';
import {store} from '@/app/store/store';
import {setAuth} from '@/app/store/slices/auth-slice';
import {useEffect} from 'react';
import type {UserProfile} from '@/entities/user';

type StoredAuth = {
  accessToken: string;
  user: UserProfile;
};

export function StoreProvider({children}: {children: React.ReactNode}) {
  useEffect(() => {
    const raw = localStorage.getItem('auth');
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as StoredAuth;
      if (parsed?.accessToken && parsed?.user) {
        store.dispatch(
          setAuth({
            accessToken: parsed.accessToken,
            user: parsed.user,
          }),
        );
      }
    } catch {
      localStorage.removeItem('auth');
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}

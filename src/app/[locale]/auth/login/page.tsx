'use client';

import {useState} from 'react';
import {Link, useRouter} from '@/i18n/navigation';
import {Card} from '@/shared/ui/card/ui';
import {Button} from '@/shared/ui/button/ui';
import {login, register} from '@/shared/lib/api/auth';
import {useAppDispatch} from '@/shared/lib/hooks/redux';
import {setAuth} from '@/app/store/slices/auth-slice';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response =
        mode === 'login'
          ? await login(email, password)
          : await register(email, password);

      dispatch(
        setAuth({
          accessToken: response.access_token,
          user: response.user,
        }),
      );
      localStorage.setItem(
        'auth',
        JSON.stringify({
          accessToken: response.access_token,
          user: response.user,
        }),
      );

      if (response.user.role === 'manager') {
        router.push('/manager/orders');
      } else {
        router.push('/preview');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Auth failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md">
      <Card className="space-y-4">
        <h1 className="text-2xl font-bold">{mode === 'login' ? 'Sign In' : 'Create account'}</h1>
        <p className="text-sm text-[var(--muted)]">
          Auth is connected to backend endpoints `/auth/login` and `/auth/register`.
        </p>

        <form className="space-y-3" onSubmit={onSubmit}>
          <input
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm"
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm"
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? 'Loading...' : mode === 'login' ? 'Sign in' : 'Register'}
          </Button>
        </form>

        <button
          className="text-sm text-[var(--muted)] underline"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          type="button"
        >
          {mode === 'login' ? 'Need account? Register' : 'Already have account? Sign in'}
        </button>

        <p className="text-xs text-[var(--muted)]">
          No account? Start with <Link href="/preview" className="underline">public preview</Link>.
        </p>
      </Card>
    </section>
  );
}

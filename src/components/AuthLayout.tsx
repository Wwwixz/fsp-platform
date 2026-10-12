import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';

interface AuthLayoutProps {
  active: 'login' | 'register';
  children: ReactNode;
}

export function AuthLayout({ active, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans antialiased selection:bg-indigo-500/30">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-indigo-600/20 blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-600/15 blur-[128px]" />
      </div>

      <div className="flex min-h-screen">
        <aside className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 border-r border-slate-800/60">
          <Logo light />

          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
              Добро пожаловать на платформу
            </h1>
            <p className="mt-4 text-slate-400 max-w-md">
              Войдите в аккаунт, чтобы получить доступ к соревнованиям, командам
              и личному кабинету.
            </p>

            <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 font-mono text-sm text-indigo-300/80 space-y-1">
              <div>
                <span className="text-slate-500">const </span>
                rating = calculateRating();
              </div>
              <div className="text-emerald-400">return "Victory!";</div>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md rounded-3xl border border-slate-800/60 bg-slate-900/80 p-8 shadow-2xl shadow-black/40 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-1 rounded-2xl border border-slate-800 bg-slate-950/60 p-1 mb-8">
              <Link
                to="/login"
                className={`rounded-xl py-2.5 text-sm font-semibold transition-all duration-300 text-center ${
                  active === 'login'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Вход
              </Link>
              <Link
                to="/register"
                className={`rounded-xl py-2.5 text-sm font-semibold transition-all duration-300 text-center ${
                  active === 'register'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Регистрация
              </Link>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

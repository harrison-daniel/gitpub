'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { FaGithub, FaGoogle } from 'react-icons/fa';

export default function SignIn() {
  const router = useRouter();

  return (
    <div className='mx-auto w-full max-w-sm px-4 pt-6'>
      <button
        onClick={() => router.back()}
        className='-ml-1.5 mb-6 inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-sm font-semibold text-amber-700 hover:bg-amber-50 hover:text-amber-600 dark:text-amber-400 dark:hover:bg-amber-950/30 dark:hover:text-amber-300'>
        <ChevronLeft size={16} />
        Back
      </button>

      <div className='rounded-2xl border border-amber-200/60 bg-white/85 p-8 shadow-sm backdrop-blur-sm dark:border-neutral-700/60 dark:bg-neutral-900/85'>
        {/* Branding */}
        <div className='mb-8 text-center'>
          <p className='font-serif text-5xl font-extrabold tracking-tight'>
            GitPub
          </p>
          <p className='mt-2 text-sm text-stone-500 dark:text-stone-400'>
            Save your brewery discoveries
          </p>
        </div>

        {/* Providers */}
        <div className='flex flex-col gap-3'>
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className='flex w-full items-center justify-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3.5 text-sm font-semibold text-stone-700 shadow-sm transition-colors hover:bg-stone-50 active:bg-stone-100 dark:border-neutral-600 dark:bg-neutral-800 dark:text-stone-200 dark:hover:bg-neutral-700'>
            <FaGoogle size={17} className='text-red-500' />
            Continue with Google
          </button>

          <button
            onClick={() => signIn('github', { callbackUrl: '/' })}
            className='flex w-full items-center justify-center gap-3 rounded-xl bg-neutral-900 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-700 active:bg-neutral-600 dark:bg-neutral-700 dark:hover:bg-neutral-600'>
            <FaGithub size={18} />
            Continue with GitHub
          </button>
        </div>

        <p className='mt-6 text-center text-xs text-stone-400 dark:text-stone-500'>
          No password needed — secure sign-in via Google or GitHub
        </p>
      </div>
    </div>
  );
}

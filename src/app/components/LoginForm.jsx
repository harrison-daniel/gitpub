'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError('Invalid Credentials');
        return;
      }

      router.replace('/login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className='mx-auto mt-40 flex w-52 justify-center bg-white p-4 text-black'>
        <div className=' flex w-48 flex-col  '>
          <h1 className='flex'>Sign in</h1>
          <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type='text'
              placeholder='Email'
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type='password'
              placeholder='Password'
            />
            <button className='cursor-pointer bg-green-600 px-6 py-2 font-bold text-white'>
              Login
            </button>
            {error && (
              <div className='mt-2 w-fit rounded-md bg-red-500 px-3 py-1 text-sm text-white'>
                {error}
              </div>
            )}

            <Link className='mt-3 text-right text-sm' href={'/register'}>
              Don't have an account? <span className='underline'>Register</span>
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}

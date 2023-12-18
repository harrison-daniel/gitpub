'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const resUserExists = await fetch(
        'api/Users',
        // `${process.env.NEXT_PUBLIC_API_URL}/api/Users`,

        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        },
      );

      const { user } = await resUserExists.json();

      if (user) {
        setError('User already exists.');
        return;
      }

      const res = await fetch(
        'api/register',
        // `${process.env.NEXT_PUBLIC_API_URL}/api/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        },
      );

      if (res.ok) {
        const form = e.target;
        form.reset();
        router.push('/');
      } else {
        console.log('An error occured creating the user.');
      }
    } catch (error) {
      console.log('Something went during user creation');
    }
  };
  return (
    <>
      <div className='mx-auto mt-40 flex w-52 justify-center bg-white p-4 text-black'>
        <div className=' flex w-48 flex-col  '>
          <h1 className='flex'>Create a New Account Below</h1>
          <form
            onSubmit={handleSubmit}
            className='mt-4 flex flex-col gap-2 dark:text-white'>
            <input
              onChange={(e) => setName(e.target.value)}
              type='text'
              placeholder='Name'
            />
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
            <button className='rounded bg-black p-2 text-white'>
              Create Account
            </button>

            {error && <div className='bg-red-500 text-white'>{error}</div>}
            {/* <div className='bg-red-500 text-white'>Error Message</div> */}
            <Link className='text-md text-black' href={'/login'}>
              Already have an account?{' '}
              <span className='underline'>Login here.</span>
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}

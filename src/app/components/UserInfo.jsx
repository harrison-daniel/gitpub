'use client';

import { signOut, useSession } from 'next-auth/react';

export default function UserInfo() {
  const { data: session } = useSession();

  return (
    <div className='grid h-screen place-items-center'>
      <div className='my-6 flex flex-col gap-2 bg-zinc-300/10 p-8 shadow-lg'>
        <div>
          <div>
            Name: <span className='font-bold'>{session?.user?.name}</span>
          </div>
          <div>
            Email: <span className='font-bold'> {session?.user?.email} </span>
          </div>
          <button
            onClick={() => signOut()}
            className='mt-3 bg-red-500 px-6 py-2 font-bold text-white'>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

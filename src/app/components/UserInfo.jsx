'use client';

import { signOut, useSession } from 'next-auth/react';

export default function UserInfo() {
  const { data: session } = useSession();

  return (
    <div>
      <div>
        Name: <span className='font-bold'>{session?.user?.name}</span>
      </div>
      <div>
        Email: <span className='font-bold'> {session?.user?.email} </span>
      </div>
      <div className='flex justify-center'>
        <button
          onClick={() => signOut()}
          className='mt-3 rounded-sm bg-red-600 px-6 py-2 font-bold text-white'>
          Log Out
        </button>
      </div>
    </div>
  );
}

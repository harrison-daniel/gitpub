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
          <button
            onClick={() => signOut()}
            className='mt-3 bg-red-500 px-6 py-2 font-bold text-white'>
            Log Out
          </button>
        </div>
    
  );
}

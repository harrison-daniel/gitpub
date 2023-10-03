'use client';
import React from 'react';

import { Button } from '@nextui-org/react';

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className='  flex flex-row items-center justify-center'>
      <Button color='primary' isLoading>
        Loading
      </Button>
    </div>
  );
}

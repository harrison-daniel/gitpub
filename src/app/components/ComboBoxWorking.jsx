'use client';

import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '../lib/utils';
import { Button } from './ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

import { X } from 'lucide-react';

import { ScrollArea } from './ui/scroll-area';

export default function ComboBoxWorking({
  dataList,
  onSelect,
  placeholder,
  value,
}) {
  const [open, setOpen] = useState(false);
  // const [value, setValue] = useState('');
  const [localValue, setLocalValue] = useState(value || '');

  const handleSelect = (currentValue) => {
    setLocalValue(currentValue === localValue ? '' : currentValue);
    setOpen(false);
    onSelect(currentValue);
  };

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='h-[33px] w-[240px] justify-between sm:h-[33px] md:h-[40px] lg:h-[40px]  '>
            {value
              ? dataList.find((dataItem) => dataItem.value === localValue)
                  ?.label
              : placeholder}

            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>

        <PopoverContent className='fixed -left-36 -top-36 m-0 h-52  p-2 '>
          <Command className=' '>
            <div className='flex flex-row justify-around'>
              <CommandInput
                placeholder={`Search or ${placeholder}`}
                className='h-[35px]'
              />
              <X
                size={30}
                onClick={(e) => setOpen(false)}
                aria-label='Close Modal'
                className='flex cursor-pointer rounded-lg text-red-700 hover:text-red-500 active:bg-amber-700 dark:text-red-700 dark:hover:bg-neutral-800 dark:hover:text-red-500'
              />
            </div>
            <CommandEmpty>{`No ${placeholder
              .replace('Select a ', '')
              .replace('...', '')} found.`}</CommandEmpty>

            <CommandGroup className='overflow-y-scroll'>
              {/* <ScrollArea className='h-[143px] p-4 sm:h-[143px] md:h-[290px] lg:h-[290px]'> */}
              <ScrollArea>
                {dataList.map((dataItem) => (
                  <CommandItem
                    key={dataItem.value}
                    onSelect={() => handleSelect(dataItem.value)}>
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4 ',
                        value === dataItem.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {dataItem.label}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}

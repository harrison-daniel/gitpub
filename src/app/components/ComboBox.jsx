'use client';

import React, { useState, useEffect } from 'react';
import { ChevronsUpDown } from 'lucide-react';
import useMediaQuery from '../lib/useMediaQuery';
import { Button } from './ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export default function ComboBox({
  dataList,
  onSelect,
  placeholder,
  value,
  externalOpen,
  onExternalOpenChange,
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [localValue, setLocalValue] = useState(value || '');

  // Allow external control of open state (e.g. triggered from Navbar Search)
  const isOpen = externalOpen !== undefined ? externalOpen : open;
  const handleOpenChange = (val) => {
    setOpen(val);
    onExternalOpenChange?.(val);
  };

  const handleSelect = (currentValue) => {
    setLocalValue(currentValue === localValue ? '' : currentValue);
    handleOpenChange(false);
    onSelect(currentValue);
  };

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  return (
    <div>
      {isDesktop ? (
        <div>
          <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
              <Button variant='outline' className='w-[180px] justify-between'>
                <span className='truncate'>
                  {value
                    ? dataList.find((dataItem) => dataItem.value === localValue)?.label
                    : placeholder}
                </span>
                <ChevronsUpDown className='ml-2 h-3.5 w-3.5 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0' align='start'>
              <Command>
                <CommandInput placeholder={`Search or ${placeholder}`} />
                <CommandList>
                  <CommandEmpty>{`No ${placeholder
                    .replace('Select a ', '')
                    .replace('...', '')} found.`}</CommandEmpty>

                  <CommandGroup>
                    {dataList.map((dataItem) => (
                      <CommandItem
                        key={dataItem.value}
                        value={dataItem.value}
                        onSelect={() => handleSelect(dataItem.value)}>
                        {dataItem.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <div>
          <Drawer open={isOpen} onOpenChange={handleOpenChange}>
            <DrawerTrigger asChild>
              <Button variant='outline' className='w-[180px] justify-between'>
                <span className='truncate'>
                  {value
                    ? dataList.find((dataItem) => dataItem.value === localValue)?.label
                    : placeholder}
                </span>
                <ChevronsUpDown className='ml-2 h-3.5 w-3.5 shrink-0 opacity-50' />
              </Button>
            </DrawerTrigger>
            <DrawerContent className='min-h-[50vh]'>
              <div className='mt-2 border-t'>
                <Command>
                  <CommandInput
                    placeholder={`Search ${placeholder.replace('Select a ', '').replace('...', '')}...`}
                    className='h-12 text-base'
                  />
                  <CommandList className='max-h-[42vh]'>
                    <CommandEmpty className='py-8 text-base'>{`No results found.`}</CommandEmpty>
                    <CommandGroup>
                      {dataList.map((dataItem) => (
                        <CommandItem
                          key={dataItem.value}
                          value={dataItem.value}
                          className='border-b border-stone-100 py-3.5 text-base last:border-0 dark:border-neutral-800'
                          onSelect={() => handleSelect(dataItem.value)}>
                          {dataItem.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      )}
    </div>
  );
}

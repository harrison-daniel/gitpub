'use client';

import React, { useState, useEffect } from 'react';

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

export default function ComboBox({ dataList, onSelect, placeholder, value }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

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
    <div>
      {isDesktop ? (
        <div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant='outline' className='w-[150px] justify-start'>
                {value
                  ? dataList.find((dataItem) => dataItem.value === localValue)
                      ?.label
                  : placeholder}
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
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <Button variant='outline' className='w-[150px] justify-start'>
                {value
                  ? dataList.find((dataItem) => dataItem.value === localValue)
                      ?.label
                  : placeholder}
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className='mt-4 border-t'>
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
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      )}
    </div>
  );
}

'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '../lib/utils';
import { ButtonShad } from '../components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '../components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';

import { ScrollArea } from '../components/ui/scroll-area';

export default function ComboBox({ dataList, onSelect, placeholder }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  const handleSelect = (currentValue) => {
    setValue(currentValue === value ? '' : currentValue);
    setOpen(false);
    onSelect(currentValue);
  };

  return (
    <div className='flex justify-center '>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <ButtonShad
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-[700px] justify-between rounded-xl'>
            {value
              ? dataList.find((dataItem) => dataItem.value === value)?.label
              : placeholder}

            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </ButtonShad>
        </PopoverTrigger>
        <PopoverContent className='w-[700px]  rounded-xl p-0'>
          <Command className='rounded-xl'>
            <CommandInput placeholder={`Search or ${placeholder}`} />
            <ScrollArea className='h-96 '>
              <CommandEmpty>No State found.</CommandEmpty>
              <CommandGroup>
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
              </CommandGroup>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

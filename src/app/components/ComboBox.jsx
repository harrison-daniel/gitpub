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
  // const [selectedStatus, setSelectedStatus] = useState(null);

  const [localValue, setLocalValue] = useState(value || '');

  const handleSelect = (currentValue) => {
    setLocalValue(currentValue === localValue ? '' : currentValue);
    setOpen(false);
    onSelect(currentValue);
  };

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  if (isDesktop) {
    return (
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
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant='outline' className='w-[150px] justify-start'>
          {value
            ? dataList.find((dataItem) => dataItem.value === localValue)?.label
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
  );
}

// ATTEMPT TO USE CSS MEDIA QUERIES -- NOT WORKING
// 'use client';

// import React, { useState, useEffect } from 'react';
// import useMediaQuery from '../lib/useMediaQuery';
// import { Button } from './ui/button';
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from './ui/command';
// import { Drawer, DrawerContent, DrawerTrigger } from './ui/drawer';
// import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

// export default function ComboBox({ dataList, onSelect, placeholder, value }) {
//   const [open, setOpen] = useState(false);
//   // const isDesktop = useMediaQuery('(min-width: 768px)');
//   // const [selectedStatus, setSelectedStatus] = useState(null);

//   const [localValue, setLocalValue] = useState(value || '');

//   const handleSelect = (currentValue) => {
//     setLocalValue(currentValue === localValue ? '' : currentValue);
//     setOpen(false);
//     onSelect(currentValue);
//   };

//   useEffect(() => {
//     setLocalValue(value || '');
//   }, [value]);

//   return (
//     <>
//       {/* DESKTOP  */}
//       <div className='hidden md:flex lg:flex'>
//         <Popover open={open} onOpenChange={setOpen} className=''>
//           <PopoverTrigger asChild className=''>
//             <Button variant='outline' className='w-[150px] justify-start'>
//               {value
//                 ? dataList.find((dataItem) => dataItem.value === localValue)
//                     ?.label
//                 : placeholder}
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className='w-[200px] p-0' align='start'>
//             <Command>
//               <CommandInput placeholder={`Search or ${placeholder}`} />
//               <CommandList>
//                 <CommandEmpty>{`No ${placeholder
//                   .replace('Select a ', '')
//                   .replace('...', '')} found.`}</CommandEmpty>

//                 <CommandGroup>
//                   {dataList.map((dataItem) => (
//                     <CommandItem
//                       key={dataItem.value}
//                       value={dataItem.value}
//                       onSelect={() => handleSelect(dataItem.value)}>
//                       {dataItem.label}
//                     </CommandItem>
//                   ))}
//                 </CommandGroup>
//               </CommandList>
//             </Command>
//           </PopoverContent>
//         </Popover>
//       </div>
//       {/* MOBILE  */}
//       <div className='block md:hidden lg:hidden'>
//         <Drawer open={open} onOpenChange={setOpen} className=''>
//           <DrawerTrigger asChild className=''>
//             <Button variant='outline' className='w-[150px] justify-start'>
//               {value
//                 ? dataList.find((dataItem) => dataItem.value === localValue)
//                     ?.label
//                 : placeholder}
//             </Button>
//           </DrawerTrigger>
//           <DrawerContent>
//             <div className='mt-4 border-t'>
//               <Command>
//                 <CommandInput placeholder={`Search or ${placeholder}`} />
//                 <CommandList>
//                   <CommandEmpty>{`No ${placeholder
//                     .replace('Select a ', '')
//                     .replace('...', '')} found.`}</CommandEmpty>

//                   <CommandGroup>
//                     {dataList.map((dataItem) => (
//                       <CommandItem
//                         key={dataItem.value}
//                         value={dataItem.value}
//                         onSelect={() => handleSelect(dataItem.value)}>
//                         {dataItem.label}
//                       </CommandItem>
//                     ))}
//                   </CommandGroup>
//                 </CommandList>
//               </Command>
//             </div>
//           </DrawerContent>
//         </Drawer>
//       </div>
//     </>
//   );
// }

// OLD COMBOBOX COMPONENT
// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Check, ChevronsUpDown } from 'lucide-react';
// import { cn } from '../lib/utils';
// import { Button } from './ui/button';
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from './ui/command';
// import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
// import { X } from 'lucide-react';
// import { ScrollArea } from './ui/scroll-area';

// export default function ComboBox({ dataList, onSelect, placeholder, value }) {
//   const [open, setOpen] = useState(false);
//   const [localValue, setLocalValue] = useState(value || '');

//   const handleSelect = (currentValue) => {
//     setLocalValue(currentValue === localValue ? '' : currentValue);
//     setOpen(false);
//     onSelect(currentValue);
//   };

//   useEffect(() => {
//     setLocalValue(value || '');
//   }, [value]);

//   return (
//     <>
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             variant='outline'
//             role='combobox'
//             aria-expanded={open}
//             className='h-[33px] w-[240px] justify-between sm:h-[33px] md:h-[40px] lg:h-[40px]  '>
//             {value
//               ? dataList.find((dataItem) => dataItem.value === localValue)
//                   ?.label
//               : placeholder}

//             <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
//           </Button>
//         </PopoverTrigger>

//         <PopoverContent className='fixed -left-36 -top-36 m-0 h-[335px]  p-2 '>
//           <Command className=' '>
//             <div className='flex flex-row justify-around'>
//               <CommandInput
//                 placeholder={`Search or ${placeholder}`}
//                 className='h-[35px]'
//               />
//               <X
//                 size={30}
//                 onClick={(e) => setOpen(false)}
//                 aria-label='Close Modal'
//                 className='flex cursor-pointer rounded-lg text-red-700 hover:text-red-500 active:bg-amber-700 dark:text-red-700 dark:hover:bg-neutral-800 dark:hover:text-red-500'
//               />
//             </div>
//             <CommandEmpty>{`No ${placeholder
//               .replace('Select a ', '')
//               .replace('...', '')} found.`}</CommandEmpty>

//             <CommandGroup className='overflow-y-scroll'>
//               <ScrollArea>
//                 {dataList.map((dataItem) => (
//                   <CommandItem
//                     key={dataItem.value}
//                     onSelect={() => handleSelect(dataItem.value)}>
//                     <Check
//                       className={cn(
//                         'mr-2 h-4 w-4 ',
//                         value === dataItem.value ? 'opacity-100' : 'opacity-0',
//                       )}
//                     />
//                     {dataItem.label}
//                   </CommandItem>
//                 ))}
//               </ScrollArea>
//             </CommandGroup>
//           </Command>
//         </PopoverContent>
//       </Popover>
//     </>
//   );
// }

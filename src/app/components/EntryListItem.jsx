import { format } from 'date-fns';
import RemoveBtn from './RemoveBtn';
import { HiPencilAlt } from 'react-icons/hi';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { Link2, Settings, MoreVertical, MoreHorizontal } from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';

export default function EntryListItem({ entry }) {


  return (
    <>
      <div className=' mb-4 rounded-lg border border-slate-900 bg-amber-400  p-2  dark:bg-neutral-800'>
        {/* SETTINGS & DATE DIV  */}
        <div className='mb-2 ml-3 mr-2 flex  flex-row justify-between'>
          {/* DATE */}
          <div className='flex  font-mono  text-xl font-semibold text-stone-800 dark:text-gray-400 '>
            {entry.date && !isNaN(new Date(entry.date).getTime())
              ? format(new Date(entry.date), 'MM/dd/yyyy')
              : null}
          </div>
          {/* SETTING COG WHEEL */}
          <Popover>
            <PopoverTrigger>
              {/* <Settings size={22} /> */}
              {/* <MoreVertical size={22} /> */}
              {/* <Settings size={22} /> */}
              <MoreHorizontal size={22} />
            </PopoverTrigger>
            <PopoverContent className='fixed -right-4  w-fit flex-col items-end gap-2 bg-amber-300 px-3 py-2.5 font-semibold '>
              <Link
                href={`/editEntry/${entry._id}`}
                className='flex flex-row items-center  gap-2'>
                <HiPencilAlt size={18} className=' hover:text-stone-600' />
                Edit
              </Link>
              <RemoveBtn id={entry._id} />
            </PopoverContent>
          </Popover>
        </div>

        {/* rest of accordion / entry details */}
        <Accordion type='single' collapsible className='  '>
          <AccordionItem value='item-1'>
            <AccordionTrigger className='text-md flex flex-col  items-start gap-0  pl-3  pt-0 '>
              {/* TITLE */}
              <div className='entryListItem-header border-b-medium border-black pb-1.5  text-left text-lg font-extrabold'>
                {entry.title}
              </div>

              <div className=' text-md mb-2 mt-1 dark:text-gray-400'>
                {entry.cityStateAddress}
              </div>
            </AccordionTrigger>

            <AccordionContent className='pl-3 '>
              <div className='mb-2 mt-0 flex flex-row items-center gap-9 '>
                <div className='flex items-center'>{entry.streetAddress}</div>
                <div className='flex items-center'>
                  {entry.websiteUrl && (
                    <a
                      href={
                        entry.websiteUrl.startsWith('http')
                          ? entry.websiteUrl
                          : `http://${entry.websiteUrl}`
                      }
                      target='_blank'
                      rel='noopener noreferrer'
                      className='  flex w-24 flex-row items-center gap-2 py-1  text-blue-600 visited:text-purple-600 hover:text-blue-800'>
                      <Link2 />
                      Website
                    </a>
                  )}
                </div>
              </div>
              <div>{entry.description}</div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
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
import { Link2 } from 'lucide-react';

export default function EntryListItem({ entry }) {
  // const entryDate =
  //   entry.date && !isNaN(new Date(entry.date).getTime())
  //     ? format(new Date(entry.date), 'yyyy')
  //     : 'No Date';

  return (
    <div className=' mb-4 flex flex-col  gap-0 rounded-lg border border-slate-900 bg-amber-500 bg-opacity-80 p-2 dark:bg-neutral-800'>
      <div className=' flex flex-row  justify-between gap-4 text-left '>
        <div className='entryListItem-header  flex  flex-wrap border-b-medium border-black text-xl font-extrabold'>
          {entry.title}
        </div>
        <div className='mb-1 flex    font-mono text-xl font-bold '>
          {entry.date && !isNaN(new Date(entry.date).getTime())
            ? format(new Date(entry.date), 'MM/dd/yyyy')
            : null}
        </div>
        {/* <div className='text-md mb-5 flex flex-col pl-2 font-mono font-bold'> */}
        {/* </div> */}
      </div>

      <div>
        <div className='flex flex-row items-center justify-between'>
          <div className='flex  text-lg text-amber-600'>
            {entry.cityStateAddress}
          </div>
          <div className='flex font-mono  text-xs'>{entry.streetAddress}</div>
        </div>
        {/* <div>{`${entry.cityStateAddress} - ${entry.streetAddress}`}</div> */}

        <div className=' flex  justify-start dark:text-neutral-300'>
          <Accordion type='single' collapsible>
            <AccordionItem value='item-1'>
              <AccordionTrigger className=' text-lg'>Notes</AccordionTrigger>
              <AccordionContent>
                {entry.description}
                {entry.websiteUrl && (
                  <div className='my-1'>
                    <a
                      href={
                        entry.websiteUrl.startsWith('http')
                          ? entry.websiteUrl
                          : `http://${entry.websiteUrl}`
                      }
                      target='_blank'
                      rel='noopener noreferrer'
                      className='my-2 flex flex-row  items-center gap-2 text-blue-600 visited:text-purple-600 hover:text-blue-800'>
                      <Link2 />
                      Website
                    </a>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className='mt-3 flex justify-center gap-10'>
          <Link
            href={`/editEntry/${entry._id}`}
            className='flex items-center gap-1'>
            Edit
            <HiPencilAlt size={22} className='hover:text-stone-600' />
          </Link>
          <RemoveBtn id={entry._id} />
        </div>
      </div>
    </div>
  );
}

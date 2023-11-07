import RemoveBtn from './RemoveBtn';
import { HiPencilAlt } from 'react-icons/hi';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { format } from 'date-fns';

export default function EntryListItem({ entry }) {
  return (
    <>
      <div className=' mb-2 flex flex-col justify-center gap-0  rounded-lg border  border-slate-900  bg-amber-500 bg-opacity-80 p-2 dark:bg-zinc-800'>
        <div className='mb-4 flex flex-row justify-between'>
          <div className='text-md flex flex-col pl-2 font-mono font-semibold '>
            {entry.date && !isNaN(new Date(entry.date).getTime())
              ? format(new Date(entry.date), 'PPP')
              : null}
          </div>
          <div className='flex flex-row gap-4 pr-8'>
            <RemoveBtn id={entry._id} />

            <Link href={`/editEntry/${entry._id}`}>
              <HiPencilAlt size={22} className='  hover:text-stone-600' />
            </Link>
          </div>
        </div>
        <div>
          <div className='mx-auto flex   flex-col justify-center gap-1    text-center '>
            <div className='border-b-medium mx-auto  border-black  text-xl font-extrabold dark:text-amber-700'>
              {entry.title}
            </div>
            <p className='mb-2 text-sm italic'>{entry.address}</p>
          </div>

          <div className=' flex flex-wrap justify-center'>
            <Accordion type='single' collapsible className=''>
              <AccordionItem value='item-1 '>
                <AccordionTrigger>Notes</AccordionTrigger>
                <AccordionContent>{entry.description}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
}

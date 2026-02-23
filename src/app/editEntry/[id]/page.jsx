import EditEntryForm from '../../components/EditEntryForm';
import { auth } from '../../auth';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import dbConnect from '../../db/dbConnect';
import Entry from '../../models/entry';

export const metadata = {
  title: 'Edit Entry | GitPub',
  description: 'Edit your brewery journal entry',
};

export default async function EditEntry({ params }) {
  const { id } = await params;
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  await dbConnect();
  const raw = await Entry.findOne({ _id: id, userId: session.user.id }).lean();

  if (!raw) {
    notFound();
  }

  const entry = JSON.parse(JSON.stringify(raw));

  const {
    title,
    streetAddress,
    cityStateAddress,
    description,
    date,
    websiteUrl,
    phoneNumber,
  } = entry;

  return (
    <EditEntryForm
      id={id}
      title={title}
      streetAddress={streetAddress}
      cityStateAddress={cityStateAddress}
      description={description}
      date={date}
      websiteUrl={websiteUrl}
      phoneNumber={phoneNumber}
    />
  );
}

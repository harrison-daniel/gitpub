'use client';
import EntryForm from './EntryForm';

export default function EditEntryForm({
  id,
  title,
  streetAddress,
  cityStateAddress,
  description,
  date,
  websiteUrl,
  phoneNumber,
}) {
  return (
    <EntryForm
      mode='edit'
      id={id}
      initialValues={{
        title,
        streetAddress,
        cityStateAddress,
        description,
        date,
        websiteUrl,
        phoneNumber,
      }}
    />
  );
}

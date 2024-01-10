import EditEntryForm from '../../components/EditEntryForm';
import { auth } from '../../auth';

const getEntryById = async (id) => {
  const session = await auth();

  if (session) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/entries/${id}`,
        {
          cache: 'no-store',
        },
      );

      if (!res.ok) {
        throw new Error('Failed to fetch entry');
      }
      return res.json();
    } catch (error) {
      console.log(error);
      return {};
    }
  } else {
    console.log('no session');
  }
};

export default async function EditEntry({ params }) {
  const { id } = params;
  const { entry } = await getEntryById(id);
  const {
    title,
    streetAddress,
    cityStateAddress,
    description,
    date,
    websiteUrl,
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
    />
  );
}

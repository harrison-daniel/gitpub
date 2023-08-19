import EditEntryForm from '../../components/EditEntryForm';

const getEntryById = async (id) => {
  try {
    const res = await fetch(`https://gitpub.vercel.app/api/entries/${id}`, {
      cache: 'no-store',
    });
    // const res = await fetch(`http://localhost:3000/api/entries/${id}`, {
    //   cache: 'no-store',
    // });

    if (!res.ok) {
      throw new Error('Failed to fetch entry');
    }
    return res.json();
  } catch (error) {
    console.log(error);
    return {};
  }
};

export default async function EditEntry({ params }) {
  const { id } = params;
  const { entry } = await getEntryById(id);
  const { title, description } = entry;

  return <EditEntryForm id={id} title={title} description={description} />;
}

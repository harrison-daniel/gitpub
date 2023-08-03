export default function AddEntry() {
  return (
    <>
      <form className='flex flex-col '>
        <input
          className='border border-cyan-800 p-6 m-4 '
          type='text'
          placeholder='Entry Title'
        />
        <input
          className='border border-cyan-800 p-6 m-4'
          type='text'
          placeholder='Entry Description'
        />

        <button class='bg-green-700 hover:bg-green-500 text-white font-semibold py-2 px-4 border border-gray-400 rounded shadow'>
          Add Entry
        </button>
      </form>
    </>
  );
}

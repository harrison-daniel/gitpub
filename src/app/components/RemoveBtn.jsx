"use client";

import { HiOutlineTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RemoveBtn({ id }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const removeEntry = async () => {
    console.log("Attempting to delete entry");
    try {
      await fetch(`http://localhost:3000/api/entries?id=${id}`, {
        method: "DELETE",
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to delete entry:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <button onClick={toggleModal} className="text-red-700 hover:text-red-500">
        <HiOutlineTrash size={28} />
      </button>

      {isModalOpen && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center">
          <div className=" z-20 w-auto rounded bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-center text-xl">Confirm Deletion</h2>
            <p className="mb-4 text-center">
              Are you sure you want to delete this entry?
            </p>
            <div className="flex justify-center gap-8">
              <button
                onClick={removeEntry}
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">
                Yes
              </button>
              <button
                onClick={toggleModal}
                className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400">
                No
              </button>
            </div>
          </div>
          <div
            className="absolute left-0 top-0 h-full w-full bg-black opacity-50"
            onClick={toggleModal}></div>
        </div>
      )}
    </>
  );
}

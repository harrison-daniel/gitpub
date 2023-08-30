"use client";

import { HiOutlineTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
// import { CSSTransition } from "react-transition-group";

export default function RemoveBtn({ id }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const removeEntry = async () => {
    console.log("Deleting entry");
    try {
      await fetch(`https://gitpub.vercel.app/api/entries?id=${id}`, {
        // await fetch(`http://localhost:3000/api/entries?id=${id}`, {
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
      <button
        onClick={toggleModal}
        className="text-red-700 hover:text-red-500 active:text-red-700">
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
                className="m-4   rounded border border-gray-400 bg-red-500 px-6 py-2 font-semibold text-white shadow hover:bg-red-600 active:bg-red-500">
                Yes
              </button>
              <button
                onClick={toggleModal}
                className="m-4 rounded border border-gray-400  bg-white px-6 py-2 font-semibold text-gray-800 shadow hover:bg-gray-100 active:bg-white">
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

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditEntryForm({ id, title, address, description }) {
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [newAddress, setNewAddress] = useState(address);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`https://gitpub.vercel.app/api/entries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newTitle, newDescription }),
      });
      // const res = await fetch(`http://localhost:3000/api/entries/${id}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ newTitle, newAddress, newDescription }),
      // });

      if (!res.ok) {
        throw new Error("Failed to update entry");
      }
      router.refresh();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col ">
        <textarea
          onChange={(e) => setNewTitle(e.target.value)}
          value={newTitle}
          className="m-4 border border-cyan-800 p-6 "
          type="text"
          placeholder="Entry Title"
          rows={3}
        />
        <textarea
          onChange={(e) => setNewAddress(e.target.value)}
          value={newAddress}
          className="m-4 border border-cyan-800 p-6"
          type="text"
          placeholder="Entry Description"
          rows={3}
        />
        <textarea
          onChange={(e) => setNewDescription(e.target.value)}
          value={newDescription}
          className="m-4 border border-cyan-800 p-6"
          type="text"
          placeholder="Entry Description"
          rows={3}
        />

        <button className="rounded border  border-gray-400 bg-amber-600 px-4 py-2 font-semibold text-white shadow hover:bg-amber-500">
          Update Entry
        </button>
      </form>
    </>
  );
}

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className=" flex flex-col items-center justify-between p-6 pb-0  ">
      <Link href={"/"} className="mb-2 font-serif text-8xl font-extrabold">
        GitPub
      </Link>

      <div className="flex w-full justify-between px-12 pt-4">
        <Link href={"/"}>
          <button className="rounded border border-gray-400 bg-white px-4 py-2 font-semibold text-gray-800 shadow hover:bg-gray-100">
            Home
          </button>
        </Link>

        <Link href={"/addEntry"} className="">
          <button className="rounded border border-gray-400 bg-white px-4 py-2 font-semibold text-gray-800 shadow hover:bg-gray-100">
            Add Entry
          </button>
        </Link>
      </div>
    </nav>
  );
}

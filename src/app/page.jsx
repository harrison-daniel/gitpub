import EntryList from "./components/EntryList";
import BrewerySearch from "./components/BrewerySearch";
import { Analytics } from "@vercel/analytics/react";

export default function Home() {
  return (
    <>
      <BrewerySearch />
      <EntryList />
      <Analytics />
    </>
  );
}

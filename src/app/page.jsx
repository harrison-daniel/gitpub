import EntryList from "./components/EntryList";
import BrewerySearch from "./components/BrewerySearch";
// import BrewerySearchOpt from "./components/BrewerySearchOpt";

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

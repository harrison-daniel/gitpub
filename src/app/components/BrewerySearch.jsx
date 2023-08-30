"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Modal from "../components/Modal";
// import { VscDebugRestart } from "react-icons/vsc";
import { CgCloseR } from "react-icons/cg";

export default function BrewerySearch() {
  const router = useRouter();
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [breweries, setBreweries] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredBreweries, setFilteredBreweries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  const states = [
    // { value: "", label: "Choose a State" },
    { value: "alabama", label: "Alabama" },
    { value: "alaska", label: "Alaska" },
    { value: "arizona", label: "Arizona" },
    { value: "arkansas", label: "Arkansas" },
    { value: "california", label: "California" },
    { value: "colorado", label: "Colorado" },
    { value: "connecticut", label: "Connecticut" },
    { value: "delaware", label: "Delaware" },
    { value: "district_of_columbia", label: "District Of Columbia" },
    { value: "florida", label: "Florida" },
    { value: "georgia", label: "Georgia" },
    { value: "hawaii", label: "Hawaii" },
    { value: "idaho", label: "Idaho" },
    { value: "illinois", label: "Illinois" },
    { value: "indiana", label: "Indiana" },
    { value: "iowa", label: "Iowa" },
    { value: "kansas", label: "Kansas" },
    { value: "kentucky", label: "Kentucky" },
    { value: "louisiana", label: "Louisiana" },
    { value: "maine", label: "Maine" },
    { value: "maryland", label: "Maryland" },
    { value: "massachusetts", label: "Massachusetts" },
    { value: "michigan", label: "Michigan" },
    { value: "minnesota", label: "Minnesota" },
    { value: "mississippi", label: "Mississippi" },
    { value: "missouri", label: "Missouri" },
    { value: "montana", label: "Montana" },
    { value: "nebraska", label: "Nebraska" },
    { value: "nevada", label: "Nevada" },
    { value: "new_hampshire", label: "New Hampshire" },
    { value: "new_jersey", label: "New Jersey" },
    { value: "new_mexico", label: "New Mexico" },
    { value: "new_york", label: "New York" },
    { value: "north_carolina", label: "North Carolina" },
    { value: "north_dakota", label: "North Dakota" },
    { value: "ohio", label: "Ohio" },
    { value: "oklahoma", label: "Oklahoma" },
    { value: "oregon", label: "Oregon" },
    { value: "pennsylvania", label: "Pennsylvania" },
    { value: "rhode_island", label: "Rhode Island" },
    { value: "south_carolina", label: "South Carolina" },
    { value: "south_dakota", label: "South Dakota" },
    { value: "tennessee", label: "Tennessee" },
    { value: "texas", label: "Texas" },
    { value: "utah", label: "Utah" },
    { value: "vermont", label: "Vermont" },
    { value: "virginia", label: "Virginia" },
    { value: "washington", label: "Washington" },
    { value: "west_virginia", label: "West Virginia" },
    { value: "wisconsin", label: "Wisconsin" },
    { value: "wyoming", label: "Wyoming" },
  ];

  // new useEffect
  useEffect(() => {
    if (!state) {
      setCities([]);
      setBreweries([]);
      return;
    }

    const fetchBreweries = async () => {
      let page = 1;
      let fetchedBreweries = [];

      while (true) {
        const response = await fetch(
          `https://api.openbrewerydb.org/breweries?by_state=${state}&page=${page}&per_page=200`,
        );
        const data = await response.json();
        // console.log("USEEFFECT data", data);

        if (data.length === 0) break;

        fetchedBreweries = [...fetchedBreweries, ...data];
        page++;

        console.log(`USEFFECT fetchedbreweries for ${state}`, fetchedBreweries);
      }

      setBreweries(fetchedBreweries);
      setCities([...new Set(fetchedBreweries.map((b) => b.city))]);
    };

    fetchBreweries();
  }, [state]);

  const handleCityFilter = () => {
    console.log("handleCityFilter button clicked");
    console.log("citites after HandleCItyFilter clicked", cities);

    const matchingUniqueCities = breweries.filter(
      (brewery) => brewery.city.toLowerCase() === city.toLowerCase(),
    );
    setFilteredBreweries(matchingUniqueCities);
    setShowModal(true);
  };

  const capitalizeState = (stateStr) =>
    stateStr
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  // OLD ADD BREWERYINFOTOENTRY
  function AddBreweryInfoToEntry(brewery) {
    const truncatedPostalCode = brewery.postal_code.substring(0, 5);
    const breweryListAddress = `${brewery.address_1}
    ${brewery.city}, ${brewery.state} ${truncatedPostalCode}`;

    setTitle(brewery.name);
    setAddress(breweryListAddress);
    setDescription("Edit entry to add notes");
  }

  // OLD HANDLE SEARCH SUBMIT
  const handleModalSubmit = async (e) => {
    e.preventDefault();

    if (!title || !address || !description) {
      alert("Title and description are required");
      return;
    }

    try {
      const res = await fetch("https://gitpub.vercel.app/api/entries", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ title, address, description }),
      });
      // const res = await fetch("http://localhost:3000/api/entries", {
      //   method: "POST",
      //   headers: { "Content-type": "application/json" },
      //   body: JSON.stringify({ title, address, description }),
      // });

      if (res.ok) {
        router.refresh();
        setShowModal(false);
        resetFields();
        router.push("/");
      } else {
        throw new Error("Failed to create an entry");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    resetFields();
  };

  const resetFields = () => {
    setCity("");
    setState("");
    setBreweries([]);
    setCities([]);
    setFilteredBreweries([]);
    setBreweries([]);
    // setError("");
  };

  return (
    <>
      <div className="">
        <div className=" bg-slate-200 bg-opacity-10 px-4">
          <div className="">
            {/* {error && (
              <p className="text-md flex justify-center font-semibold italic text-red-500">
                {error}
              </p>
            )} */}

            <label
              className="block  text-lg font-bold text-black"
              htmlFor="state">
              State
            </label>
            <select
              className="mt-1.5 w-full rounded-lg border-gray-300 p-0.5 text-gray-700"
              name="state"
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}>
              <option value="">Select a state</option>
              {states.map((state) => (
                <option
                  key={state.value}
                  value={state.value}
                  disabled={state.value === ""}>
                  {state.label}
                </option>
              ))}
            </select>

            {/* show city dropdown after state is selected */}
            {state && (
              <div className="pt-2">
                <label
                  className="block text-lg font-bold text-black"
                  htmlFor="city">
                  City
                </label>
                <select
                  className="mt-1.5 w-full rounded-lg border-gray-300 p-0.5 text-gray-700"
                  name="city"
                  id="city"
                  onChange={(e) => setCity(e.target.value)}>
                  <option value="">Select a City</option>
                  {cities.sort().map((cityName) => (
                    <option key={cityName} value={cityName}>
                      {cityName}
                    </option>
                  ))}
                </select>
                <div className=" flex pt-2 align-middle "></div>
              </div>
            )}

            {/* show button after city is selected */}
            {city && (
              <div className="pt-2">
                <button
                  onClick={handleCityFilter}
                  className="rounded border border-gray-400 bg-amber-600 px-6 py-2 font-semibold text-white shadow hover:bg-amber-500 active:bg-amber-600">
                  Search By City
                </button>
              </div>
            )}

            {showModal && (
              <form
                type="submit"
                onSubmit={handleModalSubmit}
                className="modal ">
                <Modal isOpen={showModal} onClose={closeModal}>
                  <div className=" sticky top-0 flex  items-center  justify-between gap-2  bg-white  px-4 py-4 shadow-xl">
                    <h2 className="sm:text-md text-2xl font-bold">
                      Breweries in {city},{" "}
                      {capitalizeState(state.replace(/_/g, " "))}
                    </h2>

                    <CgCloseR
                      size={34}
                      onClick={closeModal}
                      aria-label="Close Modal"
                      className="flex-none rounded-lg  hover:bg-red-700 active:bg-red-600 "
                    />
                  </div>
                  <div className="">
                    {filteredBreweries.length > 0 && (
                      <div className="">
                        {filteredBreweries.map((brewery) => (
                          <div
                            className="brewery-modal  rounded-lg bg-white p-8  shadow-2xl"
                            key={brewery.id}>
                            <h1 className="text-lg font-bold">
                              {brewery.name}
                            </h1>
                            <div>
                              {`${brewery.address_1},
                      ${brewery.city},
                      ${brewery.state}
                      ${brewery.postal_code.substring(0, 5)}`}
                            </div>

                            <div className="mt-4 ">
                              <button
                                onClick={(e) => AddBreweryInfoToEntry(brewery)}
                                className="m-4   rounded border border-gray-400 bg-amber-600 px-6 py-2 font-semibold text-white shadow hover:bg-amber-500 active:bg-amber-600">
                                Add Brewery to Entries
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Modal>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

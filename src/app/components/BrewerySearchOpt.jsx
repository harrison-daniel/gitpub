"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "../components/Modal";
import { VscDebugRestart } from "react-icons/vsc";
import { FaWindowClose } from "react-icons/fa";

export default function BrewerySearchOpt() {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [error, setError] = useState("");
  const [breweryStateList, setBreweryStateList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filteredBreweries, setFilteredBreweries] = useState([]);
  const [searchStage, setSearchStage] = useState("state");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [cities, setCities] = useState([]);
  // const [page, setPage] = useState(1);

  const router = useRouter();

  const states = [
    { value: "", label: "Choose a State" },
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

  function AddBreweryInfoToEntry(brewery) {
    const truncatedPostalCode = brewery.postal_code.substring(0, 5);
    const breweryListAddress = `${brewery.address_1}
    ${brewery.city}, ${brewery.state} ${truncatedPostalCode}`;

    setTitle(brewery.name);
    setAddress(breweryListAddress);
    setDescription("Edit entry to add notes");
  }

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (!title || !address || !description) {
      alert("Title and description are required");
      return;
    }

    try {
      // const res = await fetch("https://gitpub.vercel.app/api/entries", {
      //   method: "POST",
      //   headers: { "Content-type": "application/json" },
      //   body: JSON.stringify({ title, address, description }),
      // });
      const res = await fetch("http://localhost:3000/api/entries", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ title, address, description }),
      });

      if (res.ok) {
        router.refresh();
        setShowModal(false);
        resetUseStates();
        router.push("/");
      } else {
        throw new Error("Failed to create an entry");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBreweriesByState = async (state, page, perPage) => {
    const response = await fetch(
      `https://api.openbrewerydb.org/v1/breweries?by_state=${state}&per_page=${perPage}&page=${page}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    console.log("fetchBreweriesData -- all results for state", data);
    return data;
  };

  const handleStateSearch = async (e) => {
    e.preventDefault();

    const MAX_RETRIES = 3;

    setError(""); // clear previous error

    if (!state) {
      setError("Please select a State to search by.");
      return;
    }

    let allStateBreweries = [];
    let currentPage = 1;
    const perPage = 200; // fetching max results per page

    try {
      while (true) {
        let retries = 0;
        let success = false;
        let data = [];

        while (retries < MAX_RETRIES && !success) {
          try {
            data = await fetchBreweriesByState(state, currentPage, perPage);
            success = true; // break out of the retry loop
          } catch (err) {
            retries++;
            if (retries === MAX_RETRIES) {
              throw err; // if max retries reached, throw the error to outer catch block
            }
          }
        }

        if (data.length === 0) {
          break; // No more data
        }

        allStateBreweries = [...allStateBreweries, ...data];

        if (data.length < perPage) {
          break; // last page of data
        }

        currentPage++;
      }

      setBreweryStateList(allStateBreweries);
      console.log(
        "initial setBreweryStateList in HANDLESTATESEARCH ",
        breweryStateList,
      );

      // get unique cities from data
      const uniqueCities = [
        ...new Set(allStateBreweries.map((brewery) => brewery.city)),
      ].sort();

      setCities(uniqueCities);
      console.log("initial setCities in HANDLESTATESEARCH", cities);
      setCity("");
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching the data. Please try again.");
    }
  };

  const handleCityFilter = () => {
    if (!city.trim()) {
      setError("Please provide a city before filtering.");
      return;
    }
    if (city === "" || state === "") {
      setError("Both fields are required");
      return;
    }

    // City should only contain alphabetical characters and spaces
    if (!/^[\p{L} ]+$/u.test(city)) {
      setError("City name should only contain letters and spaces");
      return;
    }

    const matchingUniqueCities = breweryStateList.filter(
      (brewery) => brewery.city.toLowerCase() === city.toLowerCase(),
    );

    console.log("breweryStateList in handlecity", breweryStateList);
    console.log(
      "matchingUniqueCities results in handlecity",
      matchingUniqueCities,
    );
    setFilteredBreweries(matchingUniqueCities);

    console.log(
      "filteredBreweries on initial handlecityfilter",
      filteredBreweries,
    );
    setShowModal(true);
  };

  const resetUseStates = () => {
    setCity("");
    setState("");
    setBreweryStateList([]);
    setFilteredBreweries([]);
    setCities([]);
    setError("");
    setSearchStage("state");
  };

  const closeModal = () => {
    setShowModal(false);
    resetUseStates();
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  function capitalizeState(state) {
    return state.split(" ").map(capitalizeFirstLetter).join(" ");
  }

  // useEffect(() => {
  //   if (!showModal) {
  //     setCity("");
  //     setSearchStage("state");
  //   }
  // }, [showModal]);

  // const loadMoreButton = () => {
  //   console.log("load more button clicked");
  // };

  return (
    <>
      <div className="">
        <div className=" bg-slate-200 bg-opacity-10 px-4">
          <form>
            <div className="">
              {error && (
                <p className="text-md flex justify-center font-semibold italic text-red-500">
                  {error}
                </p>
              )}

              <label className="block  text-lg font-bold text-black">
                State
              </label>

              <select
                name="SearchLocationState"
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="mt-1.5 w-full rounded-lg border-gray-300 p-0.5 text-gray-700 ">
                {states.map((state) => (
                  <option
                    key={state.value}
                    value={state.value}
                    disabled={state.value === ""}>
                    {state.label}
                  </option>
                ))}
              </select>
            </div>

            {cities.length === 0 && (
              <div className="flex justify-center px-10 pt-2 align-middle">
                <button
                  onClick={handleStateSearch}
                  className="focus:shadow-outline rounded bg-blue-500 px-2 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none ">
                  Search By State
                </button>
              </div>
            )}
          </form>

          {cities.length > 0 && (
            <>
              <div className="pt-2">
                <label className="block text-lg font-bold text-black">
                  City
                </label>
                <select
                  name="SearchLocationCity"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border-gray-300 p-0.5 text-gray-700 ">
                  <option value="">Select City</option>
                  {cities.map((cityName) => (
                    <option key={cityName} value={cityName}>
                      {cityName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-center pb-4 pt-2 ">
                <div className="flex px-10 pt-2 align-middle ">
                  <button
                    onClick={handleCityFilter}
                    className="focus:shadow-outline rounded bg-blue-500 px-2 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none">
                    Search By City
                  </button>
                </div>
                <div className="flex px-10 pt-2 align-middle">
                  <button onClick={resetUseStates}>
                    <VscDebugRestart
                      size={33}
                      className="city-search-reset-button  rounded  "
                    />
                  </button>
                </div>
              </div>
            </>
          )}

          {showModal && (
            <form type="submit" onSubmit={handleSearchSubmit}>
              <Modal isOpen={showModal} onClose={closeModal}>
                <div className="flex justify-evenly gap-6">
                  <h2 className="mb-4  text-2xl font-bold">
                    Breweries in {city},{" "}
                    {capitalizeState(state.replace(/_/g, " "))}
                  </h2>

                  <FaWindowClose
                    size={34}
                    onClick={closeModal}
                    aria-label="Close Modal"
                    className="modal-exit-icon "
                  />
                </div>
                {filteredBreweries.length > 0 && (
                  <div>
                    {filteredBreweries.map((brewery) => (
                      <div
                        className="brewery-modal rounded-lg bg-white p-8  shadow-2xl"
                        key={brewery.id}>
                        <h1 className="text-lg font-bold">{brewery.name}</h1>
                        <div>
                          {`${brewery.address_1},
                      ${brewery.city},
                      ${brewery.state}
                      ${brewery.postal_code.substring(0, 5)}`}
                        </div>

                        <div className="mt-4 ">
                          <button
                            onClick={(e) => AddBreweryInfoToEntry(brewery)}
                            className="m-4   rounded border border-gray-400 bg-amber-600 px-6 py-2 font-semibold text-white shadow hover:bg-amber-500">
                            Add Brewery to Entries
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Load More Button
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={loadMoreButton}
                    className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none">
                    Load More
                  </button>
                </div> */}
              </Modal>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

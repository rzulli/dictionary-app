"use client";
import PopularWords from "@/components/local/PopularWords";
import SearchBar from "@/components/search/SearchBar";
import SearchWordList from "@/components/search/SearchWordsList";
import { SearchContext } from "@/context/search/SearchContext";
import { useState } from "react";

export default function Home() {
  const [searchState, setSearchState] = useState(null);
  const searchLocationCls = searchState?.results ? "" : "justify-center";
  return (
    <div>
      <SearchContext.Provider
        value={{ search: searchState, setState: setSearchState }}
      >
        <main
          className={
            searchLocationCls +
            " flex flex-1 flex-col min-h-[80vh] items-center "
          }
        >
          <div className="flex justify-center text-xl mb-8">
            Dictionary Search
          </div>
          <SearchBar />
          <div className="mt-12">
            {" "}
            <SearchWordList />
          </div>
        </main>
      </SearchContext.Provider>
      <footer></footer>
    </div>
  );
}

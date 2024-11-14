"use client";
import PopularWords from "@/components/local/popularWords";
import SearchBar from "@/components/local/searchBar";
import SearchWordList from "@/components/local/searchWordsList";
import { SearchContext } from "@/hooks/search/useSearch";
import { useState } from "react";

export default function Home() {
  const [searchState, setSearchState] = useState({});
  return (
    <div>
      <SearchContext.Provider
        value={{ search: searchState, setState: setSearchState }}
      >
        <main className="flex flex-1 flex-col min-h-[80vh] items-center">
          <SearchBar />
          <SearchWordList />
        </main>
      </SearchContext.Provider>
      <footer></footer>
    </div>
  );
}

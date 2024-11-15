import React from "react";

const SearchResult = {
  results: [],
  hasNext: false,
  hasPrev: false,
  totalDocs: 0,
  next: null,
  prev: null,
};
const defaultValue = {
  search: SearchResult,
  setState: (state) => ({}),
};
export const SearchContext = React.createContext(defaultValue);

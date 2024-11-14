import React from "react";

const defaultValue = [
  {
    name: "",
    email: "",
    id: null,
    favorites: [],
    history: [],
  },
  () => {},
];
export const UserContext = React.createContext(defaultValue);

"use client";
import { UserContext } from "@/hooks/useProfile";
import { SessionProvider, useSession } from "next-auth/react";
import React, { ReactNode, useEffect, useState } from "react";

interface Props {
  children: ReactNode;
}

function ProfileProvider({ children }: Props) {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    id: null,
    favorites: [],
    history: [],
  });
  const { data: session } = useSession();

  useEffect(() => {
    if (profile.id == null && session?.user) {
      const fetchProfile = async () => {
        const res = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_API_URL + "/user/me/",
          {
            headers: {
              Authorization: "Bearer " + session?.user.token,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        let user = await res.json();
        user.favorites = user.favorites.map((obj) =>
          obj.word ? obj.word : obj
        );
        setProfile(user);
      };
      fetchProfile();
    }
  }, [session]);

  async function favoriteWord(
    word: string,
    successCallback: () => void,
    errorCallback: (error: string) => void
  ) {
    if (session?.user) {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_API_URL +
          "/entries/en/" +
          word +
          "/favorite",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + session.user.token,
          },
        }
      );
      const updatedProfile = {
        ...profile,
        favorites: [...profile.favorites, word],
      };
      setProfile(updatedProfile);
      if (res.ok) {
        successCallback();
      } else {
        errorCallback(res.stats);
      }
    }
  }
  async function unfavoriteWord(
    word: string,
    successCallback: () => void,
    errorCallback: (error: string) => void
  ) {
    if (session?.user) {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_API_URL +
          "/entries/en/" +
          word +
          "/unfavorite",
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + session.user.token,
          },
        }
      );
      const updatedProfile = {
        ...profile,
        favorites: profile.favorites.filter((w) => w != word),
      };
      setProfile(updatedProfile);
      if (res.ok) {
        successCallback();
      } else {
        errorCallback(res.status);
      }
    }
  }
  function addHistory() {}
  function hasFavorited(word) {
    return profile.favorites.includes(word);
  }
  const profileActions = {
    favoriteWord,
    unfavoriteWord,
    addHistory,
    hasFavorited,
  };
  return (
    <UserContext.Provider value={[profile, setProfile, profileActions]}>
      {children}
    </UserContext.Provider>
  );
}

export default ProfileProvider;

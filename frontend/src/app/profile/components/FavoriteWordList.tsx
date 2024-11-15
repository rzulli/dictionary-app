"use client";

import WordCard from "@/components/local/WordCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProfileContext } from "@/context/profile/ProfileContext";

import { useContext } from "react";

export function FavoriteWordList() {
  const [profile, setProfile, profileActions] = useContext(ProfileContext);
  return (
    <>
      {profile.favorites.map((word, i) => (
        <WordCard cls="bg-slate-100 min-w-[15rem]" key={i} word={word}>
          {word}
        </WordCard>
      ))}

      {profile.favorites.length == 0 && (
        <div className="text-xl text-slate-500 p-3 my-8">
          No favorite words yet.
        </div>
      )}
    </>
  );
}

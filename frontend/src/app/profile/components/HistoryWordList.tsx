"use client";

import WordCard from "@/components/local/WordCard";
import { ProfileContext } from "@/context/profile/ProfileContext";
import { useContext } from "react";

export function HistoryWordList() {
  const [profile, setProfile, profileActions] = useContext(ProfileContext);
  return (
    <>
      {profile.history.map((hist, i) => (
        <WordCard cls="bg-slate-100 min-w-[15rem]" key={i} word={hist.word}>
          {hist.word}
        </WordCard>
      ))}
      {profile.history.length == 0 && (
        <div className="text-xl text-slate-500 p-3 my-8">
          No favorite words yet.
        </div>
      )}
    </>
  );
}

"use client";
import { WordCard } from "@/components/local/searchWordsList";
import { UserContext } from "@/hooks/useProfile";
import { Heart, Smile } from "lucide-react";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";

function FavoriteWordList() {
  const [profile, setProfile, profileActions] = useContext(UserContext);
  return (
    <>
      {profile.favorites.map((word, i) => (
        <WordCard cls="bg-slate-100 min-w-[15rem]" key={i} word={word}>
          {word}
        </WordCard>
      ))}
    </>
  );
}
export default function Profile() {
  const { data: session } = useSession();
  const [profile, setProfile, profileActions] = useContext(UserContext);

  return (
    <>
      {" "}
      <div className="p-4">
        <div className=" text-3xl flex gap-2 items-center mb-6">
          Welcome Back!
        </div>

        <div className="text-xl flex  gap-2 items-center">
          <Heart />
          Favorite words
        </div>
        <div className="w-[50%] flex gap-3 p-6 ">{<FavoriteWordList />}</div>

        <div className="text-xl flex gap-2 items-center">
          <Heart />
          Last viewed
        </div>
        <div className="w-[50%] flex gap-3 p-6 ">{<FavoriteWordList />}</div>
      </div>
    </>
  );
}

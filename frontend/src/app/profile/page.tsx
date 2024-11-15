"use client";
import { ProfileContext } from "@/context/profile/ProfileContext";
import { Heart, Smile } from "lucide-react";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";
import { HistoryWordList } from "./components/HistoryWordList";
import { FavoriteWordList } from "./components/FavoriteWordList";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useRef } from "react";
import { useDraggable } from "react-use-draggable-scroll-safe";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { data: session } = useSession();
  const [profile, setProfile, profileActions] = useContext(ProfileContext);
  const ref =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>; // We will use React useRef hook to reference the wrapping div:
  const { events } = useDraggable(ref, {
    applyRubberBandEffect: true,
  }); // Now we pass the reference to the useDraggable hook:

  const ref2 =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>; // We will use React useRef hook to reference the wrapping div:
  const { events: events2 } = useDraggable(ref2, {
    applyRubberBandEffect: true,
  });

  const { redirect } = useRouter();
  useEffect(() => {
    if (!profile) {
      redirect("/");
    }
  }, [profile]);

  return (
    <>
      <div className="px-8">
        <div className=" text-3xl flex gap-2 items-center my-20">
          Welcome Back, {session?.user.name}!
        </div>

        <div className="text-xl flex  gap-2 items-center">
          <Heart />
          Favorite words
        </div>
        <div
          {...events}
          ref={ref}
          className="overflow-x-scroll no-scrollbar mb-16"
        >
          <div className="w-[50%] flex gap-3 p-6"> {<FavoriteWordList />}</div>
        </div>

        <div className="text-xl flex gap-2 items-center ">
          <Heart />
          Last viewed
        </div>
        <div {...events2} ref={ref2} className="overflow-x-scroll no-scrollbar">
          <div className="w-[50%] flex gap-3 p-6 ">{<HistoryWordList />}</div>
        </div>
      </div>
    </>
  );
}

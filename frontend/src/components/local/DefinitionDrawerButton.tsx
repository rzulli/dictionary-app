"use client";
import { SearchContext } from "@/context/search/SearchContext";
import {
  Expand,
  Heart,
  HeartCrack,
  HeartHandshake,
  HeartOff,
  MoreHorizontal,
  PlayCircle,
  Slash,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import LoginForm from "../forms/loginForm";
import Login from "@/app/login/page";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ProfileContext } from "@/context/profile/ProfileContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Register from "@/app/register/page";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import MeaningContainer from "./MeaningContainer";

export default function DefinitionDrawerButton({ word }) {
  const { data: session } = useSession();
  const [metadata, setMetadata] = useState(null);
  const audioRef = useRef();

  function play() {
    const audio = audioRef.current;
    console.log(audio);
    audio.play();
  }
  function getPhoneticAudio(data): string {
    const phonetics = data.phonetics;
    let audio = "";
    console.log(phonetics);
    if (phonetics && phonetics.length > 0) {
      phonetics.map((obj) => {
        if (obj.audio) {
          console.log(obj.audio);
          audio = obj.audio;
        }
      });
    }
    return audio;
  }
  useEffect(() => {
    const fetchDefinition = async () => {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_API_URL + "/entries/en/" + word,
        {
          headers: {
            Authorization: "Bearer " + session?.user.token,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      let data = (await res.json()).wordMetadata;
      if (data && data.length > 0) {
        data[0].audio = getPhoneticAudio(data[0]);
        console.log(data[0]);
        setMetadata(data[0]);

        return;
      }
      setMetadata(null);
    };
    fetchDefinition();
  }, [word]);
  return (
    <>
      <Drawer>
        {metadata && (
          <DrawerTrigger>
            <Expand className="hover:text-slate-300" />
          </DrawerTrigger>
        )}
        <DrawerContent>
          <DrawerHeader className="p-0 px-4">
            <DrawerTitle>
              <div className="text-6xl flex  items-center gap-5">
                {word}
                {metadata?.audio && (
                  <div className="flex items-center">
                    <button onClick={play}>
                      <PlayCircle />
                    </button>
                    <audio id="a1" ref={audioRef}>
                      <source src={metadata.audio} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </div>
              <div className="font-thin text-xl">
                {metadata && metadata.phonetic}
              </div>
            </DrawerTitle>

            {!metadata && (
              <DrawerDescription>
                <div className="text-xl">Definição não encontrada</div>{" "}
              </DrawerDescription>
            )}
          </DrawerHeader>
          <ScrollArea className="h-[40vh]">
            {metadata && (
              <div className="px-4">
                <div className="flex flex-col space-y-5 ">
                  {metadata.meanings &&
                    metadata.meanings.map((meaning, i) => (
                      <MeaningContainer key={i} meaning={meaning} />
                    ))}
                </div>
                {metadata.origin && (
                  <div className="mt-3">Origin : {metadata.origin}</div>
                )}
              </div>
            )}
          </ScrollArea>

          <DrawerFooter>
            <div className="text-xs font-light text-slate-500 leading-5 flex flex-col">
              <div>Sources</div>
              {metadata &&
                metadata.sourceUrls &&
                metadata.sourceUrls.map((obj, i) => (
                  <a key={i} href={obj}>
                    {obj}
                  </a>
                ))}
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

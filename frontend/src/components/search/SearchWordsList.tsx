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
import MeaningContainer from "../local/MeaningContainer";
import SearchWordPaginator from "./SearchWordPaginator";
import WordCard from "../local/WordCard";

interface PopularWordsProps {}
export default function SearchWordList(props: PopularWordsProps) {
  return (
    <SearchContext.Consumer>
      {(state) => (
        <div className="w-[60vw]">
          {state.search?.results?.length > 0 && (
            <>
              <SearchWordPaginator search={state.search} />
              <div className=" flex flex-col gap-4 my-3">
                {Object.entries(state.search.results).map(([k, value]) => (
                  <WordCard key={k} word={value.word} />
                ))}
              </div>
              <SearchWordPaginator search={state.search} />
            </>
          )}
        </div>
      )}
    </SearchContext.Consumer>
  );
}
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
import FavoriteButton from "./FavoriteButton";
import DefinitionDrawerButton from "./DefinitionDrawerButton";

export default function WordCard({ word, cls }) {
  const [effect, setEffect] = useState(false);
  const [profile, setProfile, profileActions] = useContext(ProfileContext);

  return (
    <div
      className={
        `${effect ? "rippleBackgroundContainer" : "clearAnimation"} ${
          profileActions.hasFavorited(word) ? "bg-slate-300" : "bg-slate-100"
        }
         w-full p-6 border border-slate-300 rounded-md flex gap-4 ` + cls
      }
    >
      <span className="flex-1 text-xl font-serif">{word}</span>
      <FavoriteButton word={word} setEffect={setEffect} />
      <DefinitionDrawerButton key={word} word={word} />
    </div>
  );
}

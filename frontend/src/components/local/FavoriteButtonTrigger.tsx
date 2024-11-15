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
import FavoriteToggle from "./FavoriteToggle";

export function FavoriteButtonTrigger({ setEffect, word }) {
  const { data: session } = useSession();

  return (
    <>{session?.user && <FavoriteToggle word={word} setEffect={setEffect} />}</>
  );
}

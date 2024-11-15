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

export default function SearchWordPaginator({ search }) {
  const searchParams = useSearchParams();
  return (
    <Pagination>
      <PaginationContent>
        {search.hasPrev && (
          <PaginationItem>
            <PaginationPrevious
              href={{
                pathname: "/",
                query: {
                  search: searchParams.get("search"),
                  limit: Number(searchParams.get("limit")),
                  prev: search.previous,
                  after: "",
                  page: Math.max(Number(searchParams.get("page")) - 1, 1),
                },
              }}
            />
          </PaginationItem>
        )}
        <PaginationItem className="flex">
          <span>
            Página {searchParams.get("page")} de{" "}
            {search.results.length > 0 &&
              Math.ceil(search.totalDocs / Number(searchParams.get("limit")))}
          </span>
        </PaginationItem>
        {search.hasNext && (
          <PaginationItem>
            <PaginationNext
              href={{
                pathname: "/",
                query: {
                  search: searchParams.get("search"),
                  limit: Number(searchParams.get("limit")),
                  prev: "",
                  after: search.next,
                  page: Number(searchParams.get("page")) + 1,
                },
              }}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

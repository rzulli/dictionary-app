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
import AuthorizedDrawerWithTrigger from "./AuthorizedDrawerWithTrigger";
import { FavoriteButtonTrigger } from "./FavoriteButtonTrigger";
import LoginDrawerForm from "./LoginDrawerForm";

export default function FavoriteButton({ word, setEffect }) {
  const { data: session } = useSession();

  const [profile, setProfile, profileActions] = useContext(ProfileContext);

  return (
    <>
      <AuthorizedDrawerWithTrigger
        trigger={<FavoriteButtonTrigger word={word} setEffect={setEffect} />}
        triggerCallback={
          profileActions.hasFavorited(word)
            ? () => profileActions.unfavoriteWord(word, () => setEffect(false))
            : () => profileActions.favoriteWord(word, () => setEffect(false))
        }
      >
        {session?.user && (
          <>
            <DrawerTitle>Favorite palavra {session?.user?.name} </DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </>
        )}
        {!session?.user && <LoginDrawerForm />}
      </AuthorizedDrawerWithTrigger>
    </>
  );
}

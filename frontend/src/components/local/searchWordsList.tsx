"use client";
import { SearchContext } from "@/hooks/search/useSearch";
import {
  Expand,
  Heart,
  HeartCrack,
  HeartHandshake,
  HeartOff,
  MoreHorizontal,
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
import LoginForm from "./loginForm";
import Login from "@/app/login/page";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/hooks/useProfile";

function DefinitionDrawerButton({ word }) {
  const { data: session } = useSession();

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
    };
    fetchDefinition();
  }, []);
  return (
    <>
      <Drawer>
        <DrawerTrigger>
          <Expand className="hover:text-slate-300" />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function LoginDrawerForm() {
  return (
    <>
      <DrawerTitle>Login </DrawerTitle>

      <Login />
    </>
  );
}
interface LoginDrawerProps {
  trigger: React.ReactNode;
}
export function LoginDrawer({ trigger }: LoginDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger className="flex">{trigger}</DrawerTrigger>
      <DrawerContent>
        <LoginDrawerForm redirectUrl={"/profile"} />
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
}
interface AuthorizedDrawerWithTriggerProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  triggerCallback: () => void;
}
function AuthorizedDrawerWithTrigger({
  children,
  trigger,
  triggerCallback,
}: AuthorizedDrawerWithTriggerProps) {
  console.log(children, triggerCallback, trigger);
  return (
    <Drawer>
      <DrawerTrigger
        onClick={(e) => {
          e.preventDefault();
          triggerCallback();
        }}
      >
        {trigger}
      </DrawerTrigger>
      <DrawerContent>
        {children}

        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
}

function FavoriteToggle({ setEffect, word }) {
  const [profile, setProfile, profileActions] = useContext(UserContext);

  const hasFavorited = profileActions.hasFavorited(word);
  return (
    <>
      {!hasFavorited && (
        <Heart
          onClick={() => {
            setEffect(true);
          }}
          onAnimationEnd={() => setEffect(false)}
          className="hover:text-slate-300"
        />
      )}
      {hasFavorited && (
        <HeartOff
          onClick={() => {
            setEffect(true);
          }}
          onAnimationEnd={() => setEffect(false)}
          className="hover:text-slate-300"
        />
      )}
    </>
  );
}
function FavoriteButtonTrigger({ setEffect, word }) {
  const { data: session } = useSession();

  return (
    <>{session?.user && <FavoriteToggle word={word} setEffect={setEffect} />}</>
  );
}
function FavoriteButton({ word, setEffect }) {
  const { data: session } = useSession();

  const [profile, setProfile, profileActions] = useContext(UserContext);

  return (
    <>
      <AuthorizedDrawerWithTrigger
        trigger={<FavoriteButtonTrigger word={word} setEffect={setEffect} />}
        triggerCallback={
          profileActions.hasFavorited(word)
            ? () => profileActions.unfavoriteWord(word, () => alert("aaa"))
            : () => profileActions.favoriteWord(word, () => alert("aaa"))
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
export function WordCard({ word, cls }) {
  const [effect, setEffect] = useState(false);

  return (
    <div
      className={
        `${
          effect && "rippleBackgroundContainer"
        } "w-full p-6 border rounded-md flex gap-4 ` + cls
      }
    >
      <span className="flex-1 text-xl">{word}</span>
      <FavoriteButton word={word} setEffect={setEffect} />
      <DefinitionDrawerButton />
    </div>
  );
}

function SearchWordPaginator({ search }) {
  const searchParams = useSearchParams();
  console.log(searchParams.get("search"));
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
interface PopularWordsProps {}
export default function SearchWordList(props: PopularWordsProps) {
  return (
    <SearchContext.Consumer>
      {(state) => (
        <div className="w-[50%]">
          {state.search?.results?.length > 0 && (
            <>
              <SearchWordPaginator search={state.search} />
              <div className=" flex flex-col gap-4">
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

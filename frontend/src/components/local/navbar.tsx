"use client";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  ArrowDown,
  ArrowDownNarrowWide,
  BookMarked,
  ChevronDown,
  EllipsisVertical,
  LogInIcon,
  LogOut,
  User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Login from "@/app/login/page";

import { useRouter } from "next/navigation";
import LoginDrawer from "./LoginDrawer";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="w-full p-4 flex justify-between">
      <a
        href="/"
        className="text-2xl flex gap-2 p-4 items-center justify-center"
      >
        {" "}
        <BookMarked className="text-slate-700" />
        Dictionary
      </a>
      <div className="p-4 flex ">
        <DropdownMenu>
          {session?.user && (
            <DropdownMenuTrigger className="rounded-xl hover:bg-slate-100 p-3">
              <span className="flex gap-2">
                Hello, {session.user.name} <ChevronDown />
              </span>
            </DropdownMenuTrigger>
          )}
          {!session?.user && (
            <div className="rounded-xl hover:bg-slate-100 p-3">
              <LoginDrawer trigger={<LogInIcon className="text-lg" />} />
            </div>
          )}

          {session?.user && (
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  router.push("/");
                }}
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>{" "}
    </div>
  );
}

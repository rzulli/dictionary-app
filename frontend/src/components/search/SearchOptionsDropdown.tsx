"use client";
import { EllipsisVertical, Search } from "lucide-react";
import { Input } from "../ui/input";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { SearchContext } from "@/context/search/SearchContext";
import { useContext, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export default function SearchOptionDropdown() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const { replace } = useRouter();
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {" "}
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          View
          <ToggleGroup
            onValueChange={(value) => {
              params.set("limit", value);
              replace(`${pathname}?${params.toString()}`);
            }}
            defaultChecked={params.get("limit")}
            variant="outline"
            type="single"
          >
            <ToggleGroupItem value="5">5</ToggleGroupItem>
            <ToggleGroupItem value="10">10</ToggleGroupItem>
            <ToggleGroupItem value="20">20</ToggleGroupItem>
          </ToggleGroup>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

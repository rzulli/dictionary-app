"use client";
import { EllipsisVertical, Search } from "lucide-react";
import { Input } from "../ui/input";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { SearchContext } from "@/hooks/search/useSearch";
import { useContext, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

function SearchOptionDropdown() {
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
interface SearchBarProps {}
export default function SearchBar(props: SearchBarProps) {
  const { setState } = useContext(SearchContext);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const fetchSearch = async () => {
    const params = new URLSearchParams(searchParams);
    console.log(params.toString());
    if (params.get("search")) {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_API_URL +
          "/entries/en?" +
          params.toString()
      );
      const resData = await res.json();
      setState(() => resData);
      console.log(resData);
    }
  };

  useEffect(() => {
    fetchSearch();
  }, [searchParams]);
  const handleSearch = useDebouncedCallback(async (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (!params.has("limit")) {
      params.set("limit", "10");
    }
    if (!params.has("page")) {
      params.set("page", "1");
    }
    if (e.target.value) {
      console.log(e.target.value);
      if (params.get("search") != e.target.value) {
        params.set("page", "1");
        params.delete("after");
        params.delete("prev");
      }
      params.set("search", e.target.value);

      console.log(searchParams.get("after"));
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);
  return (
    <div className="w-[50%] flex gap-3">
      <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
        <input
          className="w-full"
          onChange={(e) => handleSearch(e)}
          defaultValue={searchParams.get("search")?.toString()}
        />
        <Search />
      </div>
      <SearchOptionDropdown />
    </div>
  );
}

"use client";
import { SearchContext } from "@/hooks/search/useSearch";
import { Expand, Heart, MoreHorizontal, Slash } from "lucide-react";
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

function WordSearchCard(props) {
  return (
    <div className="w-full p-4 border rounded-md flex ">
      <span className="flex-1 text-xl">{props.word}</span>
      <Heart />
      <Expand />
    </div>
  );
}

function SearchWordPaginator(props) {
  const searchParams = useSearchParams();
  console.log(searchParams.get("search"));
  return (
    <Pagination>
      <PaginationContent>
        {props.search.hasPrev && (
          <PaginationItem>
            <PaginationPrevious
              href={{
                pathname: "/",
                query: {
                  search: searchParams.get("search"),
                  limit: Number(searchParams.get("limit")),
                  prev: props.search.previous,
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
            {props.search.results.length > 0 &&
              Math.ceil(
                props.search.totalDocs / Number(searchParams.get("limit"))
              )}
          </span>
        </PaginationItem>
        {props.search.hasNext && (
          <PaginationItem>
            <PaginationNext
              href={{
                pathname: "/",
                query: {
                  search: searchParams.get("search"),
                  limit: Number(searchParams.get("limit")),
                  prev: "",
                  after: props.search.next,
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
              {Object.entries(state.search.results).map(([k, value]) => (
                <WordSearchCard key={k} word={value.word} />
              ))}
              <SearchWordPaginator search={state.search} />
            </>
          )}
        </div>
      )}
    </SearchContext.Consumer>
  );
}

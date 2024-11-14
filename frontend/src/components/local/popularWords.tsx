import { SearchContext } from "@/hooks/search/useSearch";

interface PopularWordsProps {}
export default function PopularWords(props: PopularWordsProps) {
  return (
    <SearchContext.Consumer>
      {(search) => <>{JSON.stringify(search)}</>}
    </SearchContext.Consumer>
  );
}

import { SearchContext } from "@/context/search/SearchContext";

// TODO: Implement popular words frontend
interface PopularWordsProps {}
export default function PopularWords(props: PopularWordsProps) {
  return (
    <SearchContext.Consumer>
      {(search) => <>{JSON.stringify(search)}</>}
    </SearchContext.Consumer>
  );
}

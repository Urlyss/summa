import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
  Pagination,
  useInstantSearch,
} from "react-instantsearch";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRight, SearchIcon } from "lucide-react";
import { Separator } from "./ui/separator";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import { useEffect, useState } from "react";

//@ts-ignore
function Hit({ hit }) {
  let type = "";
  switch (hit.id.split("-").length) {
    case 1: {
      type = "part";
      break;
    }
    case 2: {
      type = "treatise";
      break;
    }
    case 3: {
      type = "question";
      break;
    }
    case 4: {
      type = "article";
      break;
    }
    default:
      break;
  }
  return (
    <DialogClose asChild>
      <Link
        href={`/explore/${hit.id}`}
        className="w-100 block hover:bg-secondary/85 py-2 px-4"
      >
        <div className="flex justify-between items-center">
          <Highlight
            attribute="title"
            hit={hit}
            classNames={{ highlighted: "bg-primary text-primary-foreground" }}
          />
          <div>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{`click to see the ${type}`}</span>
        <Separator className="my-2" />
      </Link>
    </DialogClose>
  );
}

function SearchErrorToast() {
  const { toast } = useToast();
  const { addMiddlewares } = useInstantSearch();
  const [error, setError] = useState(null);

  useEffect(() => {
    //@ts-ignore
    const middleware = ({ instantSearchInstance }) => {
      //@ts-ignore
      function handleError(searchError) {
        setError(searchError);
      }

      return {
        subscribe() {
          instantSearchInstance.addListener("error", handleError);
        },
        unsubscribe() {
          instantSearchInstance.removeListener("error", handleError);
        },
      };
    };

    return addMiddlewares(middleware);
  }, [addMiddlewares]);

  if (!error) {
    return null;
  } else {
    return (
      <div className="p-6 bg-destructive text-destructive-foreground flex justify-around items-center rounded-md">
        <div>Error with the search engine.</div>{" "}
        <ToastAction
          onClick={() => window.location.reload()}
          altText="reload engine"
          className="border-muted/40 hover:border-destructive/30 hover:bg-destructive hover:text-destructive-foreground focus:ring-destructive"
        >
          Reload Page
        </ToastAction>
      </div>
    );
  }
}

const CustomSearchBox = () => {
  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "",
    process.env.NEXT_PUBLIC_ALGOLIA_API_KEY || ""
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-light">
          <SearchIcon className="lg:mr-2 h-4 w-4" />
          <span className="lg:flex hidden">Search in Summa...</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[70dvh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>Search in the entire app here.</DialogDescription>
        </DialogHeader>
        <InstantSearch searchClient={searchClient} indexName="summa">
          <SearchErrorToast />
          <SearchBox
            placeholder="Type here"
            classNames={{
              form: "flex w-full max-w-sm items-center space-x-2",
              submit:
                "mx-2 p-2 bg-primary inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
              submitIcon: "h-4 w-4 fill-primary-foreground",
              loadingIcon: "m-2 h-4 w-4 fill-primary-foreground",
              resetIcon: "h-4 w-4 fill-destructive-foreground",
              reset:
                "mx-2 p-2 bg-destructive inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
              input:
                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            }}
          />
          <Hits hitComponent={Hit} />
          <Pagination
            classNames={{
              list: "mx-auto flex w-full justify-center gap-2",
              item: "p-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
              selectedItem:
                "bg-primary text-primary-foreground shadow hover:bg-primary/90",
            }}
          />
        </InstantSearch>
      </DialogContent>
    </Dialog>
  );
};

export default CustomSearchBox;

import React, { ChangeEventHandler, useEffect, useState } from "react";
import qs from "query-string";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounceValue } from "@/hooks/useDebounceValue";

const SearchInput = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");

  const pathname = usePathname();
  const router = useRouter();

  const [value, setValue] = useState(title || "");

  const debouncedValue = useDebounceValue<string>(value);

  useEffect(() => {
    const query = { title: debouncedValue };

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  }, [debouncedValue, router]);

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  if (pathname !== "/") return null;

  return (
    <div className="relative sm:block hidden">
      <Search className="absolute h-4 w-4 top-3 left-4 text-muted-foreground" />
      <Input
        placeholder="Search"
        className="pl-10 bg-primary/10"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchInput;

"use client";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const searchItems = [
  "Calendar",
  "Search Emoji",
  "Calculator",
  "Profile",
  "Billing",
  "Settings",
];

const SearchCommand = () => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const filteredItems = query
    ? searchItems
        .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
    : [];

  return (
    <div className="relative  max-w-md ml-4 ">
      <Command className="bg-muted rounded-none border-b border-gray-600 ">
        <CommandInput
          className="w-full border-b "
          placeholder="Search for a file"
          value={query}
          onValueChange={(val) => setQuery(val || "")}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {isFocused && (
          <CommandList className="absolute top-full left-0 w-full z-50 max-w-lg bg-muted rounded-b-md  shadow-xl ">
            {filteredItems.length === 0 ? (
              <CommandEmpty>No results found.</CommandEmpty>
            ) : (
              <CommandGroup heading="Results">
                {filteredItems.map((item, index) => (
                  <CommandItem key={index}>{item}</CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
};

export default SearchCommand;

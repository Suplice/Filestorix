
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useDebounce } from "@uidotdev/usehooks";
import { searchCommandItems } from "@/lib/api/search";
import { UserSearchResult, CourseSearchResult } from "@/lib/types/search";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen } from "lucide-react";

const SearchCommandBody = () => {
  const { showModal, isOpen, hideModal } = useModal();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [userResults, setUserResults] = useState<UserSearchResult[]>([]);
  const [courseResults, setCourseResults] = useState<CourseSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery) {
      setUserResults([]);
      setCourseResults([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const results = await searchCommandItems(debouncedQuery);
      if (results) {
        setUserResults(results.users || []);
        setCourseResults(results.courses || []);
      } else {
        setUserResults([]);
        setCourseResults([]);
      }
      setLoading(false);
    };

    fetchData();
  }, [debouncedQuery]);

  const handleOpenChange = (state: boolean) => {
    if (state) {
      showModal("SearchBox", {});
    } else {
      hideModal();
      setQuery("");
      setUserResults([]);
      setCourseResults([]);
      setLoading(false);
    }
  };

  const handleSelect = (url: string) => {
    router.push(url);
    handleOpenChange(false);
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTitle asChild>
        <VisuallyHidden>Search courses and users</VisuallyHidden>
      </DialogTitle>

      <CommandInput
        placeholder="Search courses or users..."
        value={query}
        onValueChange={setQuery}
      />

      <CommandList>
        {loading && <CommandEmpty>Searching...</CommandEmpty>}

        {!loading &&
          !userResults.length &&
          !courseResults.length &&
          debouncedQuery && <CommandEmpty>No results found.</CommandEmpty>}

        {!loading && courseResults.length > 0 && (
          <CommandGroup heading="Courses">
            {courseResults.map((course) => (
              <CommandItem
                key={`course-${course.ID}`}
                value={`course-${course.title}-${course.ID}`}
                onSelect={() => handleSelect(`/courses/${course.ID}`)}
                className="cursor-pointer"
              >
                <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="mr-2">{course.title}</span>
                <span className="text-xs text-muted-foreground">
                  ({course.language})
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {!loading && userResults.length > 0 && (
          <CommandGroup heading="Users">
            {userResults.map((user) => (
              <CommandItem
                key={`user-${user.ID}`}
                value={`user-${user.username}-${user.ID}`}
                onSelect={() => handleSelect(`/profile/${user.ID}`)}
                className="cursor-pointer flex items-center gap-2"
              >
                <Avatar className="h-5 w-5">
                  <AvatarImage src={user.avatarURL} alt={user.username} />
                  <AvatarFallback className="text-xs">
                    {user.username?.substring(0, 1).toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <span>{user.username}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default SearchCommandBody;

// Ścieżka: components/SearchCommandBody.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem, // Import CommandItem
  CommandList,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useDebounce } from "@uidotdev/usehooks";
import { searchCommandItems } from "@/lib/api/search";
import { UserSearchResult, CourseSearchResult } from "@/lib/types/search";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // For user avatars
import { BookOpen } from "lucide-react";

const SearchCommandBody = () => {
  const { showModal, isOpen, hideModal } = useModal();
  const router = useRouter(); // Initialize router

  const [query, setQuery] = useState("");
  const [userResults, setUserResults] = useState<UserSearchResult[]>([]);
  const [courseResults, setCourseResults] = useState<CourseSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 300); // Debounce input by 300ms

  // Effect to fetch search results when debounced query changes
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
        // Handle API error case if needed (e.g., show a toast)
        setUserResults([]);
        setCourseResults([]);
      }
      setLoading(false);
    };

    fetchData();
  }, [debouncedQuery]);

  // Handler for opening/closing the dialog
  const handleOpenChange = (state: boolean) => {
    if (state) {
      showModal("SearchBox", {}); // Assuming "SearchBox" is the identifier for this modal
    } else {
      hideModal();
      // Reset state when closing
      setQuery("");
      setUserResults([]);
      setCourseResults([]);
      setLoading(false);
    }
  };

  // Handler for selecting an item (navigation)
  const handleSelect = (url: string) => {
    router.push(url);
    handleOpenChange(false); // Close the dialog after navigation
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTitle asChild>
        <VisuallyHidden>Search courses and users</VisuallyHidden>
      </DialogTitle>

      <CommandInput
        placeholder="Search courses or users..."
        value={query}
        onValueChange={setQuery} // Update query state on input change
      />

      <CommandList>
        {/* Loading state */}
        {loading && <CommandEmpty>Searching...</CommandEmpty>}

        {/* Empty state (only show if not loading and query exists) */}
        {!loading &&
          !userResults.length &&
          !courseResults.length &&
          debouncedQuery && <CommandEmpty>No results found.</CommandEmpty>}

        {/* Courses Group */}
        {!loading && courseResults.length > 0 && (
          <CommandGroup heading="Courses">
            {courseResults.map((course) => (
              <CommandItem
                key={`course-${course.ID}`}
                value={`course-${course.title}-${course.ID}`} // Unique value for filtering/selection
                onSelect={() => handleSelect(`/courses/${course.ID}`)} // Navigate on select
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

        {/* Users Group */}
        {!loading && userResults.length > 0 && (
          <CommandGroup heading="Users">
            {userResults.map((user) => (
              <CommandItem
                key={`user-${user.ID}`}
                value={`user-${user.username}-${user.ID}`} // Unique value
                onSelect={() => handleSelect(`/profile/${user.ID}`)} // Navigate on select
                className="cursor-pointer flex items-center gap-2" // Added flex for layout
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

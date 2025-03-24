"use client";

import * as React from "react";

import { useModal } from "@/hooks/use-modal";
import useSettings from "@/hooks/use-settings";

export function SearchCommand() {
  const { showModal } = useModal();
  const { settings, isPending } = useSettings();

  return (
    <>
      <div
        className="w-full select-none max-w-sm cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
        onClick={() => showModal("SearchBox", {})}
      >
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Press to search</span>
          {!isPending && (
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>
              {settings.shortcuts.openSearchBox}
            </kbd>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchCommand;

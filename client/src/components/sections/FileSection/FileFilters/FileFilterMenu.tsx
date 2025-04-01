import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import useFileFilters from "@/hooks/use-file-filters";
import {
  ModifiedAtTimeStamp,
  VisibleFilesCategory,
  VisibleExtensionCategory,
} from "@/store/filterSlice";

const FileFilterMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    modifiedAtTimeStamp,
    visibleFilesCategory,
    visibleExtension,
    setModifiedAtTimeStamp,
    setVisibleFilesCategory,
    setVisibleExtension,
  } = useFileFilters();

  return (
    <div className="w-full max-w-md relative my-2">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2  text-sm font-semibold rounded-lg shadow-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all "
      >
        {isOpen ? "Hide Filters" : "Show Filters"}
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -10 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute w-full z-10"
          >
            <Card className="p-4 bg-background border border-border shadow-xl rounded-xl mt-1">
              <CardContent className="space-y-4">
                <Select
                  onValueChange={setModifiedAtTimeStamp}
                  value={modifiedAtTimeStamp}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Modified Time" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    {Object.values(ModifiedAtTimeStamp).map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={setVisibleFilesCategory}
                  value={visibleFilesCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="File Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    {Object.values(VisibleFilesCategory).map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={setVisibleExtension}
                  value={visibleExtension}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="File Extension" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    {Object.values(VisibleExtensionCategory).map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileFilterMenu;

// Ścieżka pliku: components/quiz/LevelUpModal.tsx

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUp, PartyPopper } from "lucide-react";

type LevelUpModalProps = {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
};

export function LevelUpModal({ isOpen, onClose, newLevel }: LevelUpModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <PartyPopper className="w-8 h-8 text-yellow-500" />
            Gratulacje!
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-6">
          <ArrowUp className="w-16 h-16 text-green-500 animate-bounce" />
          <p className="text-lg text-muted-foreground mt-4">
            Osiągnięto nowy poziom!
          </p>
          <h2 className="text-6xl font-bold text-primary my-2">
            Poziom {newLevel}
          </h2>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            Super!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

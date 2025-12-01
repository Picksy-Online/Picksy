"use client";

import React from "react";
import FiltersContent from "./FiltersContent";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function MobileFiltersModal({ isOpen, onClose, onApply, onReset }: { isOpen: boolean, onClose: () => void, onApply: () => void, onReset: () => void }) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left">
            <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="py-4">
                 <FiltersContent />
            </div>
            <SheetFooter>
                <Button variant="ghost" onClick={onReset}>Reset</Button>
                <Button onClick={onApply}>Apply</Button>
            </SheetFooter>
        </SheetContent>
    </Sheet>
  );
}

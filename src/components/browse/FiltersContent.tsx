
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";

// Mock data, replace with your actual data
const categories = ["Handmade", "Vintage", "Home & Living", "Fashion", "Collector Cards"];
const sellers = ["Elena's Emporium", "Modern Designs", "Vintage Finds"];

/**
 * Reusable component containing the actual filter controls.
 */
export default function FiltersContent({ inline = false }: { inline?: boolean }) {
  if (inline) {
    return (
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Category <ChevronDown className="ml-2 h-4 w-4" /></Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="grid gap-4">
              <h4 className="font-medium leading-none">Category</h4>
              <div className="space-y-2">
                {categories.map(cat => (
                  <div key={cat} className="flex items-center space-x-2">
                    <Checkbox id={`cat-inline-${cat}`} />
                    <Label htmlFor={`cat-inline-${cat}`}>{cat}</Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Price <ChevronDown className="ml-2 h-4 w-4" /></Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
             <div className="grid gap-4">
                <h4 className="font-medium leading-none">Price Range</h4>
                <div className="flex gap-2">
                    <Input type="number" placeholder="Min" />
                    <Input type="number" placeholder="Max" />
                </div>
             </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Seller <ChevronDown className="ml-2 h-4 w-4" /></Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="grid gap-4">
              <h4 className="font-medium leading-none">Seller</h4>
              <div className="space-y-2">
                {sellers.map(seller => (
                  <div key={seller} className="flex items-center space-x-2">
                    <Checkbox id={`seller-inline-${seller}`} />
                    <Label htmlFor={`seller-inline-${seller}`}>{seller}</Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  // Original stacked layout for modal
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium leading-none mb-2">Category</h4>
        <div className="space-y-2">
          {categories.map(cat => (
            <div key={cat} className="flex items-center space-x-2">
              <Checkbox id={`cat-modal-${cat}`} />
              <Label htmlFor={`cat-modal-${cat}`}>{cat}</Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-medium leading-none mb-2">Price</h4>
        <div className="flex gap-2">
          <Input type="number" placeholder="Min" />
          <Input type="number" placeholder="Max" />
        </div>
      </div>
       <div>
        <h4 className="font-medium leading-none mb-2">Seller</h4>
        <div className="space-y-2">
          {sellers.map(seller => (
            <div key={seller} className="flex items-center space-x-2">
              <Checkbox id={`seller-modal-${seller}`} />
              <Label htmlFor={`seller-modal-${seller}`}>{seller}</Label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 pt-4">
        <Button>Apply</Button>
        <Button variant="ghost">Reset</Button>
      </div>
    </div>
  );
}

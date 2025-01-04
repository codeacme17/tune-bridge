"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NeteaseIcon } from "./icon/netease";

export const BrandCard = () => {
  const handleClick = () => {
    console.log("click");
  };

  return (
    <section>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={handleClick} className="mt-10">
            <NeteaseIcon className="fill-black dark:fill-white" />
            Netease
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <NeteaseIcon
                fill="white"
                className="fill-black dark:fill-white"
              />
              Login Netease
            </DialogTitle>
            <DialogDescription>
              Enter your credentials to login to Netease
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input id="phone" className="col-span-3" type="text" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input id="password" className="col-span-3" type="password" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

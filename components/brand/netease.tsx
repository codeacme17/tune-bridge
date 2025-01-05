"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NeteaseIcon } from "../icon/netease";
import { NeteaseDialog } from "@/components/dialog/netease";

export const Netease = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <section>
      <Button
        variant="outline"
        className="mt-10"
        onClick={() => setIsDialogOpen(true)}>
        <NeteaseIcon className="fill-black dark:fill-white" />
        Netease
      </Button>

      <NeteaseDialog
        isOpen={isDialogOpen}
        onOpenChange={(value) => setIsDialogOpen(value)}
      />
    </section>
  );
};

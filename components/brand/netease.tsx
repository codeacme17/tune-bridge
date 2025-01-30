"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { NeteaseIcon } from "../icon/netease";
import { NeteaseDialog } from "@/components/dialog/netease";
import { useAccountStore } from "@/store";
import { apis } from "@/apis";
import Image from "next/image";

export const Netease = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { neteaseAccount, setNeteaseAccount } = useAccountStore();

  const getUserAccount = useCallback(async () => {
    try {
      const cookie = localStorage.getItem("netease-cookie");
      if (!cookie) return;

      const res = await apis.netease.getUserAccount(cookie);
      const { profile } = res || {};
      setNeteaseAccount(profile);
    } catch (error) {
      console.error("getUserAccount error:", error);
    }
  }, []);

  useEffect(() => {
    getUserAccount();
  }, [getUserAccount]);

  return (
    <section>
      <Button
        variant="outline"
        className="mt-10"
        onClick={() => setIsDialogOpen(true)}
      >
        <NeteaseIcon className="fill-black dark:fill-white" />
        Netease
      </Button>

      {neteaseAccount.avatarUrl && (
        <Image
          src={neteaseAccount.avatarUrl}
          width={50}
          height={50}
          alt="netease avatar"
        />
      )}

      <NeteaseDialog
        isOpen={isDialogOpen}
        onOpenChange={(value) => setIsDialogOpen(value)}
      />
    </section>
  );
};

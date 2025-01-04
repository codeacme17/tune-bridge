"use client";

import { useState } from "react";

import Image from "next/image";
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
import { NeteaseIcon } from "../icon/netease";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Netease = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const res = await fetch(
      `/api/netease/login?phone=${phone}&password=${password}`,
      {
        method: "GET",
      }
    );
    console.log("res", res);
  };

  return (
    <section>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-10">
            <NeteaseIcon className="fill-black dark:fill-white" />
            Netease
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[525px] w-fit">
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

          <Tabs defaultValue="qrCode" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="qrCode">Scan</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>

            <TabsContent value="qrCode">
              <div className="flex justify-center gap-2">
                <div>
                  <Image
                    src="https://p6.music.126.net/obj/wonDlsKUwrLClGjCm8Kx/34905050930/6160/8991/0f0f/85d4094a013dc7c0709fd198152ee9f7.png"
                    width={150}
                    height={200}
                    alt="Picture of the author"
                  />
                </div>
                <div className="flex items-center">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                    width={220}
                    height={100}
                    alt="Picture of the author"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="password">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    className="col-span-3"
                    type="text"
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    className="col-span-3"
                    type="password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" onClick={handleSubmit}>
                  Save changes
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </section>
  );
};

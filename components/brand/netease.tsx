"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NeteaseIcon } from "../icon/netease";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Netease = () => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [qrImg, setQrImg] = useState("");

  useEffect(() => {
    if (!isOpenDialog) return;
    getQRCode();
  }, [isOpenDialog]);

  const getQRCode = async () => {
    const keyRes = await fetch(`/api/netease/login/qr/key`, {
      method: "GET",
    });
    const { data: keyData } = await keyRes.json();
    const { unikey: key } = keyData || {};

    const createRes = await fetch(`/api/netease/login/qr/create?key=${key}`, {
      method: "GET",
    });
    const { data: createData } = await createRes.json();
    const { qrimg } = createData || {};

    setQrImg(qrimg);
  };

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
      <Button
        variant="outline"
        className="mt-10"
        onClick={() => {
          setIsOpenDialog(true);
        }}>
        <NeteaseIcon className="fill-black dark:fill-white" />
        Netease
      </Button>

      <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
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

            <TabsContent value="qrCode" className="mt-2">
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
                    src={qrImg}
                    width={200}
                    height={200}
                    alt="Picture of the author"
                  />
                  {/* <QRCode value={qrCodeUrl} /> */}
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

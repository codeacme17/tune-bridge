"use client";

import { useEffect, useRef, useState } from "react";

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

type TabType = "qrCode" | "password";

export const Netease = () => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [qrImg, setQrImg] = useState("");
  const [currentTab, setCurrentTab] = useState<TabType>("qrCode");

  // store the key for qr code
  const unikey = useRef(null);

  useEffect(() => {
    if (!isOpenDialog || currentTab !== "qrCode") return;
    getQRCode();
  }, [isOpenDialog, currentTab]);

  useEffect(() => {
    if (!unikey.current) return;

    const timer = setInterval(() => {
      if ((!isOpenDialog || currentTab !== "qrCode") && timer) {
        clearInterval(timer);
        return;
      }
      queryQrStatus();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isOpenDialog, currentTab]);

  const getQRCode = async () => {
    try {
      const keyRes = await fetch(`/api/netease/login/qr/key`, {
        method: "GET",
      });
      const { data: keyData } = await keyRes.json();
      const { unikey: key } = keyData || {};
      unikey.current = key;

      const createRes = await fetch(`/api/netease/login/qr/create?key=${key}`, {
        method: "GET",
      });
      const { data: createData } = await createRes.json();
      const { qrimg } = createData || {};

      setQrImg(qrimg);
    } catch (error) {
      console.log("error", error);
    }
  };

  const queryQrStatus = async () => {
    if (!unikey.current) return;
    const res = await fetch(
      `/api/netease/login/qr/check?key=${unikey.current}`,
      {
        method: "GET",
      }
    );
    const { data } = await res.json();

    console.log("data", data);
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

          <Tabs
            defaultValue="qrCode"
            className="w-[400px]"
            value={currentTab}
            onValueChange={(value) => {
              setCurrentTab(value as TabType);
            }}>
            <TabsList>
              <TabsTrigger value="qrCode">Scan</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>

            {/*  QR CODE */}
            <TabsContent value="qrCode" className="mt-5">
              <div className="flex justify-between mx-3">
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
                    className="rounded-md"
                  />
                </div>
              </div>
            </TabsContent>

            {/* PASSWORD */}
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
                  Login
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </section>
  );
};

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
import { Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apis } from "@/apis";

type TabType = "qrCode" | "password";

enum QRStatus {
  EXPIRED = 800,
  PENDING = 801,
  SCANED = 802,
  CONFIRMED = 803,
}

export const Netease = () => {
  const { toast } = useToast();

  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [qrImg, setQrImg] = useState("");
  const [currentTab, setCurrentTab] = useState<TabType>("qrCode");
  const [getQRCodeLoading, setGetQRCodeLoading] = useState(false);
  const [qrStatus, setQrStatus] = useState<QRStatus>(QRStatus.PENDING);
  const [isLogin, setIsLogin] = useState(false);

  // store the key for qr code
  const unikey = useRef<string>(null);

  useEffect(() => {
    getUserAccount();

    if (!isOpenDialog) return;
    const hasLogin = localStorage.getItem("netease");
    if (hasLogin) setIsLogin(true);
  }, [isOpenDialog]);

  useEffect(() => {
    if (!isOpenDialog || currentTab !== "qrCode") return;
    getQRCode();
  }, [isOpenDialog, currentTab]);

  useEffect(() => {
    if (!unikey.current || !qrImg) return;

    const timer = setInterval(() => {
      if (
        (!isOpenDialog ||
          currentTab !== "qrCode" ||
          qrStatus === QRStatus.EXPIRED) &&
        timer
      ) {
        clearInterval(timer);
        return;
      }
      queryQrStatus();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isOpenDialog, currentTab, qrImg, qrStatus]);

  const getQRCode = async () => {
    try {
      setGetQRCodeLoading(true);
      const keyRes = await apis.netease.createQRCode();
      const { unikey: key, qrimg } = keyRes as unknown as {
        unikey: string;
        qrimg: string;
      };
      unikey.current = key;

      setQrImg(qrimg);
      setGetQRCodeLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  const queryQrStatus = async () => {
    if (!unikey.current) return;

    const res = await apis.netease.queryQrStatus(unikey.current);
    const { code, cookie } = res as unknown as {
      code: QRStatus;
      cookie: string;
    };

    setQrStatus(code);

    if (code === QRStatus.CONFIRMED) {
      setIsOpenDialog(false);
      localStorage.setItem("netease", "true");
      localStorage.setItem("netease-cookie", cookie);
      toast({
        title: "Netease Login success",
        description: "You have successfully logged in to Netease",
      });
    }
  };

  const getUserAccount = async () => {
    const cookie = localStorage.getItem("netease-cookie");
    if (!cookie) return;

    const res = await apis.netease.getUserAccount(cookie);
    console.log("res", res);
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

  const hanldeDialogChange = (value: boolean) => {
    if (value) {
      setIsOpenDialog(value);
    } else {
      setIsOpenDialog(value);
      setQrImg("");
      setQrStatus(QRStatus.PENDING);
    }
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

      <Dialog open={isOpenDialog} onOpenChange={hanldeDialogChange}>
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

          {isLogin ? (
            <div> 👋 You are already logged in !!! </div>
          ) : (
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

                  <div className="flex items-center w-[200px] h-[200px] relative rounded-lg overflow-hidden">
                    {getQRCodeLoading ? (
                      <div className="w-full h-full flex items-center justify-center gap-4">
                        <Loader className="animate-spin" />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {qrImg && (
                          <Image
                            src={qrImg}
                            width={200}
                            height={200}
                            alt="Picture of the author"
                            className="rounded-md"
                          />
                        )}

                        {(qrStatus === QRStatus.EXPIRED ||
                          qrStatus === QRStatus.SCANED) && (
                          <div className="w-full h-full flex items-center justify-center gap-4 absolute bg-gray-300/80">
                            {qrStatus === QRStatus.EXPIRED ? (
                              <Button
                                variant="outline"
                                className=""
                                onClick={() => {
                                  getQRCode();
                                }}>
                                Refresh
                              </Button>
                            ) : (
                              <p className="text-gray-950">SCANED</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
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
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

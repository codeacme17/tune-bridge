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
import { NeteaseIcon } from "@/components/icon/netease";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apis } from "@/apis";

type NeteaseDialogProps = {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
};

type TabType = "qrCode" | "password";

enum QRStatus {
  EXPIRED = 800,
  PENDING = 801,
  SCANED = 802,
  CONFIRMED = 803,
}

export function NeteaseDialog({ isOpen, onOpenChange }: NeteaseDialogProps) {
  const { toast } = useToast();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [qrImg, setQrImg] = useState("");
  const [currentTab, setCurrentTab] = useState<TabType>("qrCode");
  const [getQRCodeLoading, setGetQRCodeLoading] = useState(false);
  const [qrStatus, setQrStatus] = useState<QRStatus>(QRStatus.PENDING);
  const [isLogin, setIsLogin] = useState(false);

  const unikey = useRef<string>("");

  useEffect(() => {
    if (!isOpen) return;

    const hasLogin = localStorage.getItem("netease");
    if (hasLogin) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || currentTab !== "qrCode") return;
    fetchQRCode();
  }, [isOpen, currentTab]);

  useEffect(() => {
    if (!qrImg || !unikey.current) return;

    const timer = setInterval(() => {
      if (!isOpen || currentTab !== "qrCode" || qrStatus === QRStatus.EXPIRED) {
        clearInterval(timer);
        return;
      }
      queryQrStatus();
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, currentTab, qrImg, qrStatus]);

  async function fetchQRCode() {
    try {
      setGetQRCodeLoading(true);
      const keyRes = await apis.netease.createQRCode();
      const { unikey: key, qrimg } = keyRes as {
        unikey: string;
        qrimg: string;
      };

      unikey.current = key;
      setQrImg(qrimg);
      setQrStatus(QRStatus.PENDING);
    } catch (error) {
      console.error("fetchQRCode error:", error);
    } finally {
      setGetQRCodeLoading(false);
    }
  }

  async function queryQrStatus() {
    try {
      const res = await apis.netease.queryQrStatus(unikey.current);
      const { code, cookie } = res as { code: QRStatus; cookie: string };

      setQrStatus(code);

      if (code === QRStatus.CONFIRMED) {
        onOpenChange(false);
        localStorage.setItem("netease", "true");
        localStorage.setItem("netease-cookie", cookie);
        toast({
          title: "Netease Login success",
          description: "You have successfully logged in to Netease",
        });
      }
    } catch (error) {
      console.error("queryQrStatus error:", error);
    }
  }

  async function handleSubmitPassword() {
    console.log("res", phone, password);
    // TODO: implement real logic
  }

  function handleDialogChange(value: boolean) {
    onOpenChange(value);
    if (!value) {
      // reset states
      setQrImg("");
      setQrStatus(QRStatus.PENDING);
      setCurrentTab("qrCode");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[525px] w-fit">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <NeteaseIcon fill="white" className="fill-black dark:fill-white" />
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
            onValueChange={(value) => setCurrentTab(value as TabType)}
          >
            <TabsList>
              <TabsTrigger value="qrCode">Scan</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>

            {/* QR CODE TAB */}
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
                        <div className="w-full h-full flex items-center justify-center gap-4 absolute bg-gray-300/80 top-0 left-0">
                          {qrStatus === QRStatus.EXPIRED ? (
                            <Button variant="outline" onClick={fetchQRCode}>
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

            {/* PASSWORD TAB */}
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
                    onChange={(e) => setPhone(e.target.value)}
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
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" onClick={handleSubmitPassword}>
                  Login
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}

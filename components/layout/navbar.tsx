"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Sun, SunMoon } from "lucide-react";

export const Navbar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="flex justify-between py-2 px-4 bg-gray-100 dark:bg-gray-900">
      <div className="items-center flex">
        <h1 className="text-xl font-light">Tune Bridge</h1>
      </div>

      <div>
        <Button
          type="button"
          variant={"ghost"}
          className="p-1"
          onClick={() => {
            setTheme(theme === "dark" ? "light" : "dark");
          }}>
          {theme === "dark" ? <SunMoon size={34} /> : <Sun size={34} />}
        </Button>
      </div>
    </nav>
  );
};

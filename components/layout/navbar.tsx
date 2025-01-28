"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Sun, SunMoon } from "lucide-react";
import { useHasMounted } from "@/hooks/use-has-mounted";

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { hasMounted } = useHasMounted();

  return (
    <nav className="flex justify-between py-2 px-4 fixed top-0 bg-white dark:bg-black w-screen z-10">
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
          {hasMounted && theme === "dark" ? (
            <SunMoon size={34} />
          ) : (
            <Sun size={34} />
          )}
        </Button>
      </div>
    </nav>
  );
};

"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export const Navbar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="">
      <Button
        onClick={() => {
          setTheme(theme === "dark" ? "light" : "dark");
        }}>
        Click me
      </Button>
    </nav>
  );
};

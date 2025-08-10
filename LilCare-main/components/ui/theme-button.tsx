"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeButton() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <Button
        className="rounded-full mr-2"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        variant="secondary"
        size="sm"
      >
       
        {theme === "light" ? (
          <Moon  />
        ) : (
          <Sun  />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </>
  );
}

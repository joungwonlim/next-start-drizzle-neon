"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function Home() {
  return (
    <div>
      <h1>Hello World</h1>
      <Button
        onClick={() =>
          toast({
            title: "Hello World",
            description: "This is a toast message",
            className: "bg-green-500 text-white",
          })
        }
      >
        Click me
      </Button>
    </div>
  );
}

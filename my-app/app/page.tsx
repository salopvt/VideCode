import Image from "next/image";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
  return (
     <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Button>
        Get Started
      </Button>
     </div>
  );
}

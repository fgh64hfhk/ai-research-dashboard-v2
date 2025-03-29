import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ButtonTest() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <Button>Default Button</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="outline" size="icon">
        <ChevronRight />
      </Button>
      <Button disabled>
        <Loader2 className="animate-spin" />
        Please wait
      </Button>
      <Button asChild>
        <Link href="/login">Login</Link>
      </Button>
    </div>
  );
}

"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";

interface ModelIntroCardProps {
  imageSrc?: string;
  title: string;
  descriptionList: string[];
}

export function IntroCard({
  imageSrc = "/model-guide.gif",
  title,
  descriptionList,
}: ModelIntroCardProps) {
  return (
    <Card className="flex flex-col md:flex-row items-center gap-6 p-6">
      <Image
        src={imageSrc}
        alt="guide"
        width={200}
        height={200}
        className="rounded-md"
        priority
        unoptimized
      />
      <div className="space-y-2 text-sm text-muted-foreground">
        <p className="text-base font-medium text-foreground">{title}</p>
        <ul className="list-disc ml-5 space-y-1">
          {descriptionList.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

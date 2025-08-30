"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface GameCardProps {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
}

export default function GameCard({ title, description, href, icon }: GameCardProps) {
  return (
    <Link href={href}>
      <Card className="h-full cursor-pointer rounded-2xl shadow-md transition hover:scale-105 hover:shadow-xl">
        <CardContent className="flex flex-col items-center justify-center gap-2 p-6 text-center">
          <div className="text-4xl">{icon}</div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

import React from "react";
import { Card, CardContent } from "./ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Separator } from "./ui/separator";

const ListItem = ({ item }: { item: { title: string; href: string } }) => {
  return (
    <Link href={item.href} className="w-100 hover:bg-secondary/85 py-4 px-8">
      <div className="flex justify-between items-center">
        <div>{item.title}</div>
        <div>
          <ArrowRight className="w-4 h-4"/>
        </div>
      </div>
      <Separator className="my-2"/>
    </Link>
  );
};

export default ListItem;

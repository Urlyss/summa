import Link from "next/link";
import React from "react";
import ListItem from "./ListItem";

const TreatiseList = ({
  treatises,
  part,
}: {
  part: { id: string; title: string };
  treatises: { id: number; title: string }[];
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl text-center">{part.title}</h1>
      <h2 className="text-xl text-center">Treatises list</h2>
      {treatises.map((p,ind) => (
        <ListItem key={ind} item={{title:p.title,href:`/explore/Pt${part.id}-Tr${p.id}`}}/>
      ))}
    </div>
  );
};

export default TreatiseList;

import Link from "next/link";
import React from "react";
import ListItem from "./ListItem";

const QuestionList = ({
  questions,
  part,
  treatise,
}: {
  part: { id: string; title: string };
  treatise: { id: number; title: string };
  questions: { id: number; title: string }[];
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl text-center">{treatise.title}</h1>
      <h2 className="text-xl text-center">Questions list</h2>
      {questions.map((p, ind) => (
        <ListItem
          key={ind}
          item={{
            title: p.title,
            href: `/explore/Pt${part.id}-Tr${treatise.id}-Qu${p.id}`,
          }}
        />
      ))}
    </div>
  );
};

export default QuestionList;

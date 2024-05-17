import Link from 'next/link';
import React from 'react'
import ListItem from './ListItem';

const ArticleList = ({
  articles,
  part,
  treatise,
  question
}: {
  part: { id: string; title: string };
  treatise: { id: number; title: string };
  articles: { id: number; title: string }[];
  question: { id: number; title: string;description:string[] };
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl text-center">{question.title}</h1>
      <h2 className="text-2xl text-justify">{question.description}</h2>
      <h3 className="text-xl text-center">Articles list</h3>
      {articles.map((p,ind) => (
        <ListItem key={ind} item={{title:p.title,href:`/explore/Pt${part.id}-Tr${treatise.id}-Qu${question.id}-Ar${p.id}`}}/>
      ))}
    </div>
  );
};

export default ArticleList
import Link from "next/link";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { buttonVariants } from "./ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const ArticleDetail = ({
  article,
  part,
  treatise,
  question,
  previousArticle,
  nextArticle,
}: {
  part: { id: string; title: string };
  treatise: { id: number; title: string };
  article: {
    id: number;
    title: string;
    objections: {
      id: number;
      text: string[];
    }[];
    counter: string[];
    replies: {
      id: number;
      text: string[];
    }[];
    body: string[];
  };
  previousArticle: { id: number; title: string } | null;
  nextArticle: { id: number; title: string } | null;
  question: { id: number; title: string; description: string[] };
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-3xl text-center">{article.title}</h1>
      <Tabs defaultValue="objections" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value={"objections"}>Objections</TabsTrigger>
          <TabsTrigger value={"answer"}>Answer</TabsTrigger>
          <TabsTrigger value={"replies"}>Replies</TabsTrigger>
        </TabsList>
        <TabsContent value="objections">
          <Card>
            <CardHeader>
              <CardTitle>Objections</CardTitle>
            </CardHeader>
            <CardContent>
              {article.objections &&
                article.objections.map((ob, ind) => (
                  <div key={ind} className="flex flex-col">
                    <div><span>❌</span> Objection {ind + 1} : {ob.text}</div>
                    {ind < article.objections.length-1 && <Separator className="my-4" />}
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="answer">
          <Card>
            <CardHeader>
              <CardTitle>Answer</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <span>🎓</span> {article.counter && article.counter}
              </div>
              <Separator className="my-4" />
              <div>
                <span>💬</span> {article.body && article.body}{" "}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="replies">
          <Card>
            <CardHeader>
              <CardTitle>Replies</CardTitle>
            </CardHeader>
            <CardContent>
              {article.replies &&
                article.replies.map((rep, ind) => (
                  <div key={ind} className="flex flex-col">
                    <div>
                      {article.objections[ind] && (
                        <span>
                          <span>✔️</span> Reply to Objection {ind + 1} :{" "}
                        </span>
                      )}
                      {rep.text}
                      {ind < article.replies.length-1 && <Separator className="my-4" />}
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="flex flex-col md:flex-row justify-between w-full mt-10">
        <div className="flex-wrap">
          {previousArticle != null && (
            <Link
              className={buttonVariants({ variant: "default",className:"w-60" })}
              href={`/explore/Pt${part.id}-Tr${treatise.id}-Qu${question.id}-Ar${previousArticle.id}`}
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              <span className="w-60 truncate">{previousArticle.title}</span>
            </Link>
          )}
        </div>
        <div className="flex-wrap mt-4 md:mt-0">
          {nextArticle != null && (
            <Link
              className={buttonVariants({ variant: "default",className:"w-60" })}
              href={`/explore/Pt${part.id}-Tr${treatise.id}-Qu${question.id}-Ar${nextArticle.id}`}
            >
              <span className="w-60 truncate">{nextArticle.title}</span>
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;

import React from "react";
import PartList from "./PartList";
import { notFound } from "next/navigation";

const ExplorePage = ({ parts }: { parts: { id: string; title: string }[] | null }) => {

  if(parts != null){
    return <PartList parts={parts}/>
  }else{
    return notFound()
  }
};

export default ExplorePage;

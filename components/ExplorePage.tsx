'use client'
import React, { useEffect } from "react";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import PartList from "./PartList";

const ExplorePage = ({ parts }: { parts: { id: string; title: string }[] | null }) => {
  const { toast } = useToast();
  useEffect(() => {
    if(parts == null){
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction onClick={()=>window.location.reload()} altText="Try again">Try again</ToastAction>,
      })
      return;
    }
  }, [parts])

  const content = parts == null ? <div>Error on this element</div> : <PartList parts={parts}/>
  
  return (
    <div>{content}</div>
  );
};

export default ExplorePage;

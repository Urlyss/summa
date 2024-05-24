import ArticleList from "@/components/ArticleList";
import QuestionList from "@/components/QuestionList";
import TreatiseList from "@/components/TreatiseList";
import {
  getArticlesByPartTreatiseQuestionId,
  getDetailedArticleByPartTreatiseQuestionArticleId,
  getQuestionsByPartAndTreatiseId,
  getTreatisesByPartId,
  parseQueryString,
} from "@/lib/utils";
import React from "react";
import ArticleDetail from "@/components/ArticleDetail";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import { notFound } from "next/navigation";

const page = ({ params }: { params: { id: string } }) => {
  const ids = parseQueryString(params.id);
  let content = null;
  switch (ids?.length) {
    case 1: {
      const idPart = ids[0] as string;
      const treatiseList = getTreatisesByPartId(idPart);
      if (treatiseList != null) {
        content = (
          <TreatiseList
            treatises={treatiseList.treatises}
            part={{ id: treatiseList.partId, title: treatiseList.partTitle }}
          />
        );
      }
      break;
    }
    case 2: {
      const idPart = ids[0] as string;
      const idTreatise = ids[1] as number;
      const questionList = getQuestionsByPartAndTreatiseId(idPart, idTreatise);
      if (questionList != null) {
        const breadCrumbLinks = [
          {
            href: `/explore/Pt${questionList.partId}`,
            title: questionList.partTitle,
          },
          {
            href: `/explore/Pt${questionList.partId}-Tr${questionList.treatiseId}`,
            title: questionList.treatiseTitle,
          },
        ];
        content = (
          <div className="flex flex-col">
            <CustomBreadCrumb links={breadCrumbLinks} />
            <QuestionList
              questions={questionList.questions}
              part={{ id: questionList.partId, title: questionList.partTitle }}
              treatise={{
                id: questionList.treatiseId,
                title: questionList.treatiseTitle,
              }}
            />
          </div>
        );
      }
      break;
    }
    case 3: {
      const idPart = ids[0] as string;
      const idTreatise = ids[1] as number;
      const idQuestion = ids[2] as number;

      const articleList = getArticlesByPartTreatiseQuestionId(
        idPart,
        idTreatise,
        idQuestion
      );
      if (articleList != null) {
        const breadCrumbLinks = [
          {
            href: `/explore/Pt${articleList.partId}`,
            title: articleList.partTitle,
          },
          {
            href: `/explore/Pt${articleList.partId}-Tr${articleList.treatiseId}`,
            title: articleList.treatiseTitle,
          },
          {
            href: `/explore/Pt${articleList.partId}-Tr${articleList.treatiseId}-Qu${articleList.questionId}`,
            title: articleList.questionTitle,
          },
        ];
        content = (
          <div className="flex flex-col">
            <CustomBreadCrumb links={breadCrumbLinks} />
            <ArticleList
              articles={articleList.articles}
              question={{
                id: articleList.questionId,
                title: articleList.questionTitle,
                description: articleList.questionDescription,
              }}
              part={{ id: articleList.partId, title: articleList.partTitle }}
              treatise={{
                id: articleList.treatiseId,
                title: articleList.treatiseTitle,
              }}
            />
          </div>
        );
      }
      break;
    }
    case 4: {
      const idPart = ids[0] as string;
      const idTreatise = ids[1] as number;
      const idQuestion = ids[2] as number;
      const idArticle = ids[3] as number;

      const articleDetail = getDetailedArticleByPartTreatiseQuestionArticleId(
        idPart,
        idTreatise,
        idQuestion,
        idArticle
      );
      if (articleDetail != null) {
        const breadCrumbLinks = [
          {
            href: `/explore/Pt${articleDetail.partId}`,
            title: articleDetail.partTitle,
          },
          {
            href: `/explore/Pt${articleDetail.partId}-Tr${articleDetail.treatiseId}`,
            title: articleDetail.treatiseTitle,
          },
          {
            href: `/explore/Pt${articleDetail.partId}-Tr${articleDetail.treatiseId}-Qu${articleDetail.questionId}`,
            title: articleDetail.questionTitle,
          },
          {
            href: `/explore/Pt${articleDetail.partId}-Tr${articleDetail.treatiseId}-Qu${articleDetail.questionId}-Ar${articleDetail.article.id}`,
            title: articleDetail.article.title[0],
          },
        ];
        content = (
          <div className="flex flex-col">
            <CustomBreadCrumb links={breadCrumbLinks} />
            <ArticleDetail
              nextArticle={articleDetail.nextArticle}
              previousArticle={articleDetail.previousArticle}
              article={articleDetail.article}
              question={{
                id: articleDetail.questionId,
                title: articleDetail.questionTitle,
                description: articleDetail.questionDescription,
              }}
              part={{
                id: articleDetail.partId,
                title: articleDetail.partTitle,
              }}
              treatise={{
                id: articleDetail.treatiseId,
                title: articleDetail.treatiseTitle,
              }}
            />
          </div>
        );
      }
      break;
    }

    default:
      break;
  }
  if(content != null){
    return (<div className="mt-10 lg:px-36">{content}</div>)
  }else{
    return notFound()
  }
};

export default page;

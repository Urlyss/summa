import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { db } from "../db";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parses a query string to extract the IDs in the correct order.
 * The query string is in the form PtFS-Tr1-Qu2-Ar3, where each part is optional.
 * The order must be Pt before Tr before Qu before Ar.
 * @param queryString - The complete query string to parse.
 * @returns An array of IDs in the correct order, or null if there is an error.
 */
export function parseQueryString(queryString: string): (string | number)[] | null {
  try {
      // Define regex patterns for each part of the query string
      const patterns:{ [key: string]: RegExp } = {
          'part': /^Pt([a-zA-Z1-9]+)/,
          'treatise': /^Tr(\d+)/,
          'question': /^Qu(\d+)/,
          'article': /^Ar(\d+)/
      };

      // Initialize an array to hold the extracted IDs
      const ids: (string | number)[] = [];

      // Split the query string by "-"
      const segments = queryString.split('-');

      // Define the expected order of segments
      const expectedOrder = ['part', 'treatise', 'question', 'article'];

      // Keep track of the current index in the expected order
      let currentIndex = 0;

      // Iterate over each segment in the query string
      for (const segment of segments) {
          // Extract the current expected type
          const currentType = expectedOrder[currentIndex];
          const pattern = patterns[currentType];

          // Check if the segment matches the expected pattern
          const match = segment.match(pattern);
          if (match) {
              // Extract the ID from the match and add it to the ids array
              const id = currentType === 'part' ? match[1] : parseInt(match[1], 10);
              ids.push(id);

              // Move to the next expected type
              currentIndex++;
          } else {
              // If the segment doesn't match the expected pattern, return null
              return null;
          }
      }

      // Return the extracted IDs
      return ids;
  } catch (error) {
      console.error("Error:", error);
      return null;
  }
}

/**
 * Extracts the list of parts (sections or parts) from the Summa Theologica JSON data.
 *
 * @returns {Array<{ id: string; title: string }> | null} - An array of objects, where each object has an `id` and `title` property, or `null` if there's an error.
 */
export function getPartList(): Array<{ id: string; title: string }> | null {
  try {
    const partList: Array<{ id: string; title: string }> = [];

    for (const item of db) {
      if (typeof item.id !== "string" || typeof item.title !== "string") {
        return null; // Return null if any item has invalid id or title
      }
      partList.push({ id: item.id, title: item.title });
    }

    return partList;
  } catch (error) {
    console.error("Error in getPartList:", error);
    return null;
  }
}

// Function to get treatises of a part by part ID
/**
 * Returns an array of treatises for a given part ID. Each treatise is represented by an object containing its id and title.
 * @param partId - The ID of the part to retrieve treatises from.
 * @returns An object containing the part's id and title and an array of objects with the id and title of each treatise, or null if an error occurs.
 */
export function getTreatisesByPartId(
  partId: string
): {
  partId: string;
  partTitle: string;
  treatises: { id: number; title: string }[];
} | null {
  try {
    // Check if the input is an array and has the expected structure
    if (!Array.isArray(db)) {
      throw new Error("Invalid input: expected an array");
    }

    // Find the part with the given id
    const part = db.find((p) => p.id === partId);
    if (!part) {
      throw new Error("Part not found");
    }

    // Extract the treatises from the found part
    const treatises = part.treatises.map((treatise) => ({
      id: treatise.id,
      title: treatise.title || part.title,
    }));

    // Return an object containing the part's id, title, and treatises
    return {
      partId: part.id,
      partTitle: part.title,
      treatises,
    };
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}


// Function to get questions by part ID and treatise ID
/**
 * Returns an object containing the id and title of the part, the id and title of the treatise, and an array of questions for the given part ID and treatise ID.
 * Each question is represented by an object containing its id and title.
 * @param partId - The ID of the part to retrieve details from.
 * @param treatiseId - The ID of the treatise to retrieve details from.
 * @returns An object containing the part's id and title, the treatise's id and title, and an array of objects with the id and title of each question, or null if an error occurs.
 */
export function getQuestionsByPartAndTreatiseId(
  partId: string,
  treatiseId: number
): { partId: string; partTitle: string; treatiseId: number; treatiseTitle: string; questions: { id: number; title: string }[] } | null {
  try {
      
      // Find the part with the given id
      const part = db.find(p => p.id === partId);
      if (!part) {
          throw new Error("Part not found");
      }

      // Find the treatise with the given id within the found part
      const treatise = part.treatises.find(t => t.id === treatiseId);
      if (!treatise) {
          throw new Error("Treatise not found");
      }

      // Extract the questions from the found treatise
      const questions = treatise.questions.map(question => ({
          id: question.id,
          title: question.title
      }));

      // Return an object containing the part's id, title, the treatise's id, title, and questions
      return {
          partId: part.id,
          partTitle: part.title,
          treatiseId: treatise.id,
          treatiseTitle: treatise.title,
          questions
      };
  } catch (error) {
      console.error("Error:", error);
      return null;
  }
}


// Function to get articles by part ID, treatise ID, and question ID
/**
 * Returns an object containing the id and title of the part, the id and title of the treatise, 
 * the id, title, and description of the question, and an array of articles for the given part ID, treatise ID, and question ID.
 * Each article is represented by an object containing its id and title.
 * @param partId - The ID of the part to retrieve details from.
 * @param treatiseId - The ID of the treatise to retrieve details from.
 * @param questionId - The ID of the question to retrieve details from.
 * @returns An object containing the part's id and title, the treatise's id and title, the question's id, title, and description, 
 * and an array of objects with the id and title of each article, or null if an error occurs.
 */
export function getArticlesByPartTreatiseQuestionId(
  partId: string,
  treatiseId: number,
  questionId: number
): {
  partId: string;
  partTitle: string;
  treatiseId: number;
  treatiseTitle: string;
  questionId: number;
  questionTitle: string;
  questionDescription: string[];
  articles: { id: number; title: string }[];
} | null {
  try {

      // Find the part with the given id
      const part = db.find(p => p.id === partId);
      if (!part) {
          throw new Error("Part not found");
      }

      // Find the treatise with the given id within the found part
      const treatise = part.treatises.find(t => t.id === treatiseId);
      if (!treatise) {
          throw new Error("Treatise not found");
      }

      // Find the question with the given id within the found treatise
      const question = treatise.questions.find(q => q.id === questionId);
      if (!question) {
          throw new Error("Question not found");
      }

      // Extract the articles from the found question
      const articles = question.articles.map(article => ({
          id: article.id,
          title: article.title.join(' ') || question.title || treatise.title
      }));

      // Return an object containing the part's id, title, the treatise's id, title, the question's id, title, description, and articles
      return {
          partId: part.id,
          partTitle: part.title,
          treatiseId: treatise.id,
          treatiseTitle: treatise.title,
          questionId: question.id,
          questionTitle: question.title,
          questionDescription: question.description as string[],
          articles
      };
  } catch (error) {
      console.error("Error:", error);
      return null;
  }
}

// Function to get detailed information about an article by part ID, treatise ID, question ID, and article ID
/**
 * Returns detailed information about a specific article, including the id, title, objections, counter, replies, and body.
 * Also returns the id and title of the part, the id and title of the treatise, the id, title, and description of the question,
 * and the previous and next articles' ids and titles, or null if they don't exist.
 * @param partId - The ID of the part to retrieve details from.
 * @param treatiseId - The ID of the treatise to retrieve details from.
 * @param questionId - The ID of the question to retrieve details from.
 * @param articleId - The ID of the article to retrieve details from.
 * @returns An object containing the detailed information of the specified article and its context, or null if an error occurs.
 */
export function getDetailedArticleByPartTreatiseQuestionArticleId(
  partId: string,
  treatiseId: number,
  questionId: number,
  articleId: number
): {
  partId: string;
  partTitle: string;
  treatiseId: number;
  treatiseTitle: string;
  questionId: number;
  questionTitle: string;
  questionDescription: string[];
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
} | null {
  try {

      // Find the part with the given id
      const part = db.find(p => p.id === partId);
      if (!part) {
          throw new Error("Part not found");
      }

      // Find the treatise with the given id within the found part
      const treatise = part.treatises.find(t => t.id === treatiseId);
      if (!treatise) {
          throw new Error("Treatise not found");
      }

      // Find the question with the given id within the found treatise
      const question = treatise.questions.find(q => q.id === questionId);
      if (!question) {
          throw new Error("Question not found");
      }

      // Find the article with the given id within the found question
      const articleIndex = question.articles.findIndex(a => a.id === articleId);
      if (articleIndex === -1) {
          throw new Error("Article not found");
      }

      const article = question.articles[articleIndex];

      // Determine the previous and next articles
      const previousArticle = articleIndex > 0 ? {
          id: question.articles[articleIndex - 1].id,
          title: question.articles[articleIndex - 1].title.join(' ')
      } : null;

      const nextArticle = articleIndex < question.articles.length - 1 ? {
          id: question.articles[articleIndex + 1].id,
          title: question.articles[articleIndex + 1].title.join(' ')
      } : null;

      // Return the detailed article information and its context
      return {
          partId: part.id,
          partTitle: part.title,
          treatiseId: treatise.id,
          treatiseTitle: treatise.title,
          questionId: question.id,
          questionTitle: question.title,
          questionDescription: question.description as string[],
          article: {
              id: article.id,
              title: article.title.join(' ') || question.title || treatise.title,
              objections: article.objections,
              counter: article.counter,
              replies: article.replies,
              body: article.body
          },
          previousArticle,
          nextArticle
      };
  } catch (error) {
      console.error("Error:", error);
      return null;
  }
}
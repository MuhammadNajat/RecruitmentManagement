import ProblemCreate from '@/app/ui/problems/problemCreate';
import { getTags } from '@/app/lib/data/tags/queries/readTagAction';
import { getProblemCategories } from '@/app/lib/data/problem-categories/queries/readProblemCategoryAction';
import { ProblemCategory, Tag } from '@/app/lib/definitions';

export default async function Form() {
  /*
  const id = params.id;
  let temp: unknown = await getProblemCategoryByID(id);
  const categoryData = temp as ProblemCategory[];
  */

  const tags : unknown = await getTags();
  const tagData = tags as Tag[];

  const categories : unknown = await getProblemCategories();
  const categoryData = categories as ProblemCategory[];

  return (
    <ProblemCreate tags={tagData.getTags} categories={categoryData.getProblemCategories} />
  );
}
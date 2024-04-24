import { getProblemCategoryByID } from '@/app/lib/data/problem-categories/queries/readProblemCategoryAction'
import { ProblemCategory, User } from "@/app/lib/definitions";
import EditProblemCategoryForm from '@/app/ui/problem-categories/categoryUpdate';
import Breadcrumbs from "@/app/ui/breadcrumbs"

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  let temp: unknown = await getProblemCategoryByID(id);
  const categoryData = temp as ProblemCategory[];

  //@ts-ignore
  const category = categoryData.getProblemCategoryByID;
  console.log("~~~ ~~~ category is:", category);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Home', href: '/admin/' },
          {
            label: 'Edit Categories',
            href: `/admin/problem-categories/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditProblemCategoryForm category={category} />
    </main>
  );
}
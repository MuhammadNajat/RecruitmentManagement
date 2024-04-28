import { Problem, User } from "@/app/lib/definitions";
import EditUserForm from "@/app/ui/users/edit-user"
import Breadcrumbs from "@/app/ui/breadcrumbs"
import { getProblemByID } from "@/app/lib/data/problems/queries/readProblemAction";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  let temp: unknown = await getProblemByID(id);
  const problemData = temp as Problem;

  const problem = problemData.getProblemByID;
  console.log("~~~ ~~~ problem is:", problemData);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Problems', href: '/admin/problems' },
          {
            label: 'Edit Users',
            href: `/admin/problems/${id}/view`,
            active: true,
          },
        ]}
      />

      
    </main>
  );
}
import { getUserByID } from '@/app/lib/data/users/queries/readUserAction'
import { User, UserQueryResponse } from "@/app/lib/definitions";
import EditUserForm from "@/app/ui/users/edit-user"
import Breadcrumbs from "@/app/ui/breadcrumbs"

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  let temp: unknown = await getUserByID(id);
  console.log("temp : getUserByID : unknown type:", temp);
  const userData = temp as User[];

  console.log("~~~ ~~~ userData is:", userData);

  //@ts-ignore
  const user = userData.getUserByID;
  console.log("~~~ ~~~ userQueryResponse is:", user);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Problems', href: '/admin/users' },
          {
            label: 'Edit Users',
            href: `/admin/users/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditUserForm user={user} />
    </main>
  );
}
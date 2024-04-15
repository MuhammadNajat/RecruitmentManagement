import { readUser } from '@/app/lib/data/users/queries/readUserAction'
import { User } from "@/app/lib/definitions";
import EditUserForm from "@/app/ui/users/edit-user"
import Breadcrumbs from "@/app/ui/breadcrumbs"

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  let temp: unknown = await readUser(id);
  const userData = temp as User[];

  //@ts-ignore
  const user = userData.getUser;
  console.log("~~~ ~~~ user is:", user);

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
import { readUser } from '@/app/lib/graphQLServiceConsumer'
import { updateUser } from "@/app/lib/users/mutations/updateUserAction"
import { useFormState, useFormStatus } from 'react-dom';
import { User } from "@/app/lib/definitions";
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import dynamic from "next/dynamic";
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router';
import EditUserForm from "@/app/ui/users/edit-user"
import Breadcrumbs from "@/app/ui/users/breadcrumbs"

//import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';

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
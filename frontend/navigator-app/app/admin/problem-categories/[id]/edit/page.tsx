import { getProblemCategory, readUser } from '@/app/lib/graphQLServiceConsumer'
import { updateUser } from "@/app/lib/users/mutations/updateUserAction"
import { useFormState, useFormStatus } from 'react-dom';
import { ProblemCategory, User } from "@/app/lib/definitions";
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import dynamic from "next/dynamic";
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router';
import EditProblemCategoryForm from '@/app/ui/problem-categories/categoryUpdate';
import Breadcrumbs from "@/app/ui/users/breadcrumbs"

//import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  let temp: unknown = await getProblemCategory(id);
  const categoryData = temp as ProblemCategory[];

  //@ts-ignore
  const category = categoryData.getProblemCategory;
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
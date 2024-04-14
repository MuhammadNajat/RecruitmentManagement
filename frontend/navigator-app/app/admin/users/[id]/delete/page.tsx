"use client";

import { readUser } from '@/app/lib/graphQLServiceConsumer'
import { updateUser } from "@/app/lib/users/mutations/updateUserAction"
import { useFormState, useFormStatus } from 'react-dom';
import { User } from "@/app/lib/definitions";
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import dynamic from "next/dynamic";
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import EditUserForm from "@/app/ui/users/edit-user"
import Breadcrumbs from "@/app/ui/users/breadcrumbs"
import { deleteUser } from '@/app/lib/users/mutations/deleteUserAction';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

//import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  console.log("[In delete/page.tsx] ~~~ ~~~ user id is:", id);

  const cancelDelete = function() {
    //revalidatePath('/admin/users');

    let router = useRouter();

    router.push(`/admin/users/`);
    //redirect(`/posts/${data.get('id')}`)
  };

const trigerDelete =  async function() {
  await deleteUser(id);
  revalidatePath('/admin/users');

  redirect('/admin/users');
};

  return (
    <>
        <div id="popup"className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg mx-7 my-8">
            <p className="text-left mb-10">Delete the user with id: ${id}</p>
            <button className="mr-10 bg-red-200 text-gray-900 px-6 py-2 rounded-lg hover:bg-red-600 hover:text-white" onClick={trigerDelete}>Delete</button>
            <button className="ml-8 bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600" onClick={cancelDelete}>Close</button>
        </div>
        </div>
    </>
  );
}
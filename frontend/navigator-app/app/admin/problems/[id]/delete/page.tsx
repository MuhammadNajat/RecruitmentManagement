"use client";

import { useRouter } from 'next/navigation';
import { deleteUser } from '@/app/lib/data/users/mutations/deleteUserAction';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { deleteProblem } from '@/app/lib/data/problems/mutations/deleteProblemAction';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const cancelDelete = function() {
    //revalidatePath('/admin/users');

    let router = useRouter();

    router.push(`/admin/problems/`);
    //redirect(`/posts/${data.get('id')}`)
  };

const trigerDelete =  async function() {
  await deleteProblem(id);
  revalidatePath('/admin/problems');

  redirect('/admin/problems');
};

  return (
    <>
        <div id="popup"className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg mx-7 my-8">
            <p className="text-left mb-10">Delete the problem with id: ${id}</p>
            <button className="mr-10 bg-red-200 text-gray-900 px-6 py-2 rounded-lg hover:bg-red-600 hover:text-white" onClick={trigerDelete}>Delete</button>
            <button className="ml-8 bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600" onClick={cancelDelete}>Close</button>
        </div>
        </div>
    </>
  );
}
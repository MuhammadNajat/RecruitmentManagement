import { createCategory } from "@/app/lib/createProblemCategoryAction";
import { ProblemCategory } from "@/app/lib/definitions";
import { getProblemCategories } from "@/app/lib/graphQLServiceConsumer";
import CategoryCreateForm from "@/app/ui/problems/categories/categoryCreate";
import Link from "next/link";
import { Button } from '@/app/ui/button';
import CategoryName from "@/app/ui/problems/categories/categoryName";
import DeleteProblemCategory from "@/app/ui/problems/categories/categoryDelete";


export default async function ProblemCategories() {
    let temp: unknown = await getProblemCategories();
    const data = temp as ProblemCategory[];
    console.log("&&& &&& categoryData", data);
    {/* //@ts-ignore */ }
    const categories = data.getProblemCategories;
    console.log("^^^ ^^^ fteched categories: ", categories);

    return (
        <>
            <h1 className="text-green-700">Problem Categories</h1>
            <div className="mx-10 mt-8">
                <div className="divide-y divide-gray-100">

                    {categories.map(category => (

                        <details key={category._id} className="group mb-2" open>
                            <summary
                                className="list-none py-4 text-lg font-medium text-secondary-900 group-open:text-primary-500">

                                <span className="flow-root">
                                    <span id={category._id} className="float-left mr-3">
                                        {category.name}
                                    </span>


                                    <Link href={`/admin/problems/categories/${encodeURIComponent(category._id)}/edit`} className="text-indigo-600 hover:text-indigo-900 mt-1 ml-1 float-left">
                                        <svg className="h-4 w-4 text-yellow-500" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" stroke-linejoin="round">  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                                    </Link>


                                    <DeleteProblemCategory id={category._id} />



                                <span className="float-right">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                        stroke="currentColor" className="block h-5 w-5 group-open:hidden">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                        stroke="currentColor" className="hidden h-5 w-5 group-open:block">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
                                    </svg>
                                </span>
                                </span>
                            </summary>

                            {category.subCategories.map(subCategory => (
                                <>
                                    <span key={subCategory} id="badge-dismiss-default" className="inline-flex items-center px-3 py-2 me-2 text-sm font-medium text-white bg-gray-600 rounded dark:bg-gray-600 dark:text-white mb-2">
                                        {subCategory}

                                        {/*
                                        <button type="button" className="inline-flex items-center p-1 ms-2 text-sm text-white bg-transparent rounded-sm hover:bg-gray-200 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white" data-dismiss-target="#badge-dismiss-default" aria-label="Remove">
                                            <svg className="h-4 w-4 text-yellow-500" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                                            <span className="sr-only">Edit</span>
                                        </button>

                                        <button type="button" className="inline-flex items-center p-1 ms-2 text-sm text-white bg-transparent rounded-sm hover:bg-gray-200 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white" data-dismiss-target="#badge-dismiss-default" aria-label="Remove">
                                            <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>

                                            <span className="sr-only">Remove badge</span>
                                        </button>
                                        */}
                                    </span>
                                </>
                            ))}
                        </details>

                    ))}
                </div>
                <CategoryCreateForm />
                <div>

                </div>
            </div>
        </>


    )
}
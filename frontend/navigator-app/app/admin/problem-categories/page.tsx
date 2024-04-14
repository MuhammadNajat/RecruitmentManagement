import { createCategory } from "@/app/lib/problem-categories/mutations/createProblemCategoryAction";
import { ProblemCategory } from "@/app/lib/definitions";
import { getProblemCategories } from "@/app/lib/graphQLServiceConsumer";
import CategoryCreateForm from "@/app/ui/problem-categories/categoryCreate";
import Link from "next/link";
import { Button } from '@/app/ui/button';
import CategoryName from "@/app/ui/problem-categories/categoryName";
import DeleteProblemCategory from "@/app/ui/problem-categories/categoryDelete";


export default async function ProblemCategories() {
    let temp: unknown = await getProblemCategories();
    const data = temp as ProblemCategory[];
    console.log("&&& &&& categoryData", data);
    //@ts-ignore
    const categories = data.getProblemCategories;
    console.log("^^^ ^^^ fteched categories: ", categories);

    return (
        <>
            <h1 className="text-green-700">Problem Categories</h1>
            <div className="mx-10 mt-8">
                <div className="divide-y divide-gray-100">

                    {categories.map(category => (

                        <details key={category._id} className="group mb-2">
                            <summary
                                className="list-none py-4 text-lg font-medium text-secondary-900 group-open:text-primary-500">

                                <span className="flow-root">
                                    <span id={category._id} className="float-left mr-3">
                                        {category.name}
                                    </span>


                                    <Link href={`/admin/problem-categories/${encodeURIComponent(category._id)}/edit`} className="text-indigo-600 hover:text-indigo-900 mt-1 ml-1 float-left">
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
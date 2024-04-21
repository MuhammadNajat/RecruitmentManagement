import { Tag } from "@/app/lib/definitions";
import { getTags } from "@/app/lib/data/tags/queries/readTagAction";
import Link from "next/link";
import DeleteTag from "@/app/ui/tags/tagDelete";
import TagCreateForm from "@/app/ui/tags/tagCreate";


export default async function Tags() {
    let temp: unknown = await getTags();
    const data = temp as Tag[];
    console.log("&&& &&& tagData", data);
    //@ts-ignore
    const tags = data.getTags;
    console.log("^^^ ^^^ fteched tags: ", tags);

    return (
        <>
            <div className="text-green-700">
                <span className="float-left">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
                    </svg>
                </span>
                Tags
            </div>
            <div className="mx-10 mt-8">
                <div className="divide-y divide-gray-100">

                    {tags.map(tag => (

                        <div
                            className="list-none py-4 text-lg font-medium text-secondary-900 group-open:text-primary-500">

                            <span className="flow-root">
                                <span className="float-left">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
                                    </svg>
                                </span>

                                <span id={tag._id} className="float-left mr-3">
                                    {tag.name}
                                </span>


                                <Link href={`/admin/tags/${encodeURIComponent(tag._id)}/edit`} className="text-indigo-600 hover:text-indigo-900 mt-1 ml-1 float-left">
                                    <svg className="h-4 w-4 text-yellow-500" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" stroke-linejoin="round">  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                                </Link>

                                <DeleteTag id={tag._id} />
                            </span>
                        </div>

                    ))}
                </div>
                <TagCreateForm />
                <div>

                </div>
            </div>
        </>


    )
}
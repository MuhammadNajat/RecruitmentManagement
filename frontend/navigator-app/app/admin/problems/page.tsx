import { getProblems } from "@/app/lib/data/problems/queries/readProblemAction";
import { getUsers } from "@/app/lib/data/users/queries/readUserAction"
import { lusitana } from '@/app/ui/fonts';
import { User, UserQueryResponse, Problem, ProblemCategory, Tag } from "@/app/lib/definitions";
import Link from 'next/link'
import DeleteComponent from "@/app/ui/users/delete-user";
import { getProblemCategoryByID } from "@/app/lib/data/problem-categories/queries/readProblemCategoryAction";
import { getTagByID } from "@/app/lib/data/tags/queries/readTagAction";
import { getUserByID } from "@/app/lib/data/users/queries/readUserAction";

export default async function Problems() {
  let temp: unknown = await getProblems();
  const problemData = temp as Problem[];
  console.log("&&& &&& problemData:", problemData);
  const problems = problemData.getProblems;
  console.log("^^^ ^^^ fteched problems: ", problems);

  let categoryNames: string[] = [];
  for (let i = 0; i < problems.length; i++) {
    categoryNames.push("");
  }

  for (let i = 0; i < problems.length; i++) {
    categoryNames.push("");
    for (let j = 0; j < problems[i].categoryIDs?.length; j++) {
      let temp: unknown = await getProblemCategoryByID(problems[i].categoryIDs[j]);
      const data = temp as ProblemCategory;
      ///console.log("### ### ### In problems: data as ProblemCategory:", data);
      const category = data.getProblemCategoryByID;
      if (!category) {
        continue;
      }
      categoryNames[i] += category?.name?.toString();
      categoryNames[i] += ", ";
    }
    categoryNames[i] = categoryNames[i].substring(0, categoryNames[i].length - 2);
  }

  let tagNames: string[] = [];

  for (let i = 0; i < problems.length; i++) {
    tagNames.push("");
    for (let j = 0; j < problems[i].tagIDs?.length; j++) {
      let temp: unknown = await getTagByID(problems[i].tagIDs[j].toString());
      const data = temp as Tag;
      console.log("### ### ### In problems: data as Tag:", data);
      const tag = data.getTagByID;

      if (tag == null) {
        continue;
      }
      tagNames[i] += tag?.name?.toString();
      tagNames[i] += ", ";
    }
    tagNames[i] = tagNames[i].substring(0, tagNames[i].length - 2);
  }

  let authorNames: string[] = [];
  for (let i = 0; i < problems.length; i++) {
    let temp: unknown = await getUserByID(problems[i].authorUserID);
    const data = temp as User;
    const user = data.getUserByID;
    authorNames.push(user.name.toString());
  }
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Problems
      </h2>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200v">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Statement
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Difficulty
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Has Image?
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Has Comments?
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Categories
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tags
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Author
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Reveiwer
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Approver
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Created at
                    </th>
                    <th scope="col" className="relative text-left px-6 py-3">
                      <span className="sr-only">View</span>
                    </th>
                    <th scope="col" className="relative text-left px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Delete</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {problems.map((problem, index) => (
                    <tr key={problem._id}>
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium ">
                        {problem.statement.substring(0, 25)} {problem.statement.length > 25 ? "..." : ""}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium ">
                        {problem.difficulty}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium ">
                        {problem.status}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium   text-gray-500">
                        {problem.imageCloudinaryPublicID == null ? "No" : "Yes"}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium   text-gray-500">
                        {problem.commentIDs == null || problem.commentIDs.length == 0 ? "No" : "Yes"}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium   text-gray-500">
                        {categoryNames[index]}
                      </td>

                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium   text-gray-500">
                        {tagNames[index]}
                      </td>

                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium ">
                        {authorNames[index]}
                      </td>

                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium ">
                        {problem.reviewerUserID ? problem.reviewerUserID : "-"}
                      </td>

                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium ">
                        {problem.approverAdminUserID ? problem.approverAdminUserID : "-"}
                      </td>

                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium  text-left  font-medium">
                        {problem.createdAt.substring(0, 19)}
                      </td>

                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium  text-left  font-medium">

                        <Link href={`/admin/problems/${encodeURIComponent(problem._id)}/view`}
                          className="text-indigo-600 hover:text-indigo-900">
                          View
                        </Link>

                      </td>

                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium  text-left  font-medium">

                        <Link href={`/admin/problems/${encodeURIComponent(problem._id)}/edit`}
                          className="text-indigo-600 hover:text-indigo-900">
                          Edit
                        </Link>

                      </td>

                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium  text-left  font-medium">


                        <DeleteComponent key={problem._id} id={problem._id} />

                        {/*
                      <Link href={`/admin/users/${encodeURIComponent(user.id)}/delete`} className="text-indigo-600 hover:text-indigo-900">
                        Delete
                      </Link>
                      */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
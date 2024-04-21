'use server';

import { revalidatePath } from 'next/cache';
import { gql, GraphQLClient } from 'graphql-request';
import { unstable_noStore as noStore } from 'next/cache';
import { Tag } from "@/app/lib/definitions";

export async function getTag(id: String) {
  const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
    headers: {
      //authorization: 'Apikey ' + process.env.AUTH_SECRET,
    },
  });

  const query = gql`
      query GetTag($id: ID!) {
        getTag(id: $id) {
          _id
          name
        }
      }
    `;

  const variables = {
    id: id,
  };

  try {
    const results = await graphQLClient.request(query, variables);
    console.log("Query (GetTag) Result:");
    console.log(results);
    return results;
  } catch (error) {
    console.error("Error querying Tag:", error);
  }
}

export async function getTags() {
  const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
    headers: {
      //authorization: 'Apikey ' + process.env.AUTH_SECRET,
    },
  });

  const query = gql`
        query GetTags() {
          getTags {
            _id
            name
          }
        }
      `;

  try {
    const results = await graphQLClient.request(query);
    console.log("*** *** Query Tag Results:");
    console.log(results);
    return results;
  } catch (error) {
    console.error("Error querying Tags:", error);
  }
}

const ITEMS_PER_PAGE = 2;
export async function fetchFilteredTags(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    let temp: unknown = await getTags();
    const tagData = temp as Tag[];

    //@ts-ignore
    const tags = tagData.getTags;
    let taken = new Array(tags.length).fill(0);
    console.log(">>> Inside fetchFilteredTags() : tags = ", tags);
    const filtered = [];
    for (let i = offset, j = 0; i < tags.length && j < ITEMS_PER_PAGE; i++, j++) {
      for (const property in tags[i]) {
        if (String(tags[i][property]).includes(query)) {
          filtered.push(tags[i]);
        }
      }
    }
    console.log("### ### Filtered tags:", filtered);
    revalidatePath('@/app/tags');

    //redirect('/dashboard/invoices');
    return filtered;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tags.');
  }
}
'use server';

import { revalidatePath } from 'next/cache';
import { gql, GraphQLClient } from 'graphql-request';
import { unstable_noStore as noStore } from 'next/cache';
import { User } from "@/app/lib/definitions";

export async function readUser(id: String) {
  const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
    headers: {
      //authorization: 'Apikey ' + process.env.AUTH_SECRET,
    },
  });

  const query = gql`
      query GetUser($id: ID!) {
        getUser(id: $id) {
          _id
          employeeID
          name
          email
          password
          role
          createdAt
          updatedAt
        }
      }
    `;

  const variables = {
    id: id,
  };

  try {
    const results = await graphQLClient.request(query, variables);
    console.log("Query (GetUser) Result:");
    console.log(results);
    return results;
  } catch (error) {
    console.error("Error querying data:", error);
  }
}

export async function readUsers() {
  const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
    headers: {
      //authorization: 'Apikey ' + process.env.AUTH_SECRET,
    },
  });

  const query = gql`
        query getUsers() {
          getUsers {
            _id
            employeeID
            name
            email
            password
            role
            createdAt
            updatedAt
          }
        }
      `;

  try {
    const results = await graphQLClient.request(query);
    console.log("*** *** Mutation (Create) Results:");
    console.log(results);
    return results;
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

const ITEMS_PER_PAGE = 2;
export async function fetchFilteredUsers(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    let temp: unknown = await readUsers();
    const userData = temp as User[];

    //@ts-ignore
    const users = userData.getUsers;
    let taken = new Array(users.length).fill(0);
    console.log(">>> Inside fetchFilteredUsers() : users = ", users);
    const filtered = [];
    for (let i = offset, j = 0; i < users.length && j < ITEMS_PER_PAGE; i++, j++) {
      for (const property in users[i]) {
        if (String(users[i][property]).includes(query)) {
          filtered.push(users[i]);
        }
      }
    }
    console.log("### ### Filtered users:", filtered);
    revalidatePath('@/app/users');

    //redirect('/dashboard/invoices');
    return filtered;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch users.');
  }
}
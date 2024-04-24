'use server';

import { revalidatePath } from 'next/cache';
import { gql, GraphQLClient } from 'graphql-request';
import { unstable_noStore as noStore } from 'next/cache';
import { User } from "@/app/lib/definitions";

export async function getUserByID(id: String) {
  const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
    headers: {
      //authorization: 'Apikey ' + process.env.AUTH_SECRET,
    },
  });

  const query = gql`
      query GetUserByID($id: ID!) {
        getUserByID(id: $id) {
          _id
          employeeID
          name
          email
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

export async function getUserByEmployeeID(employeeID: String) {
  const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
    headers: {
      //authorization: 'Apikey ' + process.env.AUTH_SECRET,
    },
  });

  const query = gql`
    query GetUserByEmployeeID($employeeID: String!) {
      getUserByEmployeeID(employeeID: $employeeID) {
        _id
        employeeID
        name
        email
        role
      }
    }
  `;

  const variables = {
    employeeID: employeeID,
  };

  try {
    const results = await graphQLClient.request(query, variables);
    console.log("Query (GetUserByEmployeeID) Result:");
    console.log(results);
    return results;
  } catch (error) {
    console.error("Error GetUserByEmployeeID:", error);
  }
}

export async function getUserByEmail(email: String) {
  const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
    headers: {
      //authorization: 'Apikey ' + process.env.AUTH_SECRET,
    },
  });

  const query = gql`
    query GetUserByEmail($email: String!) {
      getUserByEmail(email: $email) {
        _id
        employeeID
        name
        email
        role
        createdAt
        updatedAt
      }
    }
  `;

  const variables = {
    email: email,
  };

  try {
    const results = await graphQLClient.request(query, variables);
    console.log("Query (GetUserByEmail) Result:");
    console.log(results);
    return results;
  } catch (error) {
    console.error("Error GetUserByEmail:", error);
  }
}

export async function getUsers() {
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
    let temp: unknown = await getUsers();
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
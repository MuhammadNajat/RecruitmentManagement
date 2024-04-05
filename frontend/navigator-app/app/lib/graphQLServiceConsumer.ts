'use server';

import { z } from 'zod';
//import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import email from 'next-auth/providers/email';
import { error } from 'console';
import { request, gql, GraphQLClient } from 'graphql-request';
import { unstable_noStore as noStore } from 'next/cache';
import { cookies } from 'next/headers';
import { User } from "@/app/lib/definitions";


async function insertUser(employeeID : string, name : string, emailAddress : string, adminAssignedPassword : string, role : string) {
    const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
      headers: {
          //authorization: 'Apikey ' + process.env.AUTH_SECRET,
      },
    });

    const query = gql`
      mutation CreateUser($input: UserCreateInput!) {
        createUser(input: $input) {
          _id
          employeeID
          name
          email
          password
          adminAssignedPassword
          changedAdminAssignedPassword
          role
          createdAt
          updatedAt
        }
      }
    `;
    const variables = {
      input: {
          employeeID: employeeID,
          name: name,
          email: emailAddress,
          adminAssignedPassword: adminAssignedPassword,
          password: '',
          changedAdminAssignedPassword: false,
          role: role,
      }
    };

    
  try {
    const results = await graphQLClient.request(query, variables);
    console.log("Mutation (Create) Results:");
    console.log(results);
    return results;
  } catch (error) {
      console.error("Error inserting data:", error);
  }
}

export async function readUser(id : String) {
  const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
    headers: {
        //authorization: 'Apikey ' + process.env.AUTH_SECRET,
    },
  });

  const query = gql`
    query GetUser($id: String!) {
      getUser(employeeID: $id) {
        _id
        employeeID
        name
        email
        password
        adminAssignedPassword
        changedAdminAssignedPassword
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
      console.log("*** *** Mutation (Create) Results:");
      console.log(results);
      return results;
  } catch (error) {
      console.error("Error inserting data:", error);
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
          adminAssignedPassword
          changedAdminAssignedPassword
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
    const users = userData.getUsers;
    let taken = new Array(users.length).fill(0);
    console.log(">>> Inside fetchFilteredUsers() : users = ", users);
    const filtered = [];
    for(let i=offset, j=0; i<users.length && j<ITEMS_PER_PAGE; i++, j++) {
      for (const property in users[i]) {
        if(String(users[i][property]).includes(query)) {
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

async function updateUserData(employeeID : string, name : string, emailAddress : string, adminAssignedPassword : string, role : string) {
  const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
    headers: {
        //authorization: 'Apikey ' + process.env.AUTH_SECRET,
    },
  });

  const query = gql`
    mutation UpdateUser($id: String!, $input: UserUpdateInput!) {
      updateUser(employeeID: $id, input: $input) {
        _id
        employeeID
        name
        email
        password
        adminAssignedPassword
        changedAdminAssignedPassword
        role
      }
    }
  `;
  const variables = {
    id: employeeID,
    input: {
        employeeID: employeeID,
        name: name,
        email: emailAddress,
        adminAssignedPassword: adminAssignedPassword,
        password: '',
        changedAdminAssignedPassword: false,
        role: role,
    }
  };

  
  try {
    const results = await graphQLClient.request(query, variables);
    console.log("Mutation (Update) Results:");
    console.log(results);
  } catch (error) {
      console.error("Error udating data:", error);
  }
}
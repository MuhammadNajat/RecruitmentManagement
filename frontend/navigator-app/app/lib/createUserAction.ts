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

/*
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb://localhost:27017/";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
*/

const FormSchema = z.object({
    id: z.string(),
    employeeID: z.string(),
    name: z.string(),
    emailAddress: z.string(),
    password: z.string(),
    role: z.enum(['PROBLEMSETTER', 'REVIEWER', 'ADMIN']),
  });
   
  const CreateUser = FormSchema.omit({ id: true });
  
  export async function createUser(prevState: string | undefined, formData: FormData,) {
    const { employeeID, emailAddress, name, password, role } = CreateUser.parse({
    employeeID: formData.get('employeeID'),
    name: formData.get('name'),
    emailAddress: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role'),
    });

    console.log("*** employeeID: ", employeeID);
    console.log("*** email: ", emailAddress);
    console.log("*** name: ", name);
    console.log("*** password: ", password);
    console.log("*** role: ", role);

    if( employeeID.length == 0 || employeeID.length > 10) {
        console.log("Employee ID is too long");
        return "Proper employee ID is required";
    }

    if( name.length < 3 || name.length > 50) {
        console.log("Name is too long");
        return "Name-length should be between 3 and 50 (inclusive)";
    }

    if( password.length < 6 || password.length > 15) {
        console.log("Name is too long");
        return "Password-length should be between 6 and 15";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isEmailAddressValid = emailRegex.test(emailAddress);

    if(!isEmailAddressValid) {
        console.log("Email address is invalid");
        return "Proper email address is required";
    }

    insertData(employeeID, name, emailAddress, password, role);
  
    revalidatePath('/admin/users');
  
    redirect('/admin/users');
  }

  async function insertData(employeeID : string, name : string, emailAddress : string, adminAssignedPassword : string, role : string) {
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
  } catch (error) {
      console.error("Error inserting data:", error);
  }
}
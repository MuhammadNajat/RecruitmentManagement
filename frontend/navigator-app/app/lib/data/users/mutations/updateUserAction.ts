'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { checkUserInputValidity } from '@/app/lib/helpers/user-validator';
import { gql, GraphQLClient } from 'graphql-request';

const FormSchema = z.object({
  id: z.string(),
  employeeID: z.string(),
  name: z.string(),
  emailAddress: z.string(),
  password: z.string(),
  role: z.enum(['PROBLEMSETTER', 'REVIEWER', 'ADMIN']),
});

const CreateUser = FormSchema.omit({ /*id: true*/ });

export async function updateUser(prevState: string | undefined, formData: FormData,) {
  const { id, employeeID, emailAddress, name, password, role } = CreateUser.parse({
    id: formData.get('id'),
    employeeID: formData.get('employeeID'),
    name: formData.get('name'),
    emailAddress: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role'),
  });

  const inputValidity = checkUserInputValidity(employeeID, emailAddress, name, password, role);
  if (!inputValidity[0]) {
    return inputValidity[1].toString();
  }

  updateUserData(id, employeeID, name, emailAddress, password, role);

  revalidatePath('/admin/users');

  redirect('/admin/users');
}

async function updateUserData(id: string, employeeID: string, name: string, emailAddress: string, adminAssignedPassword: string, role: string) {
  const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
    headers: {
      //authorization: 'Apikey ' + process.env.AUTH_SECRET,
    },
  });

  const query = gql`
      mutation UpdateUser($id: ID!, $input: UserUpdateInput!) {
        updateUser(id: $id, input: $input) {
          id
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
    id: id,
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
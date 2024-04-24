'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { checkUserInputValidity } from '@/app/lib/helpers/user-validator';
import { gql, GraphQLClient } from 'graphql-request';
import { generatePassword } from '@/app/lib/helpers/randomPasswordGenerator';
import * as bcrypt from "bcrypt";
import { sendMail } from '@/app/lib/helpers/mail-sender';
import { getUserByEmail, getUserByEmployeeID } from '../queries/readUserAction';

const FormSchema = z.object({
  id: z.string(),
  employeeID: z.string(),
  name: z.string(),
  emailAddress: z.string(),
  resetPassword: z.any(),
  role: z.enum(['PROBLEMSETTER', 'REVIEWER', 'ADMIN']),
});

const UpdateUser = FormSchema.omit({ /*id: true*/ });

export async function updateUser(prevState: string | undefined, formData: FormData,) {
  const { id, employeeID, emailAddress, name, resetPassword, role } = UpdateUser.parse({
    id: formData.get('id'),
    employeeID: formData.get('employeeID'),
    name: formData.get('name'),
    emailAddress: formData.get('email'),
    resetPassword: formData.get('resetPassword'),
    role: formData.get('role'),
  });

  console.log(`+++ +++ Showing datat in updateUser: id:${id}, employeeID:${employeeID}, email: ${emailAddress}`);

  const inputValidity = checkUserInputValidity(employeeID, emailAddress, name, role);
  if (!inputValidity[0]) {
    return inputValidity[1].toString();
  }

  let password = null, hashedPassword = null;
  if (resetPassword != null && resetPassword) {
    password = generatePassword();
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const userWithInputEmail = await getUserByEmail(emailAddress);
  console.log(">>> >>> >>> userWithInputEmail", userWithInputEmail);

  if(userWithInputEmail != null && userWithInputEmail.getUserByEmail._id != id) {
    const response = "A user with the same email exists.";
    return response;
  }

  const userWithInputEmployeeID = await getUserByEmployeeID(employeeID);
  console.log(">>> >>> >>> userWithInputEmployeeID", userWithInputEmployeeID);

  if(userWithInputEmployeeID != null && userWithInputEmployeeID.getUserByEmployeeID._id != id) {
    const response = "A user with the same employee ID exists.";
    return response;
  }

  updateUserData(id, employeeID, name, emailAddress, hashedPassword, role);

  revalidatePath('/admin/users');

  redirect('/admin/users');
}

export async function updateUserData(id: any, employeeID: any, name: any, emailAddress: any, password: any, role: any) {
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
      password: password,
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

async function sendEmail(address: string, password: string) {
  try {
    let body = `
Dear User,

Your credentials for DSi Recruitment Management System (DRM) have been updated. Please find your credentials below:

Username: ${address}
Password: ${password}

Wish you all the best. Thank you.

Regards,
DRM System Admin Panel
`;

    let headline = "Your DRM Credential";
    await sendMail(
      headline,
      address,
      body
    );
  } catch (error) {
    console.log("Error: ", error);
  }
}
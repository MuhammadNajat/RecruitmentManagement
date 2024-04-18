'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { checkUserInputValidity } from '@/app/lib/helpers/user-validator';
import { gql, GraphQLClient } from 'graphql-request';
import { generatePassword } from '@/app/lib/helpers/randomPasswordGenerator';
import * as bcrypt from "bcrypt";
import { sendMail } from '@/app/lib/helpers/mail-sender';
import { zfd } from "zod-form-data";

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

  console.log("+++ +++ Showing resetPassword: ", resetPassword);

  const inputValidity = checkUserInputValidity(employeeID, emailAddress, name, role);
  if (!inputValidity[0]) {
    return inputValidity[1].toString();
  }

  let password = null, hashedPassword = null;
  if (resetPassword != null && resetPassword) {
    password = generatePassword();
    hashedPassword = await bcrypt.hash(password, 10);
  }

  updateUserData(id, employeeID, name, emailAddress, hashedPassword, role);

  if (resetPassword != null && resetPassword == "on") {
    sendEmail(emailAddress, String(password));
  }

  revalidatePath('/admin/users');

  redirect('/admin/users');
}

async function updateUserData(id: string, employeeID: string, name: string, emailAddress: string, password: any, role: string) {
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
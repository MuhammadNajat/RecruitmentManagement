'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { checkUserInputValidity } from '@/app/lib/helpers/user-validator';
import { gql, GraphQLClient } from 'graphql-request';
import * as bcrypt from 'bcrypt';
import { sendMail } from '@/app/lib/helpers/mail-sender';
import { generatePassword } from '@/app/lib/helpers/randomPasswordGenerator';

const FormSchema = z.object({
  id: z.string(),
  employeeID: z.string(),
  name: z.string(),
  emailAddress: z.string(),
  role: z.enum(['PROBLEMSETTER', 'REVIEWER', 'ADMIN']),
});

const CreateUser = FormSchema.omit({ id: true });

export async function createUser(prevState: string | undefined, formData: FormData,) {
  const { employeeID, emailAddress, name, role } = CreateUser.parse({
    employeeID: formData.get('employeeID'),
    name: formData.get('name'),
    emailAddress: formData.get('email'),
    role: formData.get('role'),
  });

  const inputValidity = checkUserInputValidity(employeeID, emailAddress, name, role);
  if (!inputValidity[0]) {
    return inputValidity[1].toString();
  }

  const password = generatePassword();

  const hashedPassword = await bcrypt.hash(password, 10);

  console.log("### ### HASHED PASSWORD:", hashedPassword);

  await insertData(employeeID, name, emailAddress, hashedPassword, role);

  sendEmail(emailAddress, password);

  revalidatePath('/admin/users');

  redirect('/admin/users');
}

async function insertData(employeeID: string, name: string, emailAddress: string, password: string, role: string) {
  const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
    headers: {
      //authorization: 'Apikey ' + process.env.AUTH_SECRET,
    },
  });

  const query = gql`
      mutation CreateUser($input: UserCreateInput!) {
        createUser(input: $input) {
          id
          employeeID
          name
          email
          role
        }
      }
    `;
  const variables = {
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
    console.log("Mutation (Create User) Results:");
    console.log(results);
  } catch (error) {
    console.error("Error inserting User:", error);
  }
}

async function sendEmail(address: string, password: string) {
  try {
    let body = `
Dear User,

Congratulations! Your credentials for DSi Recruitment Management System (DRM) have been created. Please find your credentials below:

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
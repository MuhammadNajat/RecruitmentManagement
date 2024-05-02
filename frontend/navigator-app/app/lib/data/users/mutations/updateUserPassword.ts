import { generatePassword } from '@/app/lib/helpers/randomPasswordGenerator';
import * as bcrypt from "bcrypt";
import { gql, GraphQLClient } from 'graphql-request';
import { sendMail } from '@/app/lib/helpers/mail-sender';
import { getUserByID, getUserByEmployeeID } from '../queries/readUserAction';
import { User } from '@/app/lib/definitions';

export async function updateUserData(id: string, password: string, hashedPassword: string) {
  let temp: unknown = await getUserByID(id);
  const userData = temp as User;
  const user = userData.getUserByID;

  if(user == null) {
    console.log("!!! !!! !!! No user exists with the given ID");
    return;
  }

  //console.log(">>> >>> >>> Password: ", password, "Hashedpassword: ", hashedPassword);

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
      employeeID: null,
      name: null,
      email: null,
      password: hashedPassword,
      role: null
    }
  };

  try {
    const results = await graphQLClient.request(query, variables);
    console.log("Mutation (UpdateUserPassword) Results:");
    console.log(results);
    sendEmail(user.email, password);
  } catch (error) {
    console.error("Error updating password:", error);
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
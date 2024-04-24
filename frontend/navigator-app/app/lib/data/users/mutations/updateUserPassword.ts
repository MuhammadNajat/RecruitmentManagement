import { generatePassword } from '@/app/lib/helpers/randomPasswordGenerator';
import * as bcrypt from "bcrypt";
import { gql, GraphQLClient } from 'graphql-request';

export async function updateUserData(id: string, hashedPassword: string) {
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
    } catch (error) {
      console.error("Error updating password:", error);
    }
  }
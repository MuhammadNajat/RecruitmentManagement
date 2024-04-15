'use server';

import { request, gql, GraphQLClient } from 'graphql-request';

export async function getProblemCategories() {
  const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
    headers: {
      //authorization: 'Apikey ' + process.env.AUTH_SECRET,
    },
  });

  const query = gql`
    query GetProblemCategories {
      getProblemCategories {
        _id
        name
        subCategories
      }
    }
  `;

  try {
    const results = await graphQLClient.request(query);
    console.log("*** *** Query (GetProblemCategories) Results:");
    console.log(results);
    return results;
  } catch (error) {
    console.error("Error uery (GetProblemCategories):", error);
  }
}

export async function getProblemCategory(id: String) {
  const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
    headers: {
      //authorization: 'Apikey ' + process.env.AUTH_SECRET,
    },
  });

  const query = gql`
    query GetProblemCategory($id : ID!) {
      getProblemCategory(id : $id) {
        _id
        name
        subCategories
      }
    }
  `;

  const variables = {
    id: id,
  };


  try {
    const results = await graphQLClient.request(query, variables);
    console.log(`*** *** Query (GetProblemCategory${id}) Results:`);
    console.log(results);
    return results;
  } catch (error) {
    console.error(`Error Query (GetProblemCategory${id}):`, error);
  }
}
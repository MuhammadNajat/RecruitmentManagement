'use server';

import { request, gql, GraphQLClient } from 'graphql-request';

export async function getProblems() {
  const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
    headers: {
      //authorization: 'Apikey ' + process.env.AUTH_SECRET,
    },
  });

  const query = gql`
    query GetProblems {
      getProblems {
        _id
        statement
        image
        tags
        status
        difficulty
        commentIDs
        authorUserID
        reviewerUserID
        approverAdminUserID
        createdAt
        updatedAt
      }
    }
  `;

  try {
    const results = await graphQLClient.request(query);
    console.log("*** *** Query (GetProblems) Results:");
    console.log(results);
    return results;
  } catch (error) {
    console.error("Error uery (GetProblems):", error);
  }
}

export async function getProblem(id: String) {
  const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
    headers: {
      //authorization: 'Apikey ' + process.env.AUTH_SECRET,
    },
  });

  const query = gql`
    query GetProblem($id : ID!) {
      getProblem(id : $id) {
        _id
        statement
        image
        tags
        status
        difficulty
        commentIDs
        authorUserID
        reviewerUserID
        approverAdminUserID
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
    console.log(`*** *** Query (GetProblem${id}) Results:`);
    console.log(results);
    return results;
  } catch (error) {
    console.error(`Error Query (GetProblem${id}):`, error);
  }
}
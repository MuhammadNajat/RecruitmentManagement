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

export async function getProblemCategoryByID(id: String) {
  const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
    headers: {
      //authorization: 'Apikey ' + process.env.AUTH_SECRET,
    },
  });

  const query = gql`
    query GetProblemCategoryByID($id : ID!) {
      getProblemCategoryByID(id : $id) {
        _id
        name
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

export async function getProblemCategoryByName(name: String) {
  const graphQLClient = new GraphQLClient('http://localhost:8080/query', {
    headers: {
      //authorization: 'Apikey ' + process.env.AUTH_SECRET,
    },
  });

  const query = gql`
    query GetProblemCategoryByName($name : String!) {
      getProblemCategoryByName(name : $name) {
        _id
        name
      }
    }
  `;

  const variables = {
    name: name,
  };


  try {
    const results = await graphQLClient.request(query, variables);
    console.log(`*** *** Query (GetProblemCategoryByName${name}) Results:`);
    console.log(results);
    return results;
  } catch (error) {
    console.error(`Error Query (GetProblemCategoryByName${name}):`, error);
  }
}
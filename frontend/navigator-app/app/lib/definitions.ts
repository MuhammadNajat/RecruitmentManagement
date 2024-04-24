// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  _id: string;
  employeeID: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type UserQueryResponse = {
  _id: string;
  employeeID: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type ProblemCategory = {
  _id: string;
  name: string;
};

export type ProblemCategoryInput = {
  name: string;
  subCategories: string;
};

export type Problem = {
  _id: string;
  statement: string;
  image: any;
  tags: string[];
  difficulty: string;
  status: string;
  authorUserID: string;
  reviewerUserID: string;
  approverAdminUserID: string;
  reviewerComment: string;
  adminComment: string;
  createdAt: string;
  updatedAt: string;
}

export type Tag = {
  _id: string;
  name: string;
}
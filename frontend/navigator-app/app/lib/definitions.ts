// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  _id: string;
  employeeID: string;
  name: string;
  email: string;
  password: string;
  role: string;
  adminAssignedPassword: string;
  changedAdminAssignedPassword: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProblemCategory = {
  _id: string;
  name: string;
  subCategories: [string];
};

export type ProblemCategoryInput = {
  name: string;
  subCategories: string;
};
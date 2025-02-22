import { authResolvers } from "./auth";
import { postResolvers } from "./posts";

export const Mutation = {
  ...authResolvers,
  ...postResolvers,
};

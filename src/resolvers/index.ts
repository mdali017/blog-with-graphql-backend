import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtHelper } from "../utils/jwtHelper";
import config from "../config";
const prisma = new PrismaClient();

interface userInfo {
  name: string;
  email: string;
  password: string;
  bio?: string;
}

export const resolvers = {
  Query: {
    users: async (parent: any, args: any, context: any) => {
      const result = await prisma.user.findMany();
      return result;
    },
  },
  Mutation: {
    signup: async (parent: any, args: userInfo, context: any) => {
      const isExistingUser = await prisma.user.findFirst({
        where: {
          email: args.email,
        },
      });
      if (isExistingUser) {
        return {
          userError: "User already exists",
          token: null,
        };
      }
      const hashedPassword = await bcrypt.hash(args.password, 12);
      const newUser = await prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
          password: hashedPassword,
        },
      });

      if (args.bio) {
        await prisma.profile.create({
          data: {
            bio: args.bio,
            userId: newUser.id,
          },
        });
      }

      // const token = jwt.sign({ userId: newUser.id }, "secret", {
      //   expiresIn: "7d",
      // });
      const token = await jwtHelper(
        { userId: newUser.id },
        config.jwt.secret as string
      );
      // console.log(token);
      return { ...newUser, token };
    },
    signin: async (parent: any, args: any, context: any) => {
      console.log(args);
      const user = await prisma.user.findFirst({
        where: {
          email: args.email,
        },
      });
      if (!user) {
        return {
          userError: "Invalid email or password",
          token: null,
        };
      }
      // console.log(user);
      const correctPassword = await bcrypt.compare(
        args.password,
        user?.password || ""
      );
      // console.log(correctPassword)
      if (!correctPassword) {
        return {
          userError: "Invalid email or password",
          token: null,
        };
      }
      const token = await jwtHelper(
        { userId: user.id },
        config.jwt.secret as string
      );
      // console.log(token);
      return { ...user, token };
    },
  },
};

import { profile } from "console";

export const Query = {
  me: async (parent: any, args: any, { prisma, userInfo }: any) => {
    // console.log('userInfo', userInfo);
    return await prisma.user.findUnique({
      where: {
        id: userInfo.userId.userId,
      },
    });
  },
  users: async (parent: any, args: any, { prisma }: any) => {
    const result = await prisma.user.findMany();
    return result;
  },
  posts: async (parent: any, args: any, { prisma }: any) => {
    return await prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  },
  profile: async (parent: any, args: any, { prisma }: any) => {
    // console.log('args', args);
    return await prisma.profile.findUnique({
      where: {
        id: Number(args.id),
      },
    });
  },
};

export const User = {
  posts: async (parent: any, args: any, { prisma }: any) => {
    // console.log("parent", parent);
    const isMyProfile = parent.id === args.userId;
    console.log("isMyProfile", isMyProfile);

    // return await prisma.post.findMany({
    //   where: {
    //     authorId: parent.id,
    //   },
    // });

    if (isMyProfile) {
      return await prisma.post.findMany({
        where: {
          authorId: parent.id,
        },
      });
    } else {
      return await prisma.post.findMany({
        where: {
          authorId: parent.id,
          published: true,
        },
      });
    }
  },
};

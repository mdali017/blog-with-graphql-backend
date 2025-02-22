export const checkUserAccess = async (
  prisma: any,
  userId: any,
  postId: any
) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return {
      userError: "User not found",
      post: null,
    };
  }

  const post = await prisma.post.findUnique({
    where: {
      id: Number(postId), // Fixed field name
    },
  });

  // console.log("post: ", post);

  if (post?.authorId !== userId) {
    return {
      userError: "Post not owned by user !!!",
      post: null,
    };
  }

  if (!post) {
    return {
      userError: "Post not found",
      post: null,
    };
  }
};

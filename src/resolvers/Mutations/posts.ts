import { checkUserAccess } from "../../utils/checkUserAccess";

export const postResolvers = {
  addPost: async (parent: any, { post }: any, { prisma, userInfo }: any) => {
    // console.log("data: ", post);
    if (!userInfo) {
      return {
        userError: "Unauthorized",
        post: null,
      };
    }
    // console.log("userData : ", userInfo)
    if (!post.title || !post.content) {
      return {
        userError: "Title and content are required !!!",
        post: null,
      };
    }

    // console.log("userInfo: ", userInfo?.userId?.userId);

    try {
      const newPost = await prisma.post.create({
        data: {
          title: post.title,
          content: post.content,
          authorId: userInfo?.userId?.userId,
        },
      });

      console.log("Created post:", newPost);
      return {
        userError: null,
        post: newPost,
      };
    } catch (error) {
      console.error("Error creating post:", error);
      return {
        userError: "Failed to create post",
        post: null,
      };
    }
  },
  updatePost: async (parent: any, args: any, { prisma, userInfo }: any) => {
    if (!userInfo) {
      return {
        userError: "Unauthorized",
        post: null,
      };
    }
    const error = await checkUserAccess(
      prisma,
      userInfo?.userId?.userId,
      args.postId
    );
    if (error) {
      return error;
    }

    // Add update logic here
    try {
      const updatedPost = await prisma.post.update({
        where: {
          id: Number(args.postId),
        },
        data: {
          title: args.post.title,
          content: args.post.content,
        },
      });

      return {
        userError: null,
        post: updatedPost,
      };
    } catch (error) {
      console.error("Error updating post:", error);
      return {
        userError: "Failed to update post",
        post: null,
      };
    }
  },
  deletePost: async (parent: any, args: any, { prisma, userInfo }: any) => {
    if (!userInfo) {
      return {
        userError: "Unauthorized",
        post: null,
      };
    }
    const error = await checkUserAccess(
      prisma,
      userInfo?.userId?.userId,
      args.postId
    );
    if (error) {
      return error;
    }

    // Add update logic here
    try {
      const deletedPost = await prisma.post.delete({
        where: {
          id: Number(args.postId),
        },
      });

      return {
        userError: null,
        post: deletedPost,
      };
    } catch (error) {
      console.error("Error updating post:", error);
      return {
        userError: "Failed to update post",
        post: null,
      };
    }
  },
  publishedPosts: async (parent: any, args: any, { prisma, userInfo }: any) => {
    if (!userInfo) {
      return {
        userError: "Unauthorized",
        post: null,
      };
    }
    const error = await checkUserAccess(
      prisma,
      userInfo?.userId?.userId,
      args.postId
    );
    if (error) {
      return error;
    }

    // Add update logic here
    try {
      const publishedPost = await prisma.post.update({
        where: {
          id: Number(args.postId),
        },
        data: {
          published: true,
        },
      });

      return {
        userError: null,
        post: publishedPost,
      };
    } catch (error) {
      console.error("Error updating post:", error);
      return {
        userError: "Failed to update post",
        post: null,
      };
    }
  },
};

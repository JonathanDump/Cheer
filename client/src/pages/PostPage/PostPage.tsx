import { useQuery } from "@tanstack/react-query";
import cl from "./PostPage.module.scss";
import { fetcher } from "../../helpers/fetcher/fetcher";
import { useParams } from "react-router-dom";
import getItemFromLocalStorage from "../../helpers/functions/getItemFromLocalStorage";
import PostCard from "../../components/PostCard/PostCard";
import CreatePostOrCommentForm from "../../components/CreatePostForm/CreatePostOrCommentForm";
import { IPost } from "../../interfaces/interfaces";

export default function PostPage() {
  const postId = useParams().postId as string;
  const token = getItemFromLocalStorage("token") as string;

  const postQuery = useQuery<IPost>({
    queryKey: ["post"],
    queryFn: async () => await fetcher.get.getPost({ postId, token }),
  });

  if (postQuery.isLoading) {
    return <div className={cl.postPage}>Loading...</div>;
  }
  if (postQuery.isError) {
    return <div className={cl.postPage}>Something went wrong</div>;
  }

  return (
    <div className={cl.postPage}>
      <PostCard post={postQuery.data} />
      <CreatePostOrCommentForm type={"comment"} />
    </div>
  );
}

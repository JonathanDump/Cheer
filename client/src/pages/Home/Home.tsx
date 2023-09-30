import CreatePostForm from "../../components/CreatePostForm/CreatePostForm";
import cl from "./Home.module.scss";

export default function Home() {
  return (
    <div className={cl.home}>
      <CreatePostForm />
    </div>
  );
}

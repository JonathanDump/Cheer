import { useMutation } from "@tanstack/react-query";
import cl from "./CreatePostForm.module.scss";
import { fetcher } from "../../fetcher/fetcher";
import { FormEvent, useEffect } from "react";
import { useImmerReducer, useImmer } from "use-immer";
import { ICreatePostFormValues, IImage } from "../../interfaces/interfaces";
import getFormDataFromInputs from "../../helpers/getFormDataFromInputs";
import reducer from "../../reducers/createPostFormReducer";
import createImageInstance from "../../helpers/createImageInstace";
import ImagePostForm from "../ImagePostForm/ImagePostForm";

const initialValue: ICreatePostFormValues = {
  text: "",
  images: [],
};

export default function CreatePostForm() {
  const [formValues, dispatch] = useImmerReducer(reducer, initialValue);
  console.log("formValues", formValues);
  const [images, setImages] = useImmer<IImage[]>([]);

  const createPostMutation = useMutation({
    mutationFn: fetcher.post.createPost,
  });

  const handleCreatePostSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = getFormDataFromInputs(formValues);
    const token = localStorage.getItem("token")!;

    createPostMutation.mutate({ formData, token });
  };

  useEffect(() => {
    const loadImageData = async () => {
      const newImages: IImage[] = [];

      for (const image of formValues.images) {
        const imageObj = await createImageInstance(image);
        console.log("imageObj", imageObj);

        newImages.push(imageObj);
      }

      setImages((draft) => {
        draft.splice(0);
        draft.push(...newImages);
      });
    };

    loadImageData();
  }, [formValues.images, setImages]);

  return (
    <div className={cl.createPostForm}>
      <form onSubmit={handleCreatePostSubmit}>
        <textarea
          className={cl.input}
          name="post"
          id="post"
          cols={30}
          rows={10}
          value={formValues.text}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            dispatch({ type: "input text", text: e.target.value });
            console.log("formValues", formValues);
          }}
        ></textarea>
        <input
          type="file"
          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
            dispatch({ type: "add image", imageBlob: e.target.files![0] });
          }}
        />
        <div className={cl.imageContainer}>
          {images.map((image, i) => {
            return <ImagePostForm key={i} image={image} dispatch={dispatch} />;
          })}
        </div>
        <button>Post</button>
      </form>
    </div>
  );
}

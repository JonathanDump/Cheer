import { useMutation } from "@tanstack/react-query";
import cl from "./CreatePostForm.module.scss";
import { fetcher } from "../../helpers/fetcher/fetcher";
import { FormEvent, useEffect, useRef } from "react";
import { useImmerReducer, useImmer } from "use-immer";
import { IImage, IPost } from "../../interfaces/interfaces";
import getFormDataFromInputs from "../../helpers/functions/getFormDataFromInputs";
import reducer from "../../helpers/reducers/createPostFormReducer";
import createImageInstance from "../../helpers/functions/createImageInstace";
import ImagePostForm from "../ImagePostForm/ImagePostForm";
import { postInitialValue, queryClient } from "../../config/config";

export default function CreatePostForm() {
  const [formValues, dispatch] = useImmerReducer(reducer, postInitialValue);
  const [images, setImages] = useImmer<IImage[]>([]);

  const postButtonRef = useRef<HTMLButtonElement | null>(null);

  const token = localStorage.getItem("token")!;

  useEffect(() => {
    console.log("formValues", formValues);
  }, [formValues]);

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

  const createPostMutation = useMutation({
    mutationFn: fetcher.post.createPost,
    onError: (err) => {
      console.log(err);
    },
    onSuccess: async (data) => {
      const result: IPost = await data.json();
      console.log("result ", result);

      queryClient.setQueriesData(["home posts"], (oldData: unknown) => {
        if (oldData) {
          const copyOldData = JSON.parse(JSON.stringify(oldData));
          copyOldData.pages[0].posts.unshift(result);
          return copyOldData;
        }
        return oldData;
      });
    },
  });

  const handleCreatePostSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = getFormDataFromInputs(formValues);

    createPostMutation.mutate({ formData, token });

    dispatch({ type: "reset" });
  };

  const handleCtrlEnterKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      postButtonRef.current!.click();
    }
  };
  return (
    <div className={cl.createPostForm}>
      <form onSubmit={handleCreatePostSubmit}>
        <textarea
          className={cl.input}
          name="post"
          id="post"
          cols={30}
          value={formValues.text}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            dispatch({ type: "input text", text: e.target.value });
          }}
          onKeyDown={handleCtrlEnterKeyDown}
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
        <button ref={postButtonRef}>Post</button>
      </form>
    </div>
  );
}

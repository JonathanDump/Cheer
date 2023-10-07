import { useMutation } from "@tanstack/react-query";
import cl from "./CreatePostOrCommentForm.module.scss";
import { fetcher } from "../../helpers/fetcher/fetcher";
import { FormEvent, useEffect, useRef } from "react";
import { useImmerReducer, useImmer } from "use-immer";
import { IImage, IUser } from "../../interfaces/interfaces";
import getFormDataFromInputs from "../../helpers/functions/getFormDataFromInputs";
import reducer from "../../helpers/reducers/createPostFormReducer";
import createImageInstance from "../../helpers/functions/createImageInstace";
import ImagePostForm from "../ImagePostForm/ImagePostForm";
import { postInitialValue } from "../../config/config";
import { useParams } from "react-router-dom";

import { ReactComponent as AttachmentsIcon } from "/src/Icons/attachmentsImg.svg";
import { onSuccess } from "../../helpers/functions/onSuccess/onSuccess";

export default function CreatePostOrCommentForm({ type }: { type: string }) {
  const isPost = () => type === "post";
  const createType = isPost() ? "createPost" : "createComment";

  const [formValues, dispatch] = useImmerReducer(reducer, postInitialValue);
  const [images, setImages] = useImmer<IImage[]>([]);

  const postButtonRef = useRef<HTMLButtonElement | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const token = localStorage.getItem("token")!;
  const user = JSON.parse(localStorage.getItem("user") as string) as IUser;

  const { userName, postId } = useParams();

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
    mutationFn: fetcher.post[createType],
    onError: (err) => {
      console.log(err);
    },
    // onSuccess: async (data) => {
    //   const result: IPost = await data.json();
    //   result.createdBy = user;
    //   console.log("result ", result);

    //   const key = userName ? "user posts" : "home posts";
    //   queryClient.setQueriesData([key], (oldData: unknown) => {
    //     if (oldData) {
    //       const copyOldData = getObjectCopy(oldData);
    //       if (!copyOldData.pages[0]) {
    //         copyOldData.pages[0] = { posts: [result] };
    //       }
    //       copyOldData.pages[0].posts.unshift(result);
    //       return copyOldData;
    //     }
    //     return oldData;
    //   });
    // },
    onSuccess: async (data) =>
      isPost()
        ? await onSuccess.post({ data, userName, user })
        : await onSuccess.comment({ data, user }),
  });

  const handleCreatePostSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = getFormDataFromInputs(formValues);

    !isPost() && postId && formData.append("postId", postId);

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

  const handleAttachmentsIconClick = () => {
    inputFileRef.current?.click();
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
        <div className={cl.attachments} onClick={handleAttachmentsIconClick}>
          <input
            ref={inputFileRef}
            style={{ display: "none" }}
            type="file"
            accept="image/png, image/gif, image/jpeg"
            onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
              dispatch({ type: "add image", imageBlob: e.target.files![0] });
            }}
          />
          <AttachmentsIcon />
        </div>
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

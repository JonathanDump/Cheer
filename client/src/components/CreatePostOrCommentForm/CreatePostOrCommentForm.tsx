import { useMutation } from "@tanstack/react-query";
import cl from "./CreatePostOrCommentForm.module.scss";
import { fetcher } from "../../helpers/fetcher/fetcher";
import { FormEvent, useEffect, useRef } from "react";
import { useImmerReducer, useImmer } from "use-immer";
import { IImage, IUser } from "../../interfaces/interfaces";
import getFormDataFromInputs from "../../helpers/functions/getFormDataFromInputs";
import reducer from "../../helpers/reducers/createPostFormReducer";
import createImageInstance from "../../helpers/functions/createImageInstance";
import ImagePostForm from "../ImagePostForm/ImagePostForm";
import { postInitialValue } from "../../config/config";
import { useParams } from "react-router-dom";

import { ReactComponent as AttachmentsIcon } from "/src/icons/attachmentsImg.svg";
import { onSuccess } from "../../helpers/functions/onSuccess/onSuccess";

export default function CreatePostOrCommentForm({ type }: { type: string }) {
  const isPost = type === "post";
  const createType = isPost ? "createPost" : "createComment";

  const [formValues, dispatch] = useImmerReducer(reducer, postInitialValue);
  const [images, setImages] = useImmer<IImage[]>([]);

  const postButtonRef = useRef<HTMLButtonElement | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const maxLength = 300;
  const lengthClass =
    formValues.text.length === 300 ? `${cl.length} ${cl.limit}` : cl.length;

  const isAttachmentsDisabled = formValues.images.length >= 3;
  const attachmentsClass = isAttachmentsDisabled
    ? `${cl.attachments} ${cl.disabled}`
    : `${cl.attachments}`;

  const token = localStorage.getItem("token")!;
  const user = JSON.parse(localStorage.getItem("user") as string) as IUser;

  const { userName, postId } = useParams();

  useEffect(() => {}, [formValues]);

  useEffect(() => {
    const loadImageData = async () => {
      const newImages: IImage[] = [];

      for (const image of formValues.images) {
        const imageObj = await createImageInstance(image);

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

    onSuccess: async (data) => {
      textareaRef.current!.style.height = "50px";
      isPost
        ? await onSuccess.postCreate({ data, userName, user })
        : await onSuccess.commentCreate({ data, user });
    },
  });

  const handleCreatePostSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = getFormDataFromInputs(formValues);

    !isPost && postId && formData.append("postId", postId);

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

  const handleTextAreaInput = () => {
    const newHeight = textareaRef.current!.scrollHeight + "px";
    textareaRef.current!.style.height = newHeight;
  };
  return (
    <div className={cl.createPostForm}>
      <form onSubmit={handleCreatePostSubmit}>
        <div className="inputContainer">
          <textarea
            ref={textareaRef}
            maxLength={maxLength}
            className={cl.input}
            name="post"
            id="post"
            rows={1}
            value={formValues.text}
            placeholder="Say something"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              dispatch({ type: "input text", text: e.target.value });
            }}
            onKeyDown={handleCtrlEnterKeyDown}
            onInput={handleTextAreaInput}
          ></textarea>
          <div className={lengthClass}>
            {formValues.text.length}/{maxLength}
          </div>
        </div>
        {!!images.length && (
          <div className={cl.imageContainer}>
            {images.map((image, i) => {
              return (
                <ImagePostForm key={i} image={image} dispatch={dispatch} />
              );
            })}
          </div>
        )}
        <div className={cl.buttons}>
          <div
            className={attachmentsClass}
            onClick={handleAttachmentsIconClick}
          >
            <input
              ref={inputFileRef}
              style={{ display: "none" }}
              type="file"
              accept="image/png, image/gif, image/jpeg"
              onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                dispatch({ type: "add image", imageBlob: e.target.files![0] });
              }}
              disabled={isAttachmentsDisabled}
            />
            <AttachmentsIcon />
          </div>
          <button ref={postButtonRef}>Post</button>
        </div>
      </form>
    </div>
  );
}

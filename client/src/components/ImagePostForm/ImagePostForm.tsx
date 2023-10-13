import { IImagePostFormParams } from "../../interfaces/interfaces";
import cl from "./ImagePostForm.module.scss";
import { ReactComponent as XIcon } from "../../icons/x.svg";

export default function ImagePostForm({
  image,
  dispatch,
}: IImagePostFormParams) {
  return (
    <div className={cl.imagePostForm}>
      <button
        type="button"
        className={cl.delete}
        onClick={() => dispatch({ type: "delete image", imageObj: image })}
      >
        <XIcon />
      </button>
      <img src={image.url} />
    </div>
  );
}

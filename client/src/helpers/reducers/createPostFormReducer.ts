import { postInitialValue } from "../../components/CreatePostForm/CreatePostForm";
import {
  ICreatePostFormReducerAction,
  ICreatePostFormValues,
} from "../../interfaces/interfaces";

const reducer = (
  draft: ICreatePostFormValues,
  action: ICreatePostFormReducerAction
) => {
  switch (action.type) {
    case "input text":
      return void (draft.text = action.text!);
    case "add image":
      return void draft.images.push(action.imageBlob!);
    case "delete image":
      return void (draft.images = draft.images.filter(
        (image) => image !== action.imageObj!.blob
      ));
    case "reset":
      return postInitialValue;
    default:
      return draft;
  }
};

export default reducer;

import {
  ICreatePostFormValues,
  IFollowToggle,
  ILogInFormValues,
  IUserNameFormValues,
} from "../../interfaces/interfaces";

export default function getFormDataFromInputs(
  data:
    | IUserNameFormValues
    | ILogInFormValues
    | ICreatePostFormValues
    | IFollowToggle
) {
  

  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
      formData.append;
    } else {
      formData.append(key, value);
    }
  }
  

  return formData;
}

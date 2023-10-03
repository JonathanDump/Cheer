import {
  ICreatePostFormValues,
  ILogInFormValues,
  IUserNameFormValues,
} from "../../interfaces/interfaces";

export default function getFormDataFromInputs(
  data: IUserNameFormValues | ILogInFormValues | ICreatePostFormValues
) {
  console.log("data", data);

  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    console.log("key value", key, value);
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
      formData.append;
    } else {
      formData.append(key, value);
    }
  }
  console.log("form data", formData);

  return formData;
}

import {
  ILogInFormValues,
  IUserNameFormValues,
} from "../interfaces/interfaces";

export default function getFormDataFromInputs(
  data: IUserNameFormValues | ILogInFormValues
) {
  console.log("data", data);

  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    console.log("key value", key, value);

    formData.append(key, value);
  }
  console.log("form data", formData);

  return formData;
}

import { fetcher } from "../../helpers/fetcher/fetcher";
import { IUserNameInputParams } from "../../interfaces/interfaces";

export default function UserNameInput({
  isDefaultUserName,
  inputClass,
  register,
  getValues,
}: IUserNameInputParams) {
  return (
    <>
      <label htmlFor="userName">User name</label>
      <input
        className={inputClass}
        {...register("userName", {
          required: true,

          minLength: { value: 4, message: "Minimum length is 4 characters" },
          maxLength: {
            value: 15,
            message: "Maximum length is 15 characters",
          },
          pattern: {
            value: /^[a-zA-Z0-9_]+$/,
            message:
              "User name should contain only letters, numbers and underscores",
          },
          validate: {
            isExist: async () => {
              if (isDefaultUserName) {
                return;
              }

              const result = await fetcher.get.isUserNameExists(
                getValues("userName")
              );

              return !result.userNameExists || "User name is already exists";
            },
          },
        })}
      />
    </>
  );
}

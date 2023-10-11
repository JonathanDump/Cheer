import { useForm } from "react-hook-form";
import cl from "./UserNameForm.module.scss";
import { ErrorMessage } from "@hookform/error-message";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  IUserNameFormParams,
  IUserNameFormValues,
} from "../../interfaces/interfaces";
import { fetcher } from "../../helpers/fetcher/fetcher";
import UserNameInput from "../UserNameInput/UserNameInput";

export default function UserNameForm({
  setIsUserNameFormVisible,
}: IUserNameFormParams) {
  const defaultUserName = JSON.parse(localStorage.getItem("user")!).userName;

  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<IUserNameFormValues>({
    defaultValues: { userName: defaultUserName },
    mode: "all",
    criteriaMode: "all",
  });

  const navigate = useNavigate();

  const inputClass =
    !!errors.userName?.message && getValues("userName").length
      ? cl.invalid
      : !errors.userName?.message && getValues("userName").length
      ? cl.valid
      : "";

  const setUserNameMutation = useMutation({
    mutationFn: fetcher.post.setUserName,
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: async (data) => {
      const result = await data.json();
      console.log("result", result);
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      setIsUserNameFormVisible(false);
      navigate("/home");
    },
  });

  const isDefaultUserName = () => {
    return defaultUserName === getValues("userName");
  };

  const onSubmit = (data: IUserNameFormValues) => {
    if (isDefaultUserName()) {
      setIsUserNameFormVisible(false);
      return navigate("/home");
    }
    setUserNameMutation.mutate(data.userName);
  };

  return (
    <div className={cl.userNameForm}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* <label htmlFor="userName">User name</label>
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
                if (isDefaultUserName()) {
                  return;
                }

                const result = await fetcher.get.isUserNameExists(
                  getValues("userName")
                );

                return !result.userNameExists || "User name is already exists";
              },
            },
          })}
        /> */}
        <UserNameInput
          isDefaultUserName={isDefaultUserName()}
          inputClass={inputClass}
          register={register}
          getValues={getValues}
        />
        <ErrorMessage
          errors={errors}
          name="userName"
          render={({ messages }) =>
            messages &&
            Object.entries(messages).map(([type, message]) => (
              <p key={type}>{message}</p>
            ))
          }
        />
        <button disabled={!isValid}>Submit</button>
      </form>
    </div>
  );
}

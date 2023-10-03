import { useForm } from "react-hook-form";
import cl from "./UserNameForm.module.scss";
import { SERVER_URL } from "../../config/config";
import { ErrorMessage } from "@hookform/error-message";
import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  IUserNameFormParams,
  IUserNameFormValues,
} from "../../interfaces/interfaces";

export default function UserNameForm({
  setIsUserNameFormVisible,
}: IUserNameFormParams) {
  const defaultUserName = JSON.parse(localStorage.getItem("user")!).userName;

  const {
    register,
    getValues,
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
  } = useForm<IUserNameFormValues>({
    defaultValues: { userName: defaultUserName },
    mode: "all",
    criteriaMode: "all",
  });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const navigate = useNavigate();

  const inputClass =
    !!errors.userName?.message && getValues("userName").length
      ? cl.invalid
      : !errors.userName?.message && getValues("userName").length
      ? cl.valid
      : "";

  const setUserNameMutation = useMutation({
    mutationFn: (userName: string) => {
      return fetch(`${SERVER_URL}/sign-up/set-user-name`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          userId: localStorage.getItem("userId"),
        }),
      });
    },
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: async (data) => {
      const result = await data.json();
      console.log("result", result);
      localStorage.setItem("user", JSON.stringify(result.user));

      setIsUserNameFormVisible(false);
      navigate("/home");
    },
  });

  useEffect(() => {
    buttonRef.current!.disabled =
      !!errors.userName?.message || getValues("userName").length === 0;
  }, [errors.userName?.message, isSubmitSuccessful]);

  const onSubmit = (data: IUserNameFormValues) => {
    if (isDefaultUserName()) {
      setIsUserNameFormVisible(false);
      return navigate("/home");
    }
    setUserNameMutation.mutate(data.userName);
  };

  const isDefaultUserName = () => {
    return defaultUserName === getValues("userName");
  };

  return (
    <div className={cl.userNameForm}>
      <form onSubmit={handleSubmit(onSubmit)}>
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
                if (isDefaultUserName()) {
                  return;
                }
                const response = await fetch(`${SERVER_URL}/check-user-name`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    userName: getValues("userName"),
                  }),
                });

                const result = await response.json();

                return !result.userNameExists || "User name is already exists";
              },
            },
          })}
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
        <button ref={buttonRef}>Submit</button>
      </form>
    </div>
  );
}

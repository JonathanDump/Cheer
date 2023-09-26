import { useForm } from "react-hook-form";
import cl from "./UserNameForm.module.scss";
import { SERVER_URL } from "../../config/config";
import { ErrorMessage } from "@hookform/error-message";
import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";

interface formValues {
  userName: string;
}

export default function UserNameForm() {
  const {
    register,
    getValues,
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
    reset,
  } = useForm<formValues>({
    defaultValues: { userName: "" },
    mode: "all",
    criteriaMode: "all",
  });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const inputClass =
    !!errors.userName?.message && getValues("userName").length
      ? cl.invalid
      : !!!errors.userName?.message && getValues("userName").length
      ? cl.valid
      : "";

  const setUserNameMutation = useMutation({
    mutationFn: async (userName: string) => {
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

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", result.user);
    },
  });

  useEffect(() => {
    console.log(
      "button",
      !!errors.userName?.message,
      getValues("userName").length === 0
    );

    buttonRef.current!.disabled =
      !!errors.userName?.message || getValues("userName").length === 0;
  }, [errors.userName, isSubmitSuccessful]);

  useEffect(() => {
    reset({
      userName: "",
    });
  }, [isSubmitSuccessful]);

  const onSubmit = (data: formValues) => {
    setUserNameMutation.mutate(data.userName);
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

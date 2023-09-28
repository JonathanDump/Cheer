import { Controller, useForm } from "react-hook-form";
import cl from "./SignUp.module.scss";
import { ISignUpFormValues } from "../../interfaces/interfaces";
import { useEffect, useRef } from "react";
import AvatarInput from "../../components/AvatarInput/AvatarInput.tsx";
import useSetIsUserNameFormVisible from "../../hooks/useSetIsUserNameFormVisible";
import { useMutation } from "@tanstack/react-query";
import { SERVER_URL } from "../../config/config";
import GoogleButton from "../../components/GoogleButton/GoogleButton";

export default function SignUp() {
  const {
    register,
    formState: { errors, isSubmitted },
    getValues,
    handleSubmit,
    reset,
    control,
  } = useForm<ISignUpFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: null,
    },
    mode: "onChange",
  });
  const { setIsUserNameFormVisible } = useSetIsUserNameFormVisible();
  const avatarImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    reset();
  }, [isSubmitted, reset]);

  const signUpMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return fetch(`${SERVER_URL}/sign-up`, {
        method: "POST",
        body: data,
      });
    },
    onError: (err) => {
      console.log(err);
    },
    onSuccess: async (data: Response) => {
      const result = await data.json();
      console.log("mutation result", result);
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", result.token);
      setIsUserNameFormVisible(true);
    },
  });

  const onSubmit = (data: ISignUpFormValues) => {
    console.log(data);

    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      console.log("key, value", key, value);
      formData.append(key, value);
    }

    signUpMutation.mutate(formData);
  };

  return (
    <div className={cl.signUp}>
      <div className={cl.formContainer}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={cl.inputContainer}>
            <label htmlFor="name">Name*</label>
            <input
              id="name"
              required
              {...register("name", {
                maxLength: {
                  value: 50,
                  message: "Max length is 50 characters.",
                },
                validate: (value) => !!value.trim() || "Incorrect name.",
              })}
            />
          </div>
          <div className={cl.inputContainer}>
            <label htmlFor="email">Email*</label>
            <input id="email" type="email" required {...register("email")} />
          </div>
          <div className={cl.inputContainer}>
            <label htmlFor="password">Password*</label>
            <input
              id="password"
              type="password"
              required
              {...register("password", {
                minLength: {
                  value: 8,
                  message: "Make shure password is at least 8 characters long.",
                },
                maxLength: {
                  value: 128,
                  message:
                    "Your password needs to be less than 128 characters. Please enter a shorter one.",
                },
                pattern: {
                  value: /.*\d+.*/,
                  message: "Password must contain numbers",
                },
              })}
            />
            {errors.password?.message && <div>{errors.password?.message}</div>}
          </div>
          <div className={cl.inputContainer}>
            <label htmlFor="confirmPassword">Confirm password*</label>
            <input
              id="confirmPassword"
              type="password"
              required
              {...register("confirmPassword", {
                validate: {
                  checkPassword: (value) => {
                    console.log("value", value);
                    const pass = getValues("password");
                    console.log("pass", pass);
                    console.log("value", value);

                    return value == pass || "Password doesn't match";
                  },
                },
              })}
            />
            {isSubmitted && <div>{errors.confirmPassword?.message}</div>}
          </div>

          <Controller
            control={control}
            name="avatar"
            render={({ field: { onChange, value } }) => {
              return (
                <AvatarInput
                  avatarImageRef={avatarImageRef}
                  onChange={onChange}
                  value={value}
                />
              );
            }}
          />

          <button>Sign up</button>
        </form>
        <div>or</div>
        <GoogleButton />
      </div>
    </div>
  );
}

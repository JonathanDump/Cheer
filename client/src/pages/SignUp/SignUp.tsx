import { Controller, useForm } from "react-hook-form";
import form from "../../scss/form.module.scss";
import { ISignUpFormValues } from "../../interfaces/interfaces";
import { useEffect } from "react";
import AvatarInput from "../../components/AvatarInput/AvatarInput.tsx";
import useSetIsUserNameFormVisible from "../../hooks/useSetIsUserNameFormVisible";
import { useMutation } from "@tanstack/react-query";
import { SERVER_URL } from "../../config/config";
import GoogleButton from "../../components/GoogleButton/GoogleButton";
import getFormDataFromInputs from "../../helpers/functions/getFormDataFromInputs";
import { Link, useNavigate } from "react-router-dom";
import getItemFromLocalStorage from "../../helpers/functions/getItemFromLocalStorage";

export default function SignUp() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = getItemFromLocalStorage<string>("token");
    if (token) {
      navigate("/home");
    }
  }, []);

  const {
    register,
    formState: { errors, isSubmitted, isValid },
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

  useEffect(() => {
    if (isValid) {
      reset();
    }
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

      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", result.token);
      setIsUserNameFormVisible(true);
    },
  });

  const onSubmit = (data: ISignUpFormValues) => {
    const formData = getFormDataFromInputs(data);

    signUpMutation.mutate(formData);
  };

  return (
    <div className={form.main}>
      <div className={form.logo}>Cheer</div>
      <div className={form.formContainer}>
        <div className={form.action}>Sign up</div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="inputContainer">
            <label htmlFor="name">Name*</label>
            <input
              id="name"
              required
              {...register("name", {
                maxLength: {
                  value: 50,
                  message: "Max length is 50 characters.",
                },
                validate: (value: string) =>
                  !!value.trim() || "Incorrect name.",
              })}
            />
            {isSubmitted && errors.name?.message && (
              <div>{errors.name.message}</div>
            )}
          </div>
          <div className="inputContainer">
            <label htmlFor="email">Email*</label>
            <input id="email" type="email" required {...register("email")} />
          </div>
          <div className="inputContainer">
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
          <div className="inputContainer">
            <label htmlFor="confirmPassword">Confirm password*</label>
            <input
              id="confirmPassword"
              type="password"
              required
              {...register("confirmPassword", {
                validate: {
                  checkPassword: (value) => {
                    const pass = getValues("password");

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
            render={({ field: { onChange } }) => {
              return <AvatarInput onChange={onChange} />;
            }}
          />

          <button className={form.btn}>Sign up</button>
        </form>
        <div>or</div>
        <GoogleButton />
        <div className={form.buttons}>
          <div className={form.text}>
            Already have an account?{" "}
            <Link to={"/log-in"} className={form.link}>
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

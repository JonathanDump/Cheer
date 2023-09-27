import { Controller, useForm } from "react-hook-form";
import cl from "./SignUp.module.scss";
import { ISignUpFormValues } from "../../interfaces/interfaces";
import { useEffect, useRef } from "react";
import AvatarInput from "../../components/AvatarInput/AvatarInput.tsx";

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

  const avatarImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    reset();
  }, [isSubmitted, reset]);

  // const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const reader = new FileReader();
  //   reader.readAsDataURL(e.target.files![0]);

  //   reader.addEventListener("load", () => {
  //     avatarImageRef.current!.src = reader.result as string;
  //   });
  // };

  const onSubmit = (data: ISignUpFormValues) => {
    console.log(data);
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
          {/* <div className={cl.inputContainer}>
            <input
              id="avatar"
              type="file"
              // style={{ display: "none" }}
              {...register("avatar", {
                onChange: handleAvatarChange,
              })}
            />
            <div className={cl.imageContainer}>
              <img src="" alt="" ref={avatarImageRef} />
            </div>
          </div> */}
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
      </div>
    </div>
  );
}

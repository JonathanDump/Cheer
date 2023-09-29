import { useForm } from "react-hook-form";
import cl from "./LogIn.module.scss";
import GoogleButton from "../../components/GoogleButton/GoogleButton";
import { useMutation } from "@tanstack/react-query";
import { SERVER_URL, socket } from "../../config/config";
import getFormDataFromInputs from "../../helpers/getFormDataFromInputs";
import { ILogInData, ILogInFormValues } from "../../interfaces/interfaces";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LogIn() {
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm<ILogInFormValues>({ defaultValues: { email: "", password: "" } });
  const [isMagicLinkSent, setIsMagicLinkSet] = useState(false);
  const navigate = useNavigate();
  const logInMutation = useMutation({
    mutationFn: (data: FormData) => {
      return fetch(`${SERVER_URL}/log-in`, {
        method: "POST",
        body: data,
      });
    },
    onSuccess: async (data) => {
      const result = await data.json();
      const invalid = result.invalid as Record<"email" | "password", boolean>;
      if (invalid) {
        for (const [key, value] of Object.entries(invalid)) {
          if (value) {
            setError(key as "email" | "password", {
              type: "manual",
              message: `Invalid ${key}`,
            });
          }
        }
      } else {
        console.log("log in result", result);

        socket.connect();

        socket.on("connect", () => {
          console.log("connected to the server");
        });

        socket.emit("user id", result.user._id);
        setIsMagicLinkSet(true);

        socket.on(
          "receive log in data",
          ({ token, userPayload }: ILogInData) => {
            console.log("received log in data", token, userPayload);

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userPayload));
            navigate("/home");
          }
        );
      }
    },
  });

  const onSubmit = (data: ILogInFormValues) => {
    console.log("input values", data);

    const formData = getFormDataFromInputs(data);
    logInMutation.mutate(formData);
  };

  if (isMagicLinkSent) {
    return (
      <div className={cl.logIn}>
        <div className={cl.formContainer}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={cl.message}>
              Verification link is sent to {getValues("email")}. <br />
              In order to proceed open the link.
            </div>
            <div>
              {logInMutation.isLoading ? (
                "Loading..."
              ) : (
                <>
                  <button>Send new link</button> if something went wrong
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={cl.logIn}>
      <div className={cl.formContainer}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={cl.inputContainer}>
            <label htmlFor="email">Email</label>
            <input type="email" required {...register("email")} />
            {errors.email && <div>{errors.email.message}</div>}
          </div>
          <div className={cl.inputContainer}>
            <label htmlFor="password">Password</label>
            <input type="password" required {...register("password")} />
            {errors.password && <div>{errors.password.message}</div>}
          </div>
          <button>Submit</button>
        </form>

        <div>Or</div>
        <GoogleButton />
      </div>
    </div>
  );
}

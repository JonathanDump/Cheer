import { useForm } from "react-hook-form";
import cl from "./LogIn.module.scss";
import GoogleButton from "../../components/GoogleButton/GoogleButton";
import { useMutation } from "@tanstack/react-query";
import { socket } from "../../config/config";
import getFormDataFromInputs from "../../helpers/functions/getFormDataFromInputs";
import { ILogInData, ILogInFormValues } from "../../interfaces/interfaces";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetcher } from "../../helpers/fetcher/fetcher";
import getItemFromLocalStorage from "../../helpers/functions/getItemFromLocalStorage";

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

  useEffect(() => {
    const token = getItemFromLocalStorage<string>("token");
    if (token) {
      navigate("/home");
    }
  }, []);

  const logInMutation = useMutation({
    mutationFn: fetcher.post.logIn,
    onSuccess: async (data) => {
      const result = await data.json();
      const invalid = result.invalid as Record<"email" | "password", boolean>;
      const { isTestUser, token, user } = result;
      if (invalid) {
        for (const [key, value] of Object.entries(invalid)) {
          if (value) {
            setError(key as "email" | "password", {
              type: "manual",
              message: `Invalid ${key}`,
            });
          }
        }
      } else if (isTestUser) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/home");
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

  const handleLogInWithTestAccount = () => {
    const formData = new FormData();
    formData.append("email", "test@test.com");
    formData.append("password", "testpassword123");
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
        <button type="button" onClick={handleLogInWithTestAccount}>
          Log In With Test Account
        </button>
      </div>
      <div className={cl.text}>
        Don't have an account?{" "}
        <Link to={"/sign-up"} className={cl.link}>
          Sign Up
        </Link>
      </div>
    </div>
  );
}

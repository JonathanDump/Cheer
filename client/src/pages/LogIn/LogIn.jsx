import { useForm } from "react-hook-form";
import cl from "./LogIn.module.scss";
import form from "../../scss/form.module.scss";
import GoogleButton from "../../components/GoogleButton/GoogleButton";
import { useMutation } from "@tanstack/react-query";
import { socket } from "../../config/config";
import getFormDataFromInputs from "../../helpers/functions/getFormDataFromInputs";
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
  } = useForm({ defaultValues: { email: "", password: "" } });
  const [isMagicLinkSent, setIsMagicLinkSet] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getItemFromLocalStorage("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const logInMutation = useMutation({
    mutationFn: fetcher.post.logIn,
    onSuccess: async (data) => {
      const result = await data.json();
      const invalid = result.invalid;
      const { isTestUser, token, user } = result;
      if (invalid) {
        for (const [key, value] of Object.entries(invalid)) {
          if (value) {
            setError(key, {
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
        socket.connect();

        socket.on("connect", () => {});

        socket.emit("user id", result.user._id);
        setIsMagicLinkSet(true);

        socket.on("receive log in data", ({ token, userPayload }) => {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(userPayload));
          navigate("/home");
        });
      }
    },
  });

  const onSubmit = (data) => {
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
      <div className={form.main}>
        <div className={form.formContainer}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={form.messageMain}>
              Verification link is sent to {getValues("email")}. <br />
              In order to proceed open the link.
            </div>
            <div className={form.message}>
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
    <div className={form.main}>
      <div className={form.logo}>Cheer</div>

      <div className={form.formContainer}>
        <div className={form.action}>Log in</div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="inputContainer">
            <label htmlFor="email">Email</label>
            <input type="email" required {...register("email")} />
            {errors.email && <div>{errors.email.message}</div>}
          </div>
          <div className="inputContainer">
            <label htmlFor="password">Password</label>
            <input type="password" required {...register("password")} />
            {errors.password && <div>{errors.password.message}</div>}
          </div>
          <button className={form.btn}>Submit</button>
        </form>

        <div className={form.buttons}>
          <div>or</div>
          <GoogleButton />
          <button type="button" onClick={handleLogInWithTestAccount}>
            Log In With Test Account
          </button>

          <div className={form.text}>
            Don't have an account?{" "}
            <Link to={"/sign-up"} className={cl.link}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

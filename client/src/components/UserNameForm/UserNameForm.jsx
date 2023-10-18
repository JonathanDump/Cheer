import { useForm } from "react-hook-form";
import cl from "./UserNameForm.module.scss";
import formCl from "../../scss/form.module.scss";
import { ErrorMessage } from "@hookform/error-message";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetcher } from "../../helpers/fetcher/fetcher";
import UserNameInput from "../UserNameInput/UserNameInput";

export default function UserNameForm({ setIsUserNameFormVisible }) {
  const defaultUserName = JSON.parse(localStorage.getItem("user")).userName;

  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({
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

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      setIsUserNameFormVisible(false);
      navigate("/home");
    },
  });

  const isDefaultUserName = () => {
    return defaultUserName === getValues("userName");
  };

  const onSubmit = (data) => {
    if (isDefaultUserName()) {
      setIsUserNameFormVisible(false);
      return navigate("/home");
    }
    setUserNameMutation.mutate(data.userName);
  };

  return (
    <div className={cl.userNameForm}>
      <div className={formCl.main}>
        <div className={formCl.formContainer}>
          <form onSubmit={handleSubmit(onSubmit)}>
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
      </div>
    </div>
  );
}

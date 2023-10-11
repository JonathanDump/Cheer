import { Controller, useForm } from "react-hook-form";
import AvatarInput from "../../components/AvatarInput/AvatarInput";
import cl from "./EditProfile.module.scss";
import getItemFromLocalStorage from "../../helpers/functions/getItemFromLocalStorage";
import { IEditProfileInputs, IUser } from "../../interfaces/interfaces";
import UserNameInput from "../../components/UserNameInput/UserNameInput";
import getFormDataFromInputs from "../../helpers/functions/getFormDataFromInputs";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetcher } from "../../helpers/fetcher/fetcher";

export default function EditProfile() {
  const user = getItemFromLocalStorage("user") as IUser;
  const token = getItemFromLocalStorage("token") as string;
  console.log("token ", token);
  const {
    register,
    formState: { errors, isValid },
    getValues,
    handleSubmit,
    control,
  } = useForm<IEditProfileInputs>({
    defaultValues: {
      name: user.name,
      userName: user.userName,
      bio: user.bio,
    },
  });
  const inputClass =
    !!errors.userName?.message && getValues("userName").length
      ? cl.invalid
      : !errors.userName?.message && getValues("userName").length
      ? cl.valid
      : "";

  const navigate = useNavigate();

  const editUserMutation = useMutation({
    mutationFn: (data: formData) => {
      return fetcher.put.editUser(data, token);
    },
    onSuccess: async (data: Response) => {
      if (!data.ok) {
        throw new Error("Could not edit user");
      }

      const result = await data.json();
      console.log("suc result", result);

      console.log("token edit suc", result.token);
      console.log("user edit suc", result.user);

      localStorage.setItem("user", JSON.stringify(result.user as IUser));
      localStorage.setItem("token", result.token as string);

      navigate(`/${result.user.userName}`);
    },
  });

  const onSubmit = (data: IEditProfileInputs) => {
    const formData = getFormDataFromInputs(data);

    editUserMutation.mutate(formData, token);
  };

  console.log("user ", user);
  console.log("user image", user.image);
  return (
    <div className={cl.editProfile}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="avatar"
          render={({ field: { onChange } }) => {
            return <AvatarInput onChange={onChange} image={user.image} />;
          }}
        />
        <div className={cl.inputContainer}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            {...register("name", {
              maxLength: {
                value: 50,
                message: "Max length is 50 characters.",
              },
              validate: (value) => !!value.trim() || "Incorrect name.",
            })}
          />
          {errors.name?.message && <div> {errors.name.message}</div>}
        </div>
        <div className={cl.inputContainer}>
          <UserNameInput
            inputClass={inputClass}
            register={register}
            getValues={getValues}
            isDefaultUserName={user.userName === getValues("userName")}
          />
          {errors.userName?.message && <div> {errors.userName.message}</div>}
        </div>
        <div className={cl.inputContainer}>
          <label htmlFor="bio">Bio</label>
          <input
            type="text"
            id="bio"
            {...register("bio", {
              maxLength: {
                value: 300,
                message: "Max length is 300 characters.",
              },
            })}
          />
          {errors.bio?.message && <div>{errors.bio.message}</div>}
        </div>
        <button
          type="button"
          onClick={() => {
            window.history.back();
          }}
        >
          Go back
        </button>
        <button disabled={!isValid}>Save</button>
      </form>
    </div>
  );
}

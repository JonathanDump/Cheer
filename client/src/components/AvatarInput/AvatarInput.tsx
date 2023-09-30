import { IAvatarInputProps } from "../../interfaces/interfaces";
import cl from "./AvatarInput.module.scss";
import { ChangeEvent } from "react";

export default function AvatarInput({
  avatarImageRef,
  onChange,
}: IAvatarInputProps) {
  const handleAvatarInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    onChange(target.files![0]);
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files![0]);

    reader.addEventListener("load", () => {
      avatarImageRef.current!.src = reader.result as string;
    });
  };

  return (
    <div className={cl.avatarInput}>
      <input id="avatar" type="file" onChange={handleAvatarInputChange} />
      <div className={cl.imageContainer}>
        <img src="" alt="" ref={avatarImageRef} />
      </div>
    </div>
  );
}

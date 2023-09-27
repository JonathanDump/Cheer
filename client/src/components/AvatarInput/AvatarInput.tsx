import { IAvatarInputProps } from "../../interfaces/interfaces";
import cl from "./AvatarInput.module.scss";
import { ChangeEvent } from "react";

export default function AvatarInput({
  avatarImageRef,

  onChange,
}: IAvatarInputProps) {
  return (
    <div className={cl.avatarInput}>
      <input
        id="avatar"
        type="file"
        onChange={(e: ChangeEvent) => {
          const target = e.target as HTMLInputElement;
          onChange(target.files![0]);
          const reader = new FileReader();
          reader.readAsDataURL(e.target.files![0]);

          reader.addEventListener("load", () => {
            avatarImageRef.current!.src = reader.result as string;
          });
        }}
      />
      <div className={cl.imageContainer}>
        <img src="" alt="" ref={avatarImageRef} />
      </div>
    </div>
  );
}

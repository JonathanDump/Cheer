import { IAvatarInputProps } from "../../interfaces/interfaces";
import cl from "./AvatarInput.module.scss";
import { ChangeEvent, useRef } from "react";

export default function AvatarInput({ onChange, image }: IAvatarInputProps) {
  const avatarImageRef = useRef<HTMLImageElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.files![0]);
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files![0]);

    reader.addEventListener("load", () => {
      avatarImageRef.current!.src = reader.result as string;
    });
  };

  const handleImageClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={cl.avatarInput}>
      <input
        id="avatar"
        type="file"
        onChange={handleAvatarInputChange}
        style={{ display: "none" }}
        ref={inputRef}
      />
      <div className={cl.imageContainer} onClick={handleImageClick}>
        <img src={image} alt="" ref={avatarImageRef} />
      </div>
    </div>
  );
}

import { IAvatarInputProps } from "../../interfaces/interfaces";
import cl from "./AvatarInput.module.scss";
import { ChangeEvent, useRef } from "react";

export default function AvatarInput({ onChange, image }: IAvatarInputProps) {
  const avatarImageRef = useRef<HTMLImageElement | null>(null);
  console.log("image", image);
  // if (avatarImageRef.current) {
  //   avatarImageRef.current.src = image ?? "";
  // }
  const handleAvatarInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // const target = e.target;
    onChange(e.target.files![0]);
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
        <img src={image} alt="" ref={avatarImageRef} />
      </div>
    </div>
  );
}

import { format, isThisYear } from "date-fns";
import { IPostCardProps } from "../../interfaces/interfaces";
import cl from "./PostCard.module.scss";

export default function PostCard({ post }: IPostCardProps) {
  const { text, images, date, likes, comments, createdBy } = post;
  const formattedDate = format(
    new Date(date),
    `${isThisYear(date) ? "dd MMM" : "dd MMM yyyy"} `
  );
  return (
    <div className={cl.postCard}>
      <div className={cl.avatarContainer}>
        <img src={createdBy.image} />
      </div>
      <div className={cl.postContent}>
        <div className={cl.meta}>
          <div className={cl.name}>{createdBy.name}</div>
          <div className={cl.userName}>{createdBy.userName}</div>
          <div className={cl.date}>{formattedDate}</div>

          <div className={cl.settings}>
            <button>...</button>
            <div className={cl.dropDown}>
              <div className={cl.edit}>Edit</div>
              <div className={cl.delete}>Delete</div>
            </div>
          </div>
        </div>
        <div className={cl.text}>{text}</div>
        <div className={cl.images}>
          {images.map((img) => (
            <img src={img}></img>
          ))}
        </div>
        <div className={cl.actions}>
          <button className={cl.like}>{likes.length}</button>
          <button className={cl.comment}>{comments.length}</button>
        </div>
      </div>
    </div>
  );
}

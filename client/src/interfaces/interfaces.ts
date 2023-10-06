import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  QueryObserverResult,
  RefetchOptions,
  RefetchPageFilters,
} from "@tanstack/react-query";
import { ControllerProps } from "react-hook-form";

export interface IDecodedJwtGoogle {
  aud: string;
  azp: string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  iat: number;
  iss: string;
  jti: string;
  locale: string;
  name: string;
  nbf: number;
  picture: string;
  sub: string;
}

export interface ISignUpFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatar: ControllerProps | null;
}

export interface IUserNameFormValues {
  userName: string;
}

export interface ILogInFormValues {
  email: string;
  password: string;
}

export interface ISignUpFormData extends Omit<ISignUpFormValues, "avatar"> {
  avatar: Blob;
}

export interface IAvatarInputProps extends ControllerProps {
  avatarImageRef: React.MutableRefObject<HTMLImageElement | null>;
  onChange: (avatar: Blob) => void;
}

export interface IOutletContext {
  setIsUserNameFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface IUserNameFormParams extends IOutletContext {}

export interface IUserPayload {
  name: string;
  email: string;
  userName: string;
  img: string;
  _id: string;
}

export interface ILogInData {
  token: string;
  userPayload: IUserPayload;
}

export interface IUser {
  _id: string;
  name: string;
  userName: string;
  email: string;
  image: string;
  isAdmin?: boolean;
  bio?: string;
  followers?: string[] | number;
  following?: string[] | number;
  posts?: string[];
}

export interface IDecodedJwt {
  iat: number;
  exp: number;
  user: IUser;
}

export interface IAuthProviderProps {
  children: React.ReactNode;
}

export interface IImage {
  blob: Blob;
  url: string;
}
export interface ICreatePostFormValues {
  text: string;
  images: Blob[];
}

export interface IImagePostFormParams {
  image: IImage;
  dispatch: React.Dispatch<ICreatePostFormReducerAction>;
}

export interface ICreatePostFormReducerAction {
  type: string;
  text?: string;
  imageBlob?: Blob;
  imageObj?: IImage;
  initialValue?: ICreatePostFormValues;
}

export interface IPost {
  _id: string;
  text: string;
  images: string[];
  date: string;
  likes: string[];
  comments: string[];
  createdBy: IUser;
}

export interface IPostCardProps {
  post: IPost;
}

export interface ICreatePostFormParams {
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchPageFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<InfiniteData<any>, unknown>>; // eslint-disable-line  @typescript-eslint/no-explicit-any
}

export interface IDecodedJwt {
  exp: number;
  iat: number;
  user: IUser;
}

export interface IUserCardProps {
  user: IUser;
}

export interface IFollowToggle {
  userId: string;
  token: string;
  followAction: string;
}

export interface ILoadPostOnScroll {
  divRef: React.MutableRefObject<HTMLDivElement | null>;
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<InfiniteQueryObserverResult<any, unknown>>; //eslint-disable-line
}

export interface IPostsListParams {
  data: InfiniteData<any> | undefined;
  isFetchingNextPage: boolean;
}

export interface IPostsPage {
  posts: IPost[];
  currentPage: number;
  lastPage: number;
}

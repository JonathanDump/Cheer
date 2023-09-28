import { ControllerProps } from "react-hook-form";

export interface IDecodedJwt {
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
export interface IUserFormNameParams extends IOutletContext {}

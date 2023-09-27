import { ControllerProps, RegisterOptions } from "react-hook-form";

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

// export type AvatarInputProps = Partial<RegisterOptions> & {
//   avatarImageRef: React.MutableRefObject<HTMLImageElement | null>;
// };

// export interface IAvatarInputProps {
//   avatarImageRef: React.MutableRefObject<HTMLImageElement | null>;
//   register: RegisterOptions;
//   handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }

export interface IAvatarInputProps extends ControllerProps {
  avatarImageRef: React.MutableRefObject<HTMLImageElement | null>;
  value: Blob;
  onChange: (Blob) => void;
}

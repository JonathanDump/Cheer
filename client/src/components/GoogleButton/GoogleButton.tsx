import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { IDecodedJwt } from "../../interfaces/interfaces";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../config/config";
import useSetIsUserNameFormVisible from "../../hooks/useSetIsUserNameFormVisible";

export default function GoogleButton() {
  const navigate = useNavigate();
  const { setIsUserNameFormVisible } = useSetIsUserNameFormVisible();
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          const decoded: IDecodedJwt = jwtDecode(
            credentialResponse.credential!
          );
          const { name, email, picture } = decoded;
          const body = {
            name,
            email,
            img: picture,
          };
          const response = await fetch(`${SERVER_URL}/sign-up/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
          const result = await response.json();

          localStorage.setItem("token", result.token);
          localStorage.setItem("user", JSON.stringify(result.user));

          result.isNewUser ? setIsUserNameFormVisible(true) : navigate("/home");
        }}
        onError={() => {}}
      />
    </GoogleOAuthProvider>
  );
}

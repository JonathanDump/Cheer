import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { IDecodedJwt } from "../../interfaces/interfaces";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../config/config";

export default function GoogleButton() {
  const navigate = useNavigate();
  return (
    <GoogleOAuthProvider clientId={import.meta.env.GOOGLE_CLIENT_ID}>
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

          if (!result.token) {
            localStorage.setItem("userId", result.userId);
            ////
          } else {
            localStorage.setItem("token", result.token);
            result.isSuccess ? navigate("/") : new Error("Sign up failed");
          }
        }}
        onError={() => {}}
      />
    </GoogleOAuthProvider>
  );
}

// Imports the useRecoilValue hook from Recoil.
// This hook is used to read the current value of a Recoil atom or selector without setting it.
// Imports the authScreenAtom we created earlier (stores 'login' or 'signup' state).

// Defines a functional component named AuthPage.
//   Reads the current value of authScreenAtom.
//   authScreenState will be 'login' or 'signup' depending on the state.
    
import { useRecoilValue } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import LoginCard from "../components/LoginCard";
import SignupCard from "../components/SignupCard";

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);
  return <>{authScreenState === "login" ? <LoginCard /> : <SignupCard />}</>;
};

export default AuthPage;

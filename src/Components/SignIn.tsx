import React from "react";
import "../App.css";
import Button from "@mui/material/Button";

interface Props {
    signInWithGoogle: () => void;
};

const SignInWithGoogleButton = ( props:Props ) => {
  return (
    <Button className="sign-in-with-google-button" onClick={props.signInWithGoogle}>
      <img
        className="google-logo"
        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
        alt="Google logo"
      />
      <span className="button-text">Sign in with Google</span>
    </Button>
  );
};

export default SignInWithGoogleButton;
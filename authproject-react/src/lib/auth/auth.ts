import { Auth, CognitoUser } from "@aws-amplify/auth";
import { userPoolConfig } from "./config";

Auth.configure(userPoolConfig);

export class MFASetupRequiredError extends Error {
  user: CognitoUser;
  code: string;
  secret: string;

  constructor(user: CognitoUser, secret: string) {
    const message = "MFA Setup is required";
    super(message);
    this.name = "MFASetupRequiredError";
    this.code = "MFASetupRequiredError";
    this.user = user;
    this.secret = secret;
  }
}
export class MFACodeRequiredError extends Error {
  user: CognitoUser;
  code: string;

  constructor(user: CognitoUser) {
    const message = "MFA Code is required";
    super(message);
    this.code = "MFACodeRequiredError";
    this.name = "MFACodeRequiredError";
    this.user = user;
  }
}
export class NewPasswordRequiredError extends Error {
  user: CognitoUser;

  constructor(user: CognitoUser) {
    const message = "New Password Required";
    super(message);
    this.name = "NewPasswordRequiredError";
    this.user = user;
  }
}

export async function signUp(email: string, password: string) {
  const username = email; // We use emails for usernames around here!
  try {
    const { user } = await Auth.signUp({
      username,
      password,
      attributes: {
        email,
      },
      autoSignIn: {
        // optional - enables auto sign in after user is confirmed
        enabled: true,
      },
    });
    return user;
  } catch (error) {
    throw error;
  }
}

export async function resendConfirmationCode(username: string) {
  try {
    return await Auth.resendSignUp(username);
  } catch (error) {
    throw error;
  }
}

export async function confirmSignUp(username: string, code: string) {
  try {
    return await Auth.confirmSignUp(username, code);
  } catch (error) {
    throw error;
  }
}

export async function verifyTOTP(user: any, secret: string) {
  try {
    await Auth.verifyTotpToken(user, secret);
    await Auth.setPreferredMFA(user, "TOTP");
  } catch (error) {
    throw error;
  }
}

export async function handleForcedPasswordReset(
  user: any,
  newPassword: string
) {
  try {
    return await Auth.completeNewPassword(user, newPassword);
  } catch (error) {
    throw error;
  }
}

export async function signIn(username: string, password: string) {
  try {
    const user = await Auth.signIn(username, password);

    if (user.challengeName === "SOFTWARE_TOKEN_MFA") {
      throw new MFACodeRequiredError(user);
    } else if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
      throw new NewPasswordRequiredError(user);
    } else if (user.challengeName === "MFA_SETUP") {
      const code = await Auth.setupTOTP(user);
      throw new MFASetupRequiredError(user, code);
    } else {
      // Signin the User
    }
  } catch (err: any) {
    if (err.name === "MFASetupRequiredError") {
      // The user needs to setup TOTP before continuing
      throw err;
    } else if (err.name === "MFACodeRequiredError") {
      // The user is required to provide an TOTP secret when logging in
      throw err;
    } else if (err.name === "NewPasswordRequiredError") {
      // The user is forced to change their password on first login
      throw err;
    } else if (err.code === "UserNotConfirmedException") {
      // The user didn't finish the confirmation step when signing up
      err.name = "UserNotConfirmedException";
      throw err;
    } else if (err.code === "PasswordResetRequiredException") {
      // The error happens when the password is reset in the Cognito console
      // In this case you need to call forgotPassword to reset the password
      err.name = "PasswordResetRequiredException";
      throw err;
    } else if (err.code === "NotAuthorizedException") {
      // The error happens when the incorrect password is provided
      err.name = "NotAuthorizedException";
      throw err;
    } else if (err.code === "UserNotFoundException") {
      // The error happens when the supplied username/email does not exist in the Cognito user pool
      err.name = "UserNotFoundException";
      throw err;
    } else {
      throw err;
    }
  }
}

export async function confirmSignInWithMfa(user: any, code: string) {
  try {
    return await Auth.confirmSignIn(user, code, "SOFTWARE_TOKEN_MFA"); // SMS_MFA also valid, but not used by this app
  } catch (error) {
    throw error;
  }
}

export async function startForgetPasswordFlow(email: string) {
  try {
    return await Auth.forgotPassword(email);
  } catch (error) {
    throw error;
  }
}

export async function setNewForgottenPassword(
  email: string,
  code: string,
  newPassword: string
) {
  try {
    return await Auth.forgotPasswordSubmit(email, code, newPassword);
  } catch (error) {
    throw error;
  }
}

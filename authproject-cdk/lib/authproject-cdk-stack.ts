import * as cdk from "aws-cdk-lib";
import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as ssm from "aws-cdk-lib/aws-ssm";

export interface AuthprojectCdkStackProps extends StackProps {
  readonly applicationName: string;
}

export class AuthprojectCdkStack extends Stack {
  constructor(scope: Construct, id: string, props: AuthprojectCdkStackProps) {
    super(scope, id, props);

    const coreUserPool = new cognito.UserPool(this, "coreUserPool", {
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      autoVerify: { email: true },
      deletionProtection: true,
      enableSmsRole: false,
      keepOriginal: { email: true },
      mfa: cognito.Mfa.REQUIRED,
      mfaSecondFactor: {
        sms: false,
        otp: true,
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: false,
        requireUppercase: false,
        requireDigits: false,
        requireSymbols: false,
        tempPasswordValidity: cdk.Duration.days(7),
      },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
        phone: false,
        preferredUsername: false,
        username: false,
      },
      signInCaseSensitive: false,
      userInvitation: {
        emailSubject: `Welcome to ${props.applicationName}`,
        emailBody: `Welcome {username} you have been invited to join ${props.applicationName} your temporary password is {####}`,
      },
      userVerification: {
        emailSubject: `Verify your email for ${props.applicationName}`,
        emailBody: `Welcome to ${props.applicationName} your verification code is {####}`,
      },
    });

    const coreUserPoolDomain = new cognito.UserPoolDomain(
      this,
      "coreUserPoolDomain",
      {
        userPool: coreUserPool,
        cognitoDomain: {
          domainPrefix: `${
            this.account
          }-${props.applicationName.toLocaleLowerCase()}`,
        },
      }
    );

    const devDesktopClient = new cognito.UserPoolClient(
      this,
      "devDesktopClient",
      {
        userPool: coreUserPool,
        accessTokenValidity: cdk.Duration.minutes(60),
        authFlows: {
          userSrp: true,
          custom: true,
          adminUserPassword: false,
          userPassword: false,
        },
        authSessionValidity: cdk.Duration.minutes(5),
        disableOAuth: false,
        enableTokenRevocation: true,
        generateSecret: false,
        idTokenValidity: cdk.Duration.minutes(60),
        oAuth: {
          callbackUrls: ["http://localhost:3000/oauth/callback"],
          flows: {
            authorizationCodeGrant: true,
            implicitCodeGrant: false,
            clientCredentials: false,
          },
          scopes: [
            cognito.OAuthScope.OPENID,
            cognito.OAuthScope.EMAIL,
            cognito.OAuthScope.PROFILE,
          ],
        },
        preventUserExistenceErrors: true,
        refreshTokenValidity: cdk.Duration.days(30),
      }
    );

    new CfnOutput(this, "coreUserPoolId", {
      value: coreUserPool.userPoolId,
    });
    new CfnOutput(this, "coreUserPoolArn", {
      value: coreUserPool.userPoolArn,
    });
    new CfnOutput(this, "devDesktopClientId", {
      value: devDesktopClient.userPoolClientId,
    });
    new CfnOutput(this, "coreUserPoolBaseUrl", {
      value: coreUserPoolDomain.baseUrl(),
    });
  }
}

#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { AuthprojectCdkStack } from "../lib/authproject-cdk-stack";

const app = new cdk.App();
new AuthprojectCdkStack(app, "AuthprojectCdkStack", {
  applicationName: "AuthProject",
});

#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
//import { InfraStack } from '../lib/infra-stack';
//import { S3Stack } from '../lib/s3-stack';
import { AwsEnv, LinzAccountName, AwsAccounts } from "@linz/accounts";
import { SupportStack } from "../lib/support-stack";
//import { CertProviderStack } from "@linz/cert-provider";

import { StepCDPipelineStack } from "@linz/ecs-continuous-deployment";

import { StepGithubCIRoleStack } from '@linz/step-utils';

const app = new cdk.App();
const appName = "reacttest-app";
const config = {
  nonprod: {
    environmentName: "non-prod",
    recordNamePrefix: appName,
    certDomainPrefix: appName,
    //paramStorePrefix: "/lolite-dealing/nonprod",
    tag: "latest",
    nextTag: undefined,
    environmentType: AwsEnv.NonProduction,
    serviceName: appName,
    containerPort: 8081,
    path: "/",
    ecrRole:
      "arn:aws:iam::725496895483:role/cross-account-pipeline-ecr-role-725496895483",
    imageRepoName: "react-test-app"
  },
};

Object.entries(config).map(([key, values]) => {
  new SupportStack(app, `${key}-${appName}-support-stack`, {
    certDomain: `${values.certDomainPrefix}.${key}.enablement.awsint.linz.govt.nz`,
    environmentType: values.environmentType,
  });

  // new CertProviderStack(app, `${key}-reacttest-app-cert`, {
  //   certDomain: `${values.recordNamePrefix}.${values.environmentName}.enablement.awsint.linz.govt.nz`,
  // });

  const certArn = cdk.Fn.importValue(`nonprod-${appName}-certificate-arn`); //nonprod-reacttest-app-certificate-arn

  new StepCDPipelineStack(app, `${key}-reacttest-app`, {
    certificateArn: certArn,
    recordName: values.recordNamePrefix,
    SquadName: LinzAccountName.StepEnablement,
    loadBalancerName: `${values.recordNamePrefix}-${values.environmentName}`,
    pipelines: [
      {
        imageRepoTag: values.tag,
        imageRepoName: values.imageRepoName,
        crossAccountEcrRole: values.ecrRole,
        nextImageRepoTag: values.nextTag,
        serviceName: values.serviceName,
        path: values.path,
        healthCheckEndpoint: "/health",
        containerPort: values.containerPort,
        containerEnvironment: [],
        containerSecrets: [],
      },
    ],
  });
});

// new S3Stack(app, 'S3Stack');

new StepGithubCIRoleStack(app, 'reacttest-app-role', {
  applicationName: 'reacttest-app',
  env: {
      account: AwsAccounts.byNameEnv(LinzAccountName.StepEnablement, AwsEnv.Production).id,
      region: "ap-southeast-2",
  },
  githubRepo: 'linz/react-test-app',
  pushRepos: [
      // list the repos used by StepCDPipelineStack pipelines
      'step/enablement/reacttest-app',
  ],
});
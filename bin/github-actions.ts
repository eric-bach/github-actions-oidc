#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { GithubActionsStack } from '../lib/github-actions-stack';
import { GitHubStackProps } from '../lib/StackProps';

const app = new cdk.App();

const gitHubProps: GitHubStackProps = {
  repositoryConfig: [
    {
      owner: 'eric-bach',
    },
  ],
};
new GithubActionsStack(app, 'GithubActionsDeploy', gitHubProps);

import {  StackProps } from 'aws-cdk-lib';

export interface GitHubStackProps extends StackProps {
  readonly repositoryConfig: { owner: string; repo? : string; filter?: string }[];
}

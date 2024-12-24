import { Stack, Duration, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { OpenIdConnectProvider, Role, WebIdentityPrincipal, ManagedPolicy, Conditions, ArnPrincipal, CompositePrincipal } from 'aws-cdk-lib/aws-iam';
import { GitHubStackProps } from './StackProps';

export class GithubActionsStack extends Stack {
  constructor(scope: Construct, id: string, props: GitHubStackProps) {
    super(scope, id, props);

    const githubDomain = 'token.actions.githubusercontent.com';

    // Github Open ID Connect Provider
    const githubProvider = new OpenIdConnectProvider(this, 'githubProvider', {
      url: `https://${githubDomain}`,
      clientIds: ['sts.amazonaws.com'],
    });

    // Allows all repo in Github org
    const iamRepoDeployAccess = props.repositoryConfig.map((r) => `repo:${r.owner}/${r.repo ?? '*'}:${r.filter ?? '*'}`);
    // Grant only requests coming from a specific GitHub repository
    const conditions: Conditions = {
      StringLike: {
        [`${githubDomain}:aud`]: 'sts.amazonaws.com',
        [`${githubDomain}:sub`]: iamRepoDeployAccess,
      },
    };

    // Github Actions role
    const actionsRole = new Role(this, 'GitHubActionsDeployRole', {
      assumedBy: new CompositePrincipal(
        new WebIdentityPrincipal(githubProvider.openIdConnectProviderArn, conditions),
        // Added to allow AppSync integration tests to assume a role to run the tests
        new ArnPrincipal(`arn:aws:iam::${this.account}:role/aws-reserved/sso.amazonaws.com/*`)
      ),
      managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')],
      roleName: 'GitHubActionsDeployRole',
      description: 'Used by GitHub Actions to deploy CDK stacks',
      maxSessionDuration: Duration.hours(1),
    });

    /***
     *** Outputs
     ***/

    new CfnOutput(this, 'GithubOpenIdConnectProviderArn', {
      value: githubProvider.openIdConnectProviderArn,
    });

    new CfnOutput(this, 'GitHubActionsRoleArn', {
      value: actionsRole.roleArn,
    });
  }
}

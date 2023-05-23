# Github Actions Open ID Connect Provider

This project deploys a CDK Stack containing 
    - Github Open ID Connect Provider (see [link](https://github.com/aws-actions/configure-aws-credentials#sample-iam-oidc-cloudformation-template))
    - AWS role for Github Actions to deploy CDK stacks

# Getting Started

1. Install dependencies
    npm install

2. Edit the owner in the `bin/github-actions.ts` stack

    ```
    repositoryConfig: [
        {
        owner: 'eric-bach',
        repo: '',
        filter: ''
        },
    ],
    ```

2. Deploy CDK stack
    cdk deploy --profile AWS_PROFILE_NAME

# Configure Github Actions

1. Create a Github secret with the `GitHubActionsRoleArn` from the stack to be used by the [Github Actions file](https://github.com/aws-actions/configure-aws-credentials#assumerolewithwebidentity-recommended)

    ```
    - name: Configure AWS Credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-region: us-east-2
        role-to-assume: arn:aws:iam::123456789100:role/my-github-actions-role
        role-session-name: MySessionName
    ```




![version](https://img.shields.io/github/package-json/v/Julez64/aws-dotenv?style=flat-square)
![license](https://img.shields.io/github/license/Julez64/aws-dotenv?style=flat-square)
![size](https://img.shields.io/github/languages/code-size/Julez64/aws-dotenv?style=flat-square)

# aws-secrets-dotenv :toolbox:

aws-secrets-dotenv is a cli tool that manages the envrionment variables for an application stored in the [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/). The tool can set dotenv variables from your machine to the AWS Secrets Manager and pull them back from AWS to a `.env` file.

## Installation :hammer:

```sh
npm install aws-secrets-dotenv --save-dev
```

## Configuration :gear:

- Add `.secretsrc` to the project root
```json
{
  "name": "My-Project",
  "description": "This project uses aws-secrets-dotenv!",
  "keys": [
    "ENV_VARIABLE",
    "ANOTHER_ENV_VARIABLE"
  ]
}
````

## AWS Authentication

### Using `.awsrc`

- Create `.awsrc`
```json
{
    "accessKeyId": "ACCESS_KEY_ID",
    "secretAccessKey": "SECRET_ACCESS_KEY",
    "region": "us-east-2"
}
```

### Using AWS Configuration
AWS Credentials can be configured using the AWS CLI tool. For additionnal AWS configuration documentation please refer to [Configuration and credential file settings](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

- Configure the AWS account by creating `~/.aws/credentials`
```ini
[default]
aws_access_key_id=access_key_id
aws_secret_access_key=secret_access_key
```

- Configure the AWS region by creating `~/.aws/config`
```ini
[default]
region=ca-central-1
output=json
```

- Create `.env` at the root of the project
```ini
AWS_SDK_LOAD_CONFIG=1
```
AWS_SDK_LOAD_CONFIG allows the tool to use your `~/.aws/` config folder. We recommend to leave it permanently as well as storing the variable inside AWS Secrets Manager.



## Usage :rocket:

```Shell
$ aws-secrets-dotenv (command) (stage)
```

### Available Commands
- pull
- set

### Stages
Default stage is `dev`.

Refers to the development stage of the application. It is used to differentiate the multiple `.env` configurations your project might use at any time. Generally in the form of `dev`, `test` and `prod` but the name does not matter.

### example
Setting up `package.json`
```json
  "scripts": {
    "set-env-dev": "aws-secrets-dotenv set", // Store the environment variables of this machine to AWS Secrets Manager for dev environment.
    "pull-env-dev": "aws-secrets-dotenv pull", // Retrieve the environment variables from AWS Secrets Manager dev envrionment to a .env file in the root folder.
    "set-env-prod": "aws-secrets-dotenv set prod", // Store the environment variables of this machine to AWS Secrets Manager for prod environment.
    "pull-env-prod": "aws-secrets-dotenv pull prod" // Retrieve the environment variables from AWS Secrets Manager prod envrionment to a .env file in the root folder.
  }
````



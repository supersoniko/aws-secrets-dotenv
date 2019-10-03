![npm](https://img.shields.io/npm/v/aws-secrets-dotenv)
![NPM](https://img.shields.io/npm/l/aws-secrets-dotenv)
![David](https://img.shields.io/david/supersoniko/aws-secrets-dotenv.svg)

# aws-secrets-dotenv

aws-secrets-dotenv is a tool that manages your envrionment variables for an application stored in the [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/).

The tool can store envrionment variables from the machine it's run on to the AWS Secrets Manager and retrieve secrets from AWS to a `.env` file which is a standard for a lot of technologies.
This tool is typically used in the build pipeline of an application.

## Installation

```sh
npm install aws-secrets-dotenv --save-dev
```
```js
// .secretsrc
{
  "Name": "MyProject",
  "Description": "My super cool project!",
  "LIST_OF_SECRETS": [
    "DATABASE_URI"
  ]
}
````

## Usage
The default stage is `dev`.
```js
// package.json
  "scripts": {
    "upload-secrets": "aws-secrets-dotenv createOrUpdateSecret prod", // Store the environment variables of this machine to AWS Secrets Manager for prod environment.
    "retrieve-secrets": "aws-secrets-dotenv createLocalEnvironment prod" // Retrieve the environment variables from AWS Secrets Manager prod envrionment to a .env file in the root folder.
  }
````



#!/usr/bin/env node

import fs from 'fs';

import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import secretsManagerFunctionFactory from './secrets-manager';
import getConfig from './get-config';

const secretsManager = new SecretsManagerClient({
	region: process.env.AWS_DEFAULT_REGION,
});
const config = getConfig('secrets');

export const { createLocalEnvironment, createOrUpdateSecret } =
	secretsManagerFunctionFactory(secretsManager, fs, config);

export default secretsManagerFunctionFactory;

export const cli = (args: string[]): void => {
	const command = args.slice(2)[0];
	const stage = args.slice(2)[1];

	switch (command) {
		case 'createOrUpdateSecret':
			createOrUpdateSecret(stage).catch((err) =>
				console.error('An error occured', err),
			);
			break;
		case 'createLocalEnvironment':
			createLocalEnvironment(stage).catch((err) =>
				console.error('An error occured', err),
			);
			break;
		default:
			console.log(
				'Please read the README at https://github.com/supersoniko/aws-secrets-dotenv',
			);
	}
};

#!/usr/bin/env node

import AWS from 'aws-sdk';
import fs from 'fs';
import dotenv from 'dotenv'
import getAWSConfig from './get-awsconfig'

dotenv.config()

if(fs.existsSync(`.awsrc`)) {
	const awsConfig = getAWSConfig('aws')

	AWS.config.update({
		region: awsConfig.region
	})
} else {
	AWS.config.update({ region: process.env.AWS_DEFAULT_REGION });
}



import secretsManagerFunctionFactory from './secrets-manager';
import getConfig from './get-config';

const secretsManager = new AWS.SecretsManager();
const config = getConfig('secrets');

export const {
	pullSecrets,
	setSecrets
} = secretsManagerFunctionFactory(secretsManager, fs, config);

export default secretsManagerFunctionFactory;

export const cli = (args: string[]): void => {
	const command = args.slice(2)[0];
	const stage = args.slice(2)[1];

	switch (command) {
		case 'set':
			setSecrets(stage).catch(err =>
				console.error('An error occured', err)
			);
			break;
		case 'pull':
			pullSecrets(stage).catch(err =>
				console.error('An error occured', err)
			);
			break;
		default:
			console.log(
				'Please read the README at https://github.com/supersoniko/aws-secrets-dotenv'
			);
	}
};

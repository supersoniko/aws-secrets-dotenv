import AWS from 'aws-sdk';
import fs from 'fs';

AWS.config.update({ region: process.env.AWS_DEFAULT_REGION });

import secretsManagerFunctionFactory from './secrets-manager';
import getConfig from './get-config';

const secretsManager = new AWS.SecretsManager();
const config = getConfig('secrets');

export const {
	createLocalEnvrionment,
	createOrUpdateSecret
} = secretsManagerFunctionFactory(secretsManager, fs, config);

export default secretsManagerFunctionFactory;

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('make-runnable/custom')({
	printOutputFrame: false
});

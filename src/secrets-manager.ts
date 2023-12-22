import * as filesystem from 'fs';

import {
	CreateSecretCommand,
	GetSecretValueCommand,
	SecretsManagerClient,
	UpdateSecretCommand,
} from '@aws-sdk/client-secrets-manager';

import { Config, SecretManagerFunctionFactory } from './types';

const secretsManagerFunctionFactory = (
	secretsManager: SecretsManagerClient,
	fs: typeof filesystem,
	config: Config,
): SecretManagerFunctionFactory => ({
	createOrUpdateSecret: async (stage = 'dev'): Promise<void> => {
		try {
			const command = new CreateSecretCommand({
				Name: `${config.Name}-${stage}`,
				Description: config.Description,
				SecretString: config.SecretString,
			});
			await secretsManager.send(command);

			console.log('Envrionment variables saved on AWS Secret Manager!');
		} catch (error) {
			if ((error as Error).message.includes('already exists')) {
				const command = new UpdateSecretCommand({
					SecretId: `${config.Name}-${stage}`,
					Description: config.Description,
					SecretString: config.SecretString,
				});
				await secretsManager.send(command);
				console.log('Envrionment variables updated on AWS Secret Manager!');
			} else {
				console.error(error, (error as Error).stack);
				throw error;
			}
		}
	},

	createLocalEnvironment: async (stage = 'dev'): Promise<void> => {
		try {
			const command = new GetSecretValueCommand({
				SecretId: `${config.Name}-${stage}`,
			});
			const secretData = await secretsManager.send(command);

			if (!secretData.SecretString) throw new Error('No data in secret.');

			const environmentVars = JSON.parse(secretData.SecretString);
			const envFileContent = Object.keys(environmentVars).reduce(
				(outputString, key) =>
					(outputString += `${key}=${environmentVars[key]} \n`),
				'',
			);

			fs.writeFileSync('.env', envFileContent);
			console.log('The .env file has been written successfully!');
		} catch (error) {
			console.error(error, (error as Error).stack);
			throw error;
		}
	},
});

export default secretsManagerFunctionFactory;

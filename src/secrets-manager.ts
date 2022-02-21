import SecretsManager from 'aws-sdk/clients/secretsmanager';

import { Config, SecretManagerFunctionFactory } from './types';

const secretsManagerFunctionFactory = (
	secretsManager: SecretsManager,
	fs: any,
	config: Config
): SecretManagerFunctionFactory => ({
	setSecrets: async (secretName): Promise<void> => {
		try {
			await secretsManager
				.createSecret({
					Name: `${secretName}`,
					Description: config.Description,
					SecretString: config.SecretString
				})
				.promise();
			console.log('Envrionment variables saved on AWS Secret Manager!');
		} catch (error) {
			if (error.message.includes('already exists')) {
				await secretsManager
					.updateSecret({
						SecretId: `${secretName}`,
						Description: config.Description,
						SecretString: config.SecretString
					})
					.promise();
				console.log('Envrionment variables updated on AWS Secret Manager!');
			} else {
				console.error(error, error.stack);
				throw error;
			}
		}
	},

	pullSecrets: async (secretName, stage): Promise<void> => {
		try {
			const secretData = await secretsManager
				.getSecretValue({ SecretId: `${secretName}` })
				.promise();

			if (!secretData.SecretString) throw new Error('No data in secret.');

			const environmentVars = JSON.parse(secretData.SecretString);
			const envFileContent = Object.keys(environmentVars).reduce(
				(outputString, key) =>
					(outputString += `${key}=${environmentVars[key]} \n`),
				''
			);

			fs.writeFileSync(`.env.${stage}`, envFileContent);
			console.log('The .env file has been written successfully!');
		} catch (error) {
			console.error(error, error.stack);
			throw error;
		}
	}
});

export default secretsManagerFunctionFactory;

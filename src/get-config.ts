import rc from 'rc';

import { Config } from './types';

export default (projectName: string): Config => {
	const config = rc(projectName);

	return {
		Name: config.Name,
		Description: config.Description,
		SecretString: JSON.stringify(
			config.LIST_OF_SECRETS.reduce((acc: any, key: string) => {
				acc[key] = process.env[key];
				return acc;
			}, {})
		)
	};
};

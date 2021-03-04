import rc from 'rc';

import { Config } from './types';

export default (projectName: string): Config => {
	const config = rc(projectName);

	return {
		Name: config.name,
		Description: config.description,
		SecretString: JSON.stringify(
			config.keys.reduce((acc: any, key: string) => {
				acc[key] = process.env[key];
				return acc;
			}, {})
		)
	};
};

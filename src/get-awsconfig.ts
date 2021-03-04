import rc from 'rc';

import { AWSConfig } from './types';

export default (projectName: string): AWSConfig => {
	const config = rc(projectName);

	return {
		accessKeyId: config.accessKeyId,
		secretAccessKey: config.secretAccessKey,
		region: config.region,
	};
};
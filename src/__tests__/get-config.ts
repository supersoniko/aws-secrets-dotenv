import getConfig from '../get-config';
import { Config } from '../types';

describe('getConfig', (): void => {
	it('should support .secretsrc and parses it correctly', (): void => {
		const config: Config = {
			Name: 'Beep',
			Description: 'Boop',
			SecretString: JSON.stringify({ beep: 'boop' })
		};

		process.env.beep = 'boop';

		expect(getConfig('secrets')).toEqual(config);
	});
});

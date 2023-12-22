#!/usr/bin/env node

import { cli } from '../.dist/index.js';

(async () => {
	await cli(process.argv);
})();

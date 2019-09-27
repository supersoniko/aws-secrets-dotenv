module.exports = () => {
	return {
		files: [
			'src/**/*.ts',
			'!src/__tests__/*.ts',
			{ pattern: 'tsconfig.*', instrument: false },
			{ pattern: 'package.json', instrument: false }
		],
		tests: ['src/__tests__/*.ts'],
		env: {
			type: 'node',
			runner: 'node'
		},
		testFramework: 'jest'
	};
};

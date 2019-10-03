export interface Config {
	Name: string;
	Description: string;
	SecretString: string;
}

export interface SecretManagerFunctionFactory {
	createOrUpdateSecret: (stage?: string) => Promise<void>;
	createLocalEnvironment: (stage?: string) => Promise<void>;
}

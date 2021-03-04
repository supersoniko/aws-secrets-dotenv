export interface Config {
	Name: string;
	Description: string;
	SecretString: string;
}

export interface AWSConfig {
	accessKeyId: string;
	secretAccessKey: string;
	region: string;
}

export interface SecretManagerFunctionFactory {
	setSecrets: (stage?: string) => Promise<void>;
	pullSecrets: (stage?: string) => Promise<void>;
}

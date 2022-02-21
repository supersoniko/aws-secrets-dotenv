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
	setSecrets: (secretName?: string) => Promise<void>;
	pullSecrets: (secretName?: string, stage?: string) => Promise<void>;
}

import SecretsManager from 'aws-sdk/clients/secretsmanager';
import fs from 'fs';

import secretsManagerFunctionFactoryImpl from '../secrets-manager';
import { Config, SecretManagerFunctionFactory } from '../types';

describe('SecretsManagerFunctionFactory', (): void => {
	let secretsManagerFunctionFactory: SecretManagerFunctionFactory;
	let secretManager: SecretsManager;
	const config: Config = {
		Name: 'Beep',
		Description: 'Boop',
		SecretString: JSON.stringify({ beep: 'boop' })
	};

	beforeEach(async () => {
		secretManager = new SecretsManager();
		secretsManagerFunctionFactory = secretsManagerFunctionFactoryImpl(
			secretManager,
			fs,
			config
		);
	});

	describe('setSecrets', (): void => {
		it('successfully calls createSecret once', async (): Promise<void> => {
			// Prepare
			const secretMock = jest.fn();
			const { setSecrets } = secretsManagerFunctionFactory;

			jest.spyOn(secretManager, 'createSecret').mockImplementation(() => {
				return { promise: secretMock } as any;
			});

			// Execute
			await setSecrets();

			// Assert
			expect(secretMock).toHaveBeenCalled();
			expect(secretMock.mock.calls.length).toBe(1);
		});
	});

	describe('pullSecrets', (): void => {
		it('successfully calls getSecretValue once', async (): Promise<void> => {
			// Prepare
			const { pullSecrets } = secretsManagerFunctionFactory;
			const secretMock = jest
				.fn()
				.mockReturnValue(
					Promise.resolve({ SecretString: JSON.stringify({ beep: 'boop' }) })
				);

			jest.spyOn(secretManager, 'getSecretValue').mockImplementation(() => {
				return { promise: secretMock } as any;
			});
			jest
				.spyOn(fs, 'writeFileSync')
				.mockImplementation((_fileName, _fileContent) => {
					return `${_fileContent} ${_fileName}`;
				});

			// Execute
			await pullSecrets();

			// Assert
			expect(secretMock).toHaveBeenCalled();
			expect(secretMock.mock.calls.length).toBe(1);
		});

		it('succeeds without an error thrown', async (): Promise<void> => {
			// Prepare
			let errorThrown = false;
			const secretMock = jest
				.fn()
				.mockReturnValue(
					Promise.resolve({ SecretString: JSON.stringify({ beep: 'boop' }) })
				);

			const { pullSecrets } = secretsManagerFunctionFactory;

			jest.spyOn(secretManager, 'getSecretValue').mockImplementation(() => {
				return { promise: secretMock } as any;
			});
			jest
				.spyOn(fs, 'writeFileSync')
				.mockImplementation((_fileName, _fileContent) => {
					return `${_fileContent} ${_fileName}`;
				});

			// Execute
			try {
				await pullSecrets();
			} catch (error) {
				errorThrown = true;
			}

			// Assert
			expect(secretMock).toHaveBeenCalled();
			expect(secretMock.mock.calls.length).toBe(1);
			expect(errorThrown).toBe(false);
		});

		it('fails with correct error message', async (): Promise<void> => {
			// Prepare
			let errorMessage;
			const secretMock = jest
				.fn()
				.mockReturnValue(Promise.resolve({ SecretString: undefined }));

			const { pullSecrets } = secretsManagerFunctionFactory;

			jest.spyOn(secretManager, 'getSecretValue').mockImplementation(() => {
				return { promise: secretMock } as any;
			});

			// Execute
			try {
				await pullSecrets();
			} catch (error) {
				errorMessage = error.message;
			}

			// Assert
			expect(secretMock).toHaveBeenCalled();
			expect(secretMock.mock.calls.length).toBe(1);
			expect(errorMessage).toBe('No data in secret.');
		});

		it('successfully parses and writes .env', async (): Promise<void> => {
			let content;
			const { pullSecrets } = secretsManagerFunctionFactory;
			const secretMock = jest
				.fn()
				.mockReturnValue(
					Promise.resolve({ SecretString: JSON.stringify({ beep: 'boop' }) })
				);

			jest.spyOn(secretManager, 'getSecretValue').mockImplementation(() => {
				return { promise: secretMock } as any;
			});
			jest
				.spyOn(fs, 'writeFileSync')
				.mockImplementation((_fileName, fileContent) => {
					content = fileContent;
				});

			// Execute
			await pullSecrets();

			// Assert
			expect(secretMock).toHaveBeenCalled();
			expect(secretMock.mock.calls.length).toBe(1);
			expect(content).toBe('beep=boop \n');
		});
	});
});

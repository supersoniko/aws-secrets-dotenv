import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import fs from 'fs';

import secretsManagerFunctionFactoryImpl from '../secrets-manager';
import { Config, SecretManagerFunctionFactory } from '../types';

describe('SecretsManagerFunctionFactory', (): void => {
	let secretsManagerFunctionFactory: SecretManagerFunctionFactory;
	let secretManager: SecretsManagerClient;
	const config: Config = {
		Name: 'Beep',
		Description: 'Boop',
		SecretString: JSON.stringify({ beep: 'boop' }),
	};

	beforeEach(async () => {
		secretManager = new SecretsManagerClient();
		secretsManagerFunctionFactory = secretsManagerFunctionFactoryImpl(
			secretManager,
			fs,
			config,
		);
	});

	describe('createOrUpdateSecret', (): void => {
		it('successfully calls createSecret once', async (): Promise<void> => {
			// Prepare
			const secretMock = jest.fn();
			const { createOrUpdateSecret } = secretsManagerFunctionFactory;

			jest
				.spyOn(secretManager, 'send')
				.mockImplementation(() => Promise.resolve(secretMock()));

			// Execute
			await createOrUpdateSecret();

			// Assert
			expect(secretMock).toHaveBeenCalled();
			expect(secretMock.mock.calls.length).toBe(1);
		});
	});

	describe('createLocalEnvironment', (): void => {
		it('successfully calls getSecretValue once', async (): Promise<void> => {
			// Prepare
			const { createLocalEnvironment } = secretsManagerFunctionFactory;
			const secretMock = jest
				.fn()
				.mockReturnValue(
					Promise.resolve({ SecretString: JSON.stringify({ beep: 'boop' }) }),
				);

			jest
				.spyOn(secretManager, 'send')
				.mockImplementation(() => Promise.resolve(secretMock()));
			jest
				.spyOn(fs, 'writeFileSync')
				.mockImplementation(
					(_fileName, _fileContent) => `${_fileContent} ${_fileName}`,
				);

			// Execute
			await createLocalEnvironment();

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
					Promise.resolve({ SecretString: JSON.stringify({ beep: 'boop' }) }),
				);

			const { createLocalEnvironment } = secretsManagerFunctionFactory;

			jest
				.spyOn(secretManager, 'send')
				.mockImplementation(() => Promise.resolve(secretMock()));
			jest
				.spyOn(fs, 'writeFileSync')
				.mockImplementation(
					(_fileName, _fileContent) => `${_fileContent} ${_fileName}`,
				);

			// Execute
			try {
				await createLocalEnvironment();
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

			const { createLocalEnvironment } = secretsManagerFunctionFactory;

			jest
				.spyOn(secretManager, 'send')
				.mockImplementation(() => Promise.resolve(secretMock()));

			// Execute
			try {
				await createLocalEnvironment();
			} catch (error) {
				errorMessage = (error as Error).message;
			}

			// Assert
			expect(secretMock).toHaveBeenCalled();
			expect(secretMock.mock.calls.length).toBe(1);
			expect(errorMessage).toBe('No data in secret.');
		});

		it('successfully parses and writes .env', async (): Promise<void> => {
			let content;
			const { createLocalEnvironment } = secretsManagerFunctionFactory;
			const secretMock = jest
				.fn()
				.mockReturnValue(
					Promise.resolve({ SecretString: JSON.stringify({ beep: 'boop' }) }),
				);

			jest
				.spyOn(secretManager, 'send')
				.mockImplementation(() => Promise.resolve(secretMock()));
			jest
				.spyOn(fs, 'writeFileSync')
				.mockImplementation((_fileName, fileContent) => {
					content = fileContent;
				});

			// Execute
			await createLocalEnvironment();

			// Assert
			expect(secretMock).toHaveBeenCalled();
			expect(secretMock.mock.calls.length).toBe(1);
			expect(content).toBe('beep=boop \n');
		});
	});
});

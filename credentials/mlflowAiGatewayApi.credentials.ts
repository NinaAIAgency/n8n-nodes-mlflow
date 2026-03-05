import type {
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestOptions,
	INodeProperties,
    Icon,
} from 'n8n-workflow';

export class mlflowAiGatewayApi implements ICredentialType {
	name = 'mlflowAiGatewayApi';

	displayName = 'MLflow AI Gateway API';
	documentationUrl = 'https://github.com/NinaAIAgency/n8n-nodes-mlflow';

	icon: Icon = { light: 'file:../icons/ml-flow-light.svg', dark: 'file:../icons/ml-flow-dark.svg' };

	properties: INodeProperties[] = [
		{
			displayName: 'Tracking URL',
			name: 'baseUrl',
			required: true,
			type: 'string',
			default: 'http://localhost:5000',
		},
		{
			displayName: 'Endpoint',
			name: 'endpoint',
			required: true,
			type: 'string',
			default: 'n8n-endpoint',
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			required: false,
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: false,
		}
	];

    test: ICredentialTestRequest = {
		request: {
			baseURL: '={{ $credentials.baseUrl }}',
			url: '/gateway/mlflow/v1/chat/completions',
			method: 'POST',
			headers: {
				'http-referer': 'https://n8n.io/',
				'x-title': 'n8n',
			},
			body: {
				model: '={{ $credentials.endpoint }}',
				messages: [{ role: 'user', content: 'test' }]
			},
		},
	};

	async authenticate(
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> {
		const token = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');
		requestOptions.headers = {
			...requestOptions.headers,
			Authorization: `Basic ${token}`,
		};
		return requestOptions;
	}
}
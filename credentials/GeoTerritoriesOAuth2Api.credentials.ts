import type { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';

export class GeoTerritoriesOAuth2Api implements ICredentialType {
	name = 'GeoTerritoriesOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'GeoTerritories OAuth2 Api';

	icon: Icon = { light: 'file:../icons/github.svg', dark: 'file:../icons/github.dark.svg' };

	documentationUrl = 'https://docs.github.com/en/apps/oauth-apps';

	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'string',
			default: 'pkce',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'string',
			default: 'http://localhost:3000/api/auth/oauth2/authorize',
			required: true,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'string',
			default: 'openid offline_access read:validate',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'string',
			default: 'resource=http://localhost:5678',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'string',
			default: 'http://host.docker.internal:3000/api/auth/oauth2/token',
			required: true,
		},
		{
			displayName: 'Send Additional Body Properties',
			name: 'sendAdditionalBodyProperties',
			type: 'string',
			default: 'true',
			required: true,
		},
		{
			displayName: 'Additional Body Properties',
			name: 'additionalBodyProperties',
			type: 'string',
			default: '{"resource": "http://localhost:5678"}',
			required: true,
		},

		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'string',
			default: 'header',
		},
	];
}

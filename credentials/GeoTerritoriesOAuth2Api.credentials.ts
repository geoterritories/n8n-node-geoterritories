import type { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';

export class GeoTerritoriesOAuth2Api implements ICredentialType {
	name = 'GeoTerritoriesOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'GeoTerritories OAuth2 Api';

	icon: Icon = { light: 'file:dark_favicon.svg', dark: 'file:dark_favicon.svg' };

	documentationUrl = 'https://docs.github.com/en/apps/oauth-apps';

	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'pkce',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'http://localhost:3000/api/auth/oauth2/authorize',
			required: true,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'openid offline_access read:validate',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: 'resource=http://localhost:5678&access_type=offline',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'http://host.docker.internal:3000/api/auth/oauth2/token',
			required: true,
		},
		{
			displayName: 'Send Additional Body Properties',
			name: 'sendAdditionalBodyProperties',
			type: 'hidden',
			default: 'true',
			required: true,
		},
		{
			displayName: 'Additional Body Properties',
			name: 'additionalBodyProperties',
			type: 'hidden',
			default: '{"resource": "http://localhost:5678"}',
			required: true,
		},

		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'header',
		},
	];
}

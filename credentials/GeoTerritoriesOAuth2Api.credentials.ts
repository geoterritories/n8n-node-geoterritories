import type { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';

export class GeoTerritoriesOAuth2Api implements ICredentialType {
	name = 'geoTerritoriesOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'Geo Territories OAuth2 API';

	icon: Icon = { light: 'file:light_favicon.svg', dark: 'file:dark_favicon.svg' };

	documentationUrl = 'https://docs.github.com/en/apps/oauth-apps';

	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'pkce',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'hidden',
			default: 'https://api.geoterritories.com',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://app.geoterritories.com/api/auth/oauth2/authorize',
			required: true,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'openid offline_access read:validate read:organization',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: 'resource=https://api.geoterritories.com&access_type=offline',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://app.geoterritories.com/api/auth/oauth2/token',
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
			default: '{"resource": "https://api.geoterritories.com"}',
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

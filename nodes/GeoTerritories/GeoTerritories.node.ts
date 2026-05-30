import type {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	INodeExecutionData,
} from 'n8n-workflow';
import { NodeConnectionTypes, ILoadOptionsFunctions, NodeApiError, JsonObject } from 'n8n-workflow';

export class GeoTerritories implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'GeoTerritories',
		subtitle: 'Validate against custom geo fences',
		name: 'geoTerritories',
		icon: {
			light: 'file:../../icons/light_favicon.svg',
			dark: 'file:../../icons/dark_favicon.svg'
		},
		group: ['transform'],
		version: 1,
		defaults: {
			name: 'GeoTerritories',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'geoTerritoriesOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				required: true,
				options: [
					{
						name: 'Validate',
						value: 'validate',
						description: 'This resource validate a geo location againt a geo fence',
					}
				],
				default: 'validate',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				required: true,
				options: [
					{
						name: 'Validate With Latitude and Longitude',
						value: 'latitudeLongitude',
						description: 'Validate a latitude longtiude points against a geo fence',
						action: 'Validate a latitude longtiude points against a geo fence',
					}
				],
				default: 'latitudeLongitude',
			},
			{
				displayName: 'Validate Against',
				name: 'validateAgainst',
				type: 'options',
				noDataExpression: true,
				required: true,
				options: [
					{
						name: 'Validate Against All Fences',
						value: 'allFences',
						description: 'Validate against all the available fences',
					},
					{
						name: 'Validate Against Multiple Fences',
						value: 'multipleFences',
						description: 'Validate against multiple selected fences',
					},
					{
						name: 'Validate Against One Fence',
						value: 'oneFence',
						description: 'Validate against one selected fence',
					}
				],
				default: 'oneFence',
			},

			{
				displayName: 'Fence List Name or ID',
				name: 'fenceList',
				type: 'options',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getFences',
				},
				default: '',
				displayOptions: {
					show: {
						validateAgainst: ['oneFence'],
					},
				},
			},
			{
				displayName: 'Fence List Names or IDs',
				name: 'fenceListMultiSelect',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getFences',
				},
				default: [], // Initially selected options
				description: 'The events to be monitored. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				displayOptions: {
					show: {
						validateAgainst: ['multipleFences'],
					},
				},
			},
			{
				displayName: 'Latitude',
				name: 'lat',
				type: 'number',
				default: 0,
				required: true,
				description: 'Latitude of the point to validate',
				displayOptions: {
					show: {
						operation: ['latitudeLongitude'],
					},
				},
			},
			{
				displayName: 'Longitude',
				name: 'lng',
				type: 'number',
				default: 0,
				required: true,
				description: 'Longitude of the point to validate',
				displayOptions: {
					show: {
						operation: ['latitudeLongitude'],
					},
				},
			},
		],
		usableAsTool: true,
		description: 'n8n node to validate a geo point against a custom geo fence.'
	};

	methods = {
		loadOptions: {
			async getFences(this: ILoadOptionsFunctions) {
				try {
					const credentials = await this.getCredentials('geoTerritoriesOAuth2Api');
					const authBaseUrl = credentials.authBaseUrl as string;
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'geoTerritoriesOAuth2Api',
						{
							headers: {
								'Accept': 'application/json',
							},
							method: 'GET',
							url: `${authBaseUrl.includes('localhost') ? 'http://host.docker.internal:8787' : credentials.serviceBaseUrl}/fences`,
							json: true,
						},
					);

					return response;
				} catch (error) {
					throw new NodeApiError(this.getNode(), error as JsonObject);
				}
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const returnData: INodeExecutionData[] = [];
		try {
			const validationMode = this.getNodeParameter('validateAgainst', 0) as string;
			const credentials = await this.getCredentials('geoTerritoriesOAuth2Api');
			const authBaseUrl = credentials.authBaseUrl as string;
			const fenceIds: string[] = [];
			switch (validationMode) {
				case 'oneFence':
					fenceIds.push(this.getNodeParameter('fenceList', 0) as string);
					break;
				case 'multipleFences':
					fenceIds.push(...(this.getNodeParameter('fenceListMultiSelect', 0) as string[]));
					break;
				default:
					break;
			}
			const response = await this.helpers.httpRequestWithAuthentication.call(
				this,
				'geoTerritoriesOAuth2Api',
				{
					headers: {
						'Accept': 'application/json',
					},
					method: 'POST',
					url: `${authBaseUrl.includes('localhost') ? 'http://host.docker.internal:8787' : credentials.serviceBaseUrl}/validate`,
					body: {
						mode: validationMode,
						coordinates: {
							lat: this.getNodeParameter('lat', 0) as number,
							lng: this.getNodeParameter('lng', 0) as number,
						},
						fenceIds: fenceIds,
					},
					json: true,
				},
			);

			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(response),
				{ itemData: { item: 0 } },
			);

			returnData.push(...executionData);

			return [returnData];
		} catch (error) {
			if (this.continueOnFail()) {
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray({ error: (error as Error).message }),
					{ itemData: { item: 0 } },
				);
				returnData.push(...executionData);
				return [returnData];
			}
			throw new NodeApiError(this.getNode(), error as JsonObject);
		}
	}
}
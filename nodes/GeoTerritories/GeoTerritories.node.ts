import type {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	INodeExecutionData,
	// IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { ILoadOptionsFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { JsonObject } from 'n8n-workflow';
// import { getFences } from './listSearch/getFences';

export class GeoTerritories implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'GeoTerritories',
		name: 'GeoTerritories',
		icon: 'file:dark_favicon.svg',
		group: ['transform'],
		version: 1,
		description: 'Validate a geo point against a custom geo fence.',
		defaults: {
			name: 'GeoTerritories',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'GeoTerritoriesOAuth2Api',
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
						description: 'This resource validate a geo location againt a geo fence.',
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
						name: 'Validate Against One Fence',
						value: 'oneFence',
						description: 'Validate againt one selected fence',
					},
					{
						name: 'Validate Against Multiple Fences',
						value: 'multipleFences',
						description: 'Validate against multiple selected fences',
					},
					{
						name: 'Validate Against All Fences',
						value: 'allFences',
						description: 'Validate against all the available fences',
					},
				],
				default: 'oneFence',
			},

			{
				displayName: 'Fence List',
				name: 'fenceList',
				type: 'options',
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
				displayName: 'Fence List',
				name: 'fenceListMultiSelect',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getFences',
				},
				default: [], // Initially selected options
				description: 'The events to be monitored',
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
	};

	methods = {
		loadOptions: {
			async getFences(this: ILoadOptionsFunctions) {
				try {
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'GeoTerritoriesOAuth2Api',
						{
							headers: {
								'Accept': 'application/json',
							},
							method: 'GET',
							url: `http://host.docker.internal:8787/fences`,
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

		// let responseData;
		// const resource = this.getNodeParameter('resource', 0) as string;
		// const operation = this.getNodeParameter('operation', 0) as string;
		//Get credentials the user provided for this node
		// const credentials = await this.getCredentials('friendGridApi') as IDataObject;
		const returnData: INodeExecutionData[] = [];

		try {
			const validationMode = this.getNodeParameter('validateAgainst', 0) as string;
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
				'GeoTerritoriesOAuth2Api',
				{
					headers: {
						'Accept': 'application/json',
					},
					method: 'POST',
					url: `http://host.docker.internal:8787/validate`,
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
			throw new NodeApiError(this.getNode(), error as JsonObject);
		}
	}
}
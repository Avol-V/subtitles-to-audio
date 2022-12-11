import { request as httpsRequest } from 'node:https';
import { stringify } from 'node:querystring';
import { Buffer } from 'node:buffer';

/**
 * @typedef { import( './speech-kit.types.js' ).SpeechKitOptions } SpeechKitOptions
 */

/** @type { ReadonlyArray<keyof SpeechKitOptions> } */
const queryKeys = [
	'folderId',
	'text',
	'ssml',
	'lang',
	'voice',
	'emotion',
	'speed',
	'format',
	'sampleRateHertz',
];

/**
 * @param { SpeechKitOptions } options
 * @returns { Promise<Buffer> }
 */
export function speechKit( options )
{
	const parameters = queryKeys
		.map( ( key ) => [ key, options[key] ] )
		.filter( ( [, value] ) => value != null )
		.reduce(
			( previous, [key, value] ) =>
			{
				if (
					( key !== undefined )
					&& ( value !== undefined )
				) {
					previous[key] = value;
				}
				
				return previous;
			},
			/** @type { Record<string, string | number> } */({}),
		);
	const body = stringify( parameters );
	let retryAttempt = 0;
	
	return new Promise(
		( resolve, reject ) =>
		{
			retryAttempt++;
			
			const sendRequest = () =>
			{
				const request = httpsRequest(
					{
						method: 'POST',
						hostname: 'tts.api.cloud.yandex.net',
						port: 443,
						path: '/speech/v1/tts:synthesize',
						headers: {
							'Authorization': 'Bearer ' + options.iamToken,
							'Content-Length': Buffer.byteLength(body),
						},
						timeout: options.timeout,
					},
					async ( response ) =>
					{
						/** @type { Array<Uint8Array> } */
						const chunks = [];
						
						for await ( const chunk of response )
						{
							chunks.push( chunk );
						}
						
						retryAttempt = 0;
						
						const data = Buffer.concat( chunks );
						
						if ( response.statusCode !== 200 )
						{
							reject(
								new Error(
									`${
										response.statusCode
									} ${
										response.statusMessage
									}: ${
										data.toString( 'utf8' )
									}\n"${
										body
									}"`
								)
							);
						}
						else
						{
							resolve( data );
						}
					},
				);
				
				request.on(
					'error',
					( error ) =>
					{
						reject( error );
					},
				);
				request.on(
					'timeout',
					() =>
					{
						request.destroy();
						
						if (
							options.retries
							&& ( retryAttempt < options.retries )
						)
						{
							console.warn( `Retry ${retryAttempt}` );
							retryAttempt++;
							
							sendRequest();
							
							return;
						}
						
						reject( new URIError( 'Timeout' ) );
					},
				);
				request.write( body );
				request.end();
			};
			
			sendRequest();
		},
	);
}

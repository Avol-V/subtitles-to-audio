import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { readSrt } from './lib/read-srt.js';
import { prepareText } from './lib/prepare-text.js';
import { speechKit } from './lib/speech-kit.js';
import { processWithFfmpeg } from './lib/process-with-ffmpeg.js';
import {
	speechKitOptions,
	processingOptions,
} from './settings.js';

async function main()
{
	const inputPath = process.argv[2];
	
	if ( !inputPath )
	{
		throw new Error( 'Path to input SRT file is required' );
	}
	
	const fullInputPath = resolve( process.cwd(), inputPath );
	const inputDirectory = dirname( fullInputPath );
	
	for await ( const item of readSrt( fullInputPath ) )
	{
		const name = item.start.replace( /\D/g, '-' );
		const text = prepareText( item.texts );
		
		if ( !text )
		{
			continue;
		}
		
		const data = await speechKit({
			folderId: process.env['SPEECH_KIT_FOLDER_ID'] || '',
			iamToken: process.env['SPEECH_KIT_IAM_TOKEN'] || '',
			...speechKitOptions,
			text,
		});
		
		const audioFilePath = resolve( inputDirectory, name + '.ogg' );
		
		if ( processingOptions.audioTempo )
		{
			await processWithFfmpeg(
				audioFilePath,
				data,
				{
					audioTempo: processingOptions.audioTempo,
				},
			);
		}
		else
		{
			await writeFile( audioFilePath, data );
		}
		
		console.log( audioFilePath );
	}
}

main()
	.catch(
		( error ) =>
		{
			console.error( error );
			process.exit( 1 );
		},
	);

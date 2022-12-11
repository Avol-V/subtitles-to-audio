import { spawn } from 'node:child_process';
import { Buffer } from 'node:buffer';

/**
 * @typedef { import( './process-with-ffmpeg.types.js' ).FfmpegOptions } FfmpegOptions
 */

/**
 * @param { string } outputFile
 * @param { Buffer } data
 * @param { FfmpegOptions } options
 * @returns { Promise<void> }
 */
export async function processWithFfmpeg( outputFile, data, options )
{
	const child = spawn(
		'ffmpeg',
		[
			'-nostats',
			'-loglevel',
			'warning',
			'-i',
			'-',
			'-filter:a',
			`atempo=${options.audioTempo.toFixed( 1 )}`,
			'-safe',
			'0',
			outputFile,
		],
		{
			stdio: [
				'pipe',
				process.stdout,
				process.stderr,
			],
		},
	);
	
	child.stdin.write( data );
	child.stdin.end();
	
	return new Promise(
		( resolve, reject ) =>
		{
			child.once(
				'exit',
				( code ) =>
				{
					if ( code === 0 )
					{
						resolve();
					}
					else
					{
						reject(
							new Error( `FFMPEG Error: ${code}` ),
						);
					}
				},
			);
			child.once(
				'error',
				( error ) =>
				{
					reject( error );
				},
			);
		},
	);
}

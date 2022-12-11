import { open } from 'node:fs/promises';

/**
 * @typedef { import( './read-srt.types.js' ).SubtitleItem } SubtitleItem
 */

const readSteps = {
	none: 0,
	id: 1,
	time: 2,
	text: 3,
};

/**
 * @returns { SubtitleItem }
 */
function createItem()
{
	return {
		id: 0,
		start: '00:00:00,000',
		end: '00:00:00,000',
		texts: [],
	};
}

/**
 * @param { string } line
 */
function parseTime( line )
{
	const parts = line.split( ' --> ' );
	
	return {
		start: ( parts[0] || '00:00:00,000').trim(),
		end: ( parts[1] || '00:00:00,000').trim(),
	};
}

/**
 * @param { string } uri
 */
export async function* readSrt( uri )
{
	const file = await open( uri );
	let step = readSteps.none;
	let item = createItem();
	
	for await ( const line of file.readLines() )
	{
		if ( line === '' )
		{
			if ( item.id !== 0 )
			{
				yield item;
			}
			
			item = createItem();
			step = readSteps.none;
			
			continue;
		}
		
		switch ( step )
		{
			case readSteps.none:
				step = readSteps.id;
				item.id = Number( line );
				break;
			
			case readSteps.id:
				step = readSteps.time;
				Object.assign( item, parseTime( line ) );
				break;
			
			// @ts-expect-error: falls through
			case readSteps.time:
				step = readSteps.text;
				// falls through
				
			case readSteps.text:
				item.texts.push( line );
				break;
			
			default:
				throw new Error( `Unknown step type: ${step}` );
		}
	}
	
	if ( item.id !== 0 )
	{
		yield item;
	}
}

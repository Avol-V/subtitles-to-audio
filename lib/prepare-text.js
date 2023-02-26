const markupRegExp = /\([^()]+\)|\[[^[\]]+\]|{[^{}]+}|<[^<>]+>/g;
const symbolsRegExp = /[*#~+_♪♩♫♬]/g;
const replaceMap = {
	'—': '-',
	'–': '-',
	'−': '-',
	'«': '"',
	'»': '"',
	'„': '"',
	'“': '"',
	'”': '"',
	'‘': '\'',
	'’': '\'',
	'`': '\'',
	'\\': '/',
};

/**
 * @param { ReadonlyArray<string> } texts
 */
export function prepareText( texts )
{
	const prepared = texts.join( ' ' )
		.replace( markupRegExp, '' )
		.replace( symbolsRegExp, ' ' )
		.normalize('NFKD')
		.replace( /[\u0300-\u036F]/g, '' ) // accents
		.trim();
	
	let output = '';
	
	for ( const char of prepared )
	{
		if ( char in replaceMap )
		{
			output += replaceMap[/** @type { keyof typeof replaceMap } */(char)];
		}
		else
		{
			output += char;
		}
	}
	
	return output;
}

const markupRegExp = /\([^()]+\)|\[[^[\]]+\]|{[^{}]+}|<[^<>]+>/g;
const symbolsRegExp = /[*#~+_♪♩♫♬]/g;

/**
 * @param { ReadonlyArray<string> } texts
 */
export function prepareText( texts )
{
	return texts.join( ' ' )
		.replace( markupRegExp, '' )
		.replace( symbolsRegExp, ' ' )
		.normalize('NFKD')
		.replace( /[\u0300-\u036F]/g, '' ) // accents
		.trim();
}

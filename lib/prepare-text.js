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
		.trim();
}

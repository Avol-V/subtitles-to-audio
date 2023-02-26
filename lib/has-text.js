const alphanumericRegExp = /[a-zа-яё0-9]/i;

/**
 * @param { string } input
 */
export function hasText( input )
{
	return (
		Boolean( input )
		&& alphanumericRegExp.test( input )
	);
}

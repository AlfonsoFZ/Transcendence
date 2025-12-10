/**
 * utils.ts -> aux or helper functions not on the scope of a class, interface or type
 */

export async function fetchRandomAvatarPath()
{
	const response = await fetch(`https://${window.location.host}/back/random_avatar`);
	if (response.ok)
	{
		const data = await response.json();
		return (data.avatarPath);
	}
	return (null);
}
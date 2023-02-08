import { redirect } from '@sveltejs/kit';
import { base, assets } from '$app/paths';

export async function load({ fetch }) {
    const listMetadata = await (await fetch(`${assets}/lists/metadata.json`)).json();
    throw redirect(307, `${base}/list/${listMetadata.defaultList}`);
}

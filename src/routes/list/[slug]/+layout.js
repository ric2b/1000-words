import { assets } from '$app/paths';

export async function load({ fetch }) {
    const listMetadataUrl = `${assets}/lists/metadata.json`;
    const listMetadataResponse = await fetch(listMetadataUrl);

    if (!listMetadataResponse.ok) {
        return { status: listMetadataResponse.status, error: new Error(`Could not load ${listMetadataUrl}`) };
    }

    return { listMetadata: await listMetadataResponse.json() };
}
import { assets } from '$app/paths';

export async function load({ params, fetch }) {
    // https://1000mostcommonwords.com/1000-most-common-german-words/ + https://www.convertjson.com/html-table-to-json.htm
    const selectedList = params.slug;
    const list_url = `${assets}/lists/${selectedList}.csv`;
    const response = await fetch(list_url);

    if (response.ok) {
        return {
                listMetadata: await (await fetch(`${assets}/lists/metadata.json`)).json(),
                selectedList: selectedList,
                phrases: await response.text().then(text => text.split('\n').map(x => x.split(',')))
        };
    }

    return { status: response.status, error: new Error(`Could not load ${list_url}`) };
}

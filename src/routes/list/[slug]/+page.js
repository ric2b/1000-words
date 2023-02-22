import { assets } from '$app/paths';

export async function load({ params, fetch }) {
    // https://1000mostcommonwords.com/1000-most-common-german-words/ + https://www.convertjson.com/html-table-to-json.htm
    const selectedList = params.slug;
    const list_url = `${assets}/lists/${selectedList}.csv`;
    const response = await fetch(list_url);

    if (!response.ok) {
        return { status: response.status, error: new Error(`Could not load ${list_url}`) };
    }
    
    return {
        selectedList: selectedList,
        phrases: await response.text().then(text => {
            return text.split('\n').map(line => {
                const [face, answer] = line.split('\t');
                return { face, answer };
            })
        })                    
    }    
}

<script context="module">
  import { base, assets } from '$app/paths';

  export async function load({ page, fetch, session, context }) {
    const listMetadata = await (await fetch(`${assets}/lists/metadata.json`)).json();
    return { status: 307, redirect: `${base}/list/${listMetadata.defaultList}` }
  }
</script>

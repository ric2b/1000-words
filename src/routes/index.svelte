<script context="module">
  export async function load({ page, fetch, session, context }) {
    const defaultList = 'de-en';
    return { status: 307, redirect: `/list/${defaultList}` }
  }
</script>

<a hidden href="/list/de-en"/>
<a hidden href="/list/verben-mit-praepositionen"/>
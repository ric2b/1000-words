<script context="module">
  export async function load({ page, fetch, session, context }) {
    const defaultList = 'de-en';
    return { status: 307, redirect: `/list/${defaultList}` }
  }
</script>

<a href="/list/de-en">1</a>
<a href="/list/verben-mit-praepositionen">2</a>
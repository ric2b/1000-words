<script context="module">
  export async function load({ page, fetch, session, context }) {
    const defaultList = 'de-en';
    return { status: 307, redirect: `/list/${defaultList}` }
  }
</script>

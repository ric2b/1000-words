<script context="module">
  export async function load({ page, fetch, session, context }) {
    const url = 'de-en.csv'; // https://1000mostcommonwords.com/1000-most-common-german-words/ + https://www.convertjson.com/html-table-to-json.htm
    const response = await fetch(url);

    if (response.ok) {
      return { props: { phrases: await response.text().then(text => text.split('\n').map(x => x.split(','))) } };
    }

    return { status: response.status, error: new Error(`Could not load ${url}`) };
  }
</script>

<script>
  export let phrases;

  let language = 'Deutsch';

  let phraseIterator = phrases[Symbol.iterator]();
  let next, translationRevealed;

  $: current = phraseIterator.next();

  $: {
    current; // block is triggered when current is updated
    translationRevealed = false;
    next = phraseIterator.next();
  }

  $: [currentPhrase, currentTranslation] = current.value;
  $: finished = next.done;

  const revealTranslation = () => (translationRevealed = true);
  const getNextPhrase = () => (current = next);
  const resetIterator = () => (phraseIterator = Object.entries(phrases)[Symbol.iterator]());

  function shuffle() {
    let shuffled = phrases
      .map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);
    phraseIterator = shuffled[Symbol.iterator]();
  }
</script>

<h1>{language} 1000 most common words</h1>

<p>{currentPhrase}</p>

{#if !translationRevealed}
  <button on:click={revealTranslation}>Reveal translation</button>
{:else}
  <p>{currentTranslation}</p>
{/if}

<br />

{#if !finished}
  <button on:click={getNextPhrase}>Next</button>
{:else}
  <button on:click={resetIterator}>Reset</button>
{/if}

<button on:click={shuffle}>Shuffle</button>

<script>
  let language = 'Deutsch';

  let phrases = {
    Wichtig: 'Important',
    'Gut Verdienen': 'Ganhar bem',
    Groß: 'Big',
  };

  let phraseIterator = Object.entries(phrases)[Symbol.iterator]();
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
    let shuffled = Object.entries(phrases)
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

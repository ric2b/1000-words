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
  import Card, { Content, PrimaryAction, Actions, ActionButtons, ActionIcons, } from '@smui/card';
  import Button, { Label } from '@smui/button';
  import IconButton, { Icon } from '@smui/icon-button';

  let clicked = 0;

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

<Card>
      <Content>A card with Both.</Content>
      <Actions>
        <ActionButtons>
          <Button on:click={() => clicked++}>
            <Label>Action</Label>
          </Button>
          <Button on:click={() => clicked++}>
            <Label>Another</Label>
          </Button>
        </ActionButtons>
        <ActionIcons>
          <IconButton
            on:click={() => clicked++}
            toggle
            aria-label="Add to favorites"
            title="Add to favorites"
          >
            <Icon class="material-icons" on>favorite</Icon>
            <Icon class="material-icons">favorite_border</Icon>
          </IconButton>
          <IconButton
            class="material-icons"
            on:click={() => clicked++}
            title="Share">share</IconButton
          >
          <IconButton
            class="material-icons"
            on:click={() => clicked++}
            title="More options">more_vert</IconButton
          >
        </ActionIcons>
      </Actions>
    </Card>

<div>
  <Button on:click={() => clicked++} variant="raised">
    <Label>Default</Label>
  </Button>
</div>

<link rel="stylesheet" href="node_modules/svelte-material-ui/bare.css" />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
/>
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"
/>
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto+Mono"
/>
<!-- 
<style>
  /*:global(body) {*/
    /*background: #f97316;*/
    /*background: #f97316;*/
    /*background: linear-gradient(90deg, #fcd34d 0%, #f97316 100%);  */

    /*https://cssgradient.io/*/
    /*https://headlessui.dev/vue/switch*/
    /*purple: #a855f7; to #6366f1*/
    /*orange: fcd34d to f97316 */
    /*green: #4ade80 to #06b6d4*/
    /*violet: #d946ef to #9333ea */
    /*blue: #38bdf8 to #6366f1*/
    /*magenta: #fb923c to #db2777*/
    /*cyan: #22d3ee to #0ea5e9*/
    /*magenta2: #ec4899 to #f43f5e*/
  /*}*/
  
</style> -->
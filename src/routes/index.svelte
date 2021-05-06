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
  import Slider from '@smui/slider';
  import FormField from '@smui/form-field';

  let clicked = 0;
  let currentWordIndex = 0;
  let phrases_shuffled = false;

  export let phrases;

  let language = 'Deutsch';

  // let phraseIterator = phrases[Symbol.iterator]();
  let next, translationRevealed;

  // $: current = phraseIterator.next();
  $: [currentPhrase, currentTranslation] = phrases[currentWordIndex];
  // $: nextPhrase = phrases[currentWordIndex + 1];

  // $: console.log(currentWordIndex)
  // $: console.log(phrases.length)
  // $: {
  //   phraseIterator;
  //   current = phraseIterator.next();
  //   currentWordIndex = 0;
  // }

  // $: {
  //   current; // block is triggered when current is updated
  //   translationRevealed = false;
  //   // next = phraseIterator.next();
  //   // next = phrases[currentWordIndex];
  //   currentWordIndex += 1;
  // }

  // $: currentWordIndex = phrases ? 0 : 0;

  $: {
    currentWordIndex; // block is triggered when current is updated
    translationRevealed = false;
    // next = phraseIterator.next();
    // next = phrases[currentWordIndex];
    // currentWordIndex += 1;
  }

  // $: [currentPhrase, currentTranslation] = current.value;
  // $: finished = next.done;
  $: finished = currentWordIndex + 1 >= phrases.length;

  // const revealTranslation = () => translationRevealed = true;
  // const getNextPhrase = () => (current = next);
  // const getNextPhrase = () => { currentWordIndex < phrases.length - 1 ? currentWordIndex += 1 : currentWordIndex = 0 };
  // const resetIterator = () => (phraseIterator = Object.entries(phrases)[Symbol.iterator]());
  // const resetIterator = () => currentWordIndex = 0;

  function shuffle() {
    const shuffled = phrases
      .map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);
    // phraseIterator = shuffled[Symbol.iterator]();
    phrases = shuffled;
    currentWordIndex = 0;
    translationRevealed = false;
    phrases_shuffled = true;
  }

  let header = 'Die 1000 häufigsten deutschen Wörter';
</script>

<title>1000 words</title>
<!-- <div class="mdc-typography--headline1">{language} 1000 most common words</div> -->
<!-- <h1>{language} 1000 most common words</h1> -->
<!-- <h1>Die 1000 häufigsten deutschen Wörter</h1> -->

<h1 on:mouseenter={() => header = 'The 1000 most common german words'} on:mouseleave={() => header = 'Die 1000 häufigsten deutschen Wörter'}>{header}</h1>
<!-- 1000 häufigste Wörter -->

<Card>
  <Slider style="flex-grow: 1;" bind:value={currentWordIndex} max={phrases.length-1} />
  <Content>
    <h2>{currentPhrase}</h2>
    <p id="translation" class:translationRevealed>{currentTranslation}</p>
  </Content>
  <Actions>
    <ActionButtons>
      {#if currentWordIndex < phrases.length - 1}
        <IconButton class="material-icons" on:click={() => currentWordIndex += 1} title="Get next word">arrow_forward</IconButton>
      {:else}
        <IconButton class="material-icons" on:click={() => currentWordIndex = 0} title="Restart">replay</IconButton>
      {/if}

      <!-- https://github.com/hperrin/svelte-material-ui/issues/108#issuecomment-782583530 -->
      <IconButton class="material-icons" ripple={false} disabled={translationRevealed} on:click={() => translationRevealed = true} title="Reveal">visibility</IconButton>
    </ActionButtons>

    <ActionIcons>
      <IconButton class="material-icons" on:click={shuffle} title="Shuffle words">
        {#if !phrases_shuffled} shuffle {:else} shuffle_on {/if}
      </IconButton>
    </ActionIcons>
  </Actions>
</Card>

<link rel="stylesheet" href="node_modules/svelte-material-ui/bare.css" />
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono" />

<style>
  h1 {
    /*font-family: "Roboto", sans-serif;*/
    text-align:center;
    color: #fff;
    text-shadow: 2px 2px 3px #444;
    /*flex-grow: 1;*/
    /*width: 100%;*/
    /*margin: 20px 15px;*/
    /*min-width: 500px;*/
    /*max-width: 600px;*/
    width: 90vw;
    /*padding:70px 20px 20px 20px;*/
    /*width: calc(100% + 10px);*/
    max-width: 20em;
  } 

  #translation {
    opacity: 0.0
  }

  #translation.translationRevealed {
    opacity: 1.0
  }

  :global(body) {
    font-family: "Roboto", sans-serif;
    text-align: center;

    display: flex;
    /*width: 50%;*/
    /*flex-grow: 1;*/
    justify-content: center;

    color: #111827;

    /*background: #f97316;*/
    background: #f97316;
    background: linear-gradient(90deg, #fcd34d 0%, #f97316 100%);  

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
  }

  :global(div .mdc-slider .mdc-slider__thumb-knob) {
    /*border: 7px solid;*/
    border: none;
    height: 25%;
    width: 25%;
  }
  
  :root {
    --mdc-theme-primary: #ff3e00;
    --mdc-theme-secondary: #676778;
    /*--mdc-theme-background: #fff;*/
    /*--mdc-theme-text-primary-on-background: rgba(0, 0, 0, 0.1);*/
    /*--mdc-theme-text-primary-on-light: rgba(0, 0, 0, 0.1);*/
    /*--mdc-theme-text-primary-on-background: rgba(0, 0, 0, 0.1);*/ 
  }

</style>
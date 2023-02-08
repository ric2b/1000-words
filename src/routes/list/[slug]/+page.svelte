<script>
  import { base, assets } from '$app/paths';
  import { goto, preloadData } from '$app/navigation';
  import { browser } from '$app/environment';

  import Card, { Content, Actions, ActionButtons, ActionIcons, } from '@smui/card';
  import Button from '@smui/button';
  import IconButton from '@smui/icon-button';
  import LinearProgress from '@smui/linear-progress';
  import Tooltip, { Wrapper } from '@smui/tooltip';
  import Menu from '@smui/menu';
  import List, { Item, Text } from '@smui/list';

  import "@fontsource/roboto/400.css"
  import "@fontsource/roboto/700.css"
  import "@fontsource/roboto-mono"
  import 'material-icons/iconfont/material-icons.css';

  import { CardPicker, CardState } from '$lib/card_picker.js';

  export let data;
  let listMetadata, selectedList, phrases
  $: ({ listMetadata, selectedList, phrases } = data)

  let currentPhrase, currentTranslation
  let translationRevealed, listMenu, menuAnchor;

  $: currentListMeta = listMetadata.lists[selectedList];
  $: header = currentListMeta.header;

  $: card_picker = loadCardStates(selectedList);
  $: currentWordIndex = browser ? Number(localStorage.getItem(`list_${selectedList}_currentWordIndex`) || '0') : 0;
  $: [currentPhrase, currentTranslation] = phrases[currentWordIndex];
  $: difficultWord = card_picker.getStateOf(currentWordIndex) === CardState.unknown;

  $: translationRevealed = false && currentWordIndex; // triggered when current index changes
  $: if (browser) localStorage.setItem(`list_${selectedList}_currentWordIndex`, currentWordIndex);
  $: if (browser) localStorage.setItem(`list_${selectedList}_cardStates`, card_picker.stringify() || currentWordIndex);

  $: completion = card_picker.countKnown() / (phrases.length - 1);
  $: finished = currentWordIndex + 1 >= phrases.length; // TODO: should take into account if the unknown stack is empty.

  function loadCardStates(selectedList) {
    const stringifiedCardStates = browser ? localStorage.getItem(`list_${selectedList}_cardStates`) : null;
    const cardPicker = stringifiedCardStates ? CardPicker.fromStringified(stringifiedCardStates) : CardPicker.fromDeckSize(phrases.length);

    return cardPicker;
  }

  function markUnknown() {
    card_picker.markUnknown(currentWordIndex);
    currentWordIndex = card_picker.getNextCardIndex(currentWordIndex);

    // TODO: bad workaround for reactivity depending on changing index
    // translationRevealed = false;
    // difficultWord = card_picker.getStateOf(currentWordIndex) === CardState.unknown
  }

  function markKnown() {
    card_picker.markKnown(currentWordIndex);
    currentWordIndex = card_picker.getNextCardIndex(currentWordIndex);
  }

  function resetList() {
    card_picker.reset();
    currentWordIndex = 0;
  }

  function open_list_menu() {
    listMenu.setOpen(true);
    for (const listId in listMetadata.lists) {
      preloadData(`${assets}/list/${listId}`);
    }
  }
</script>

<svelte:head>
  <link rel="stylesheet" href={`${assets}/css/bare.css`} />
  <title>1000 words</title>
</svelte:head>

<h1 on:mouseenter={() => header = currentListMeta.hoverHeader} on:mouseleave={() => header = currentListMeta.header}>
  {header}
</h1>

<Card>
  <LinearProgress progress={completion} closed={false} />

  <Content>
    <div style="display: flex; align-items: center; justify-content: center">
      <h2>{currentPhrase}</h2>
      {#if difficultWord}
        <Wrapper>
          <span class="material-icons" style="margin-left: 10px;  margin-top: 3px; opacity: 0.4">error</span>
          <Tooltip yPos="above">Schwieriges Wort</Tooltip>
        </Wrapper>
      {/if}
    </div>
    <p id="translation" class:translationRevealed>{currentTranslation}</p>
  </Content>

  <Actions>
    <ActionButtons>
      <div bind:this={menuAnchor}>
        <Button on:click={open_list_menu}>Änderungsliste</Button>
        <Menu bind:this={listMenu} bind:anchorElement={menuAnchor} anchorCorner="BOTTOM_LEFT">
          <List>
            {#each Object.entries(listMetadata.lists) as [listId, listMeta], i (listId)}
              <Item on:SMUI:action={() => goto(`${base}/list/${listId}`)}><Text>{listMeta.name}</Text></Item>
            {/each}
          </List>
        </Menu>
      </div>
    </ActionButtons>

    <ActionIcons>
      <!-- https://github.com/hperrin/svelte-material-ui/issues/108#issuecomment-782583530 -->

      <IconButton class="material-icons" ripple={false} disabled={translationRevealed} on:click={() => translationRevealed = true}>visibility</IconButton>

      <IconButton class="material-icons" ripple={false} disabled={finished} on:click={markUnknown}>watch_later</IconButton>

      {#if finished}
        <IconButton class="material-icons" ripple={false} on:click={resetList}>replay</IconButton>
      {:else}
        <!-- <IconButton class="material-icons" ripple={false} on:click={markKnown}>done</IconButton> -->
        <IconButton class="material-icons" ripple={false} on:click={markKnown}>check_circle</IconButton>
        <!-- <IconButton class="material-icons" ripple={false} on:click={markKnown}>verified</IconButton> -->
      {/if}
    </ActionIcons>
  </Actions>
</Card>

<style>
  h1, h2, p {
    font-family: "Roboto", sans-serif;
    text-align:center;
  }

  h1 {
    /*font-family: "Roboto", sans-serif;*/
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
    filter: blur(4px);
  }

  #translation.translationRevealed {
    filter: none;
  }

  :global(body) {
    display: flex;
    /*width: 50%;*/
    /*flex-grow: 1;*/
    justify-content: center;

    color: #111827;

    /*background: #f97316;*/
    /*background: #f97316;*/
    /*background: linear-gradient(90deg, #fcd34d 0%, #f97316 100%); */

    background: #4ade80;
    background: linear-gradient(90deg, #4ade80 0%, #06b6d4 100%);

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

/*  :global(div .mdc-slider .mdc-slider__thumb-knob) {
    border: 7px solid;
    border: none;
    height: 25%;
    width: 25%;
  }*/

  :root {
    /*--mdc-theme-primary: #ff3e00;*/
    --mdc-theme-primary: rgb(15, 118, 110);
    --mdc-theme-secondary: #676778;
    /*--mdc-theme-background: #fff;*/
    /*--mdc-theme-text-primary-on-background: rgba(0, 0, 0, 0.1);*/
    /*--mdc-theme-text-primary-on-light: rgba(0, 0, 0, 0.1);*/
    /*--mdc-theme-text-primary-on-background: rgba(0, 0, 0, 0.1);*/
  }
</style>

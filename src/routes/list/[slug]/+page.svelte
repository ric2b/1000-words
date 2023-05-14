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

  import { CardPicker } from '$lib/card_picker.js';
  import { calculateEloRating } from '$lib/elo_rating.js';

  export let data;
  $: ({ listMetadata, selectedList, phrases } = data)

  let completion = 0
  let user_rating = (browser ? parseInt(localStorage.getItem(`user_rating`)) : null) || 1200;

  $: if(browser) { localStorage.setItem(`user_rating`, user_rating) };
  // $: if(browser) { localStorage.setItem(`list_${selectedList}_cardPickerState`, cardPicker.stringifyState) };

  let translationRevealed = false
  let listMenu, menuAnchor;

  $: currentListMeta = listMetadata.lists[selectedList];
  $: header = currentListMeta.header;

  $: card_picker = loadCardPicker(selectedList, phrases);
  $: current_card = card_picker.selectNextCard();

  // $: console.log([card_picker.newCard(current_card.face), current_card.rating, user_rating]);
  // $: console.log(!card_picker.newCard(current_card.face) && current_card.rating > user_rating)
  $: difficultWord = !card_picker.newCard(current_card.face) && current_card.rating > user_rating + 400;

  function loadCardPicker(selectedList, phrases) {
    const cardPicker = new CardPicker(phrases);
    const stringifiedCardsSeen = browser ? localStorage.getItem(`list_${selectedList}_cards_seen`) : '[]';
    const stringifiedCardScores = browser ? localStorage.getItem(`list_${selectedList}_cardScores`) : '[]';

    cardPicker.loadSeen(stringifiedCardsSeen);
    cardPicker.loadStringifiedScores(stringifiedCardScores);
    completion = cardPicker.progress();

    return cardPicker;
  }

  const markKnown = () => nextCard({ card_was_known: true });
  const markUnknown = () => nextCard({ card_was_known: false });

  function nextCard({ card_was_known }) {
    const { newUserEloRating, newCardEloRating } = calculateEloRating({
      userEloRating: user_rating,
      cardEloRating: current_card.rating,
      actualOutcome: card_was_known ? 1 : 0,
    });

    user_rating = newUserEloRating;
    current_card.rating = newCardEloRating;

    translationRevealed = false;
    card_picker.markSeen(current_card.face);
    current_card = card_picker.selectNextCard();
    completion = card_picker.progress();

    saveState();
  }

  function open_list_menu() {
    listMenu.setOpen(true);
  }

  function saveState() {
    if (!browser) { return }

    localStorage.setItem(`list_${selectedList}_cards_seen`, card_picker.stringifySeen());
    localStorage.setItem(`list_${selectedList}_cardScores`, card_picker.stringifyScores());
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

  <Content style="min-height: 120px">
    <div style="display: flex; align-items: center; justify-content: center;">
      {#if browser}
        <h2>{current_card.face}</h2>
      {/if}
      {#if difficultWord}
        <Wrapper>
          <span class="material-icons" style="margin-left: 10px;  margin-top: 3px; opacity: 0.4">error</span>
          <Tooltip yPos="above">Schwieriges Wort</Tooltip>
        </Wrapper>
      {/if}
    </div>
    {#if browser}
      <p id="translation" class:translationRevealed>{current_card.answer}</p>
    {/if}
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

      <Wrapper>
        <IconButton class="material-icons" ripple={false} disabled={translationRevealed} on:click={() => translationRevealed = true}>visibility</IconButton>
        <Tooltip yPos="above">Antworten</Tooltip>
      </Wrapper>

      <Wrapper>
        <IconButton class="material-icons" ripple={false} on:click={markUnknown}>cancel</IconButton>
        <Tooltip yPos="above">Nicht Bekannt</Tooltip>
      </Wrapper>

      <!-- <IconButton class="material-icons" ripple={false} on:click={markKnown}>done</IconButton> -->
      <Wrapper>
        <IconButton class="material-icons" ripple={false} on:click={markKnown}>check_circle</IconButton>
        <Tooltip yPos="above">Bekannt</Tooltip>
      </Wrapper>
      <!-- <IconButton class="material-icons" ripple={false} on:click={markKnown}>verified</IconButton> -->
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
    filter: blur(6px);
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

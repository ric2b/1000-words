<script context="module">
  import { base, assets } from '$app/paths';

  export async function load({ page, fetch, session, context }) {
    // https://1000mostcommonwords.com/1000-most-common-german-words/ + https://www.convertjson.com/html-table-to-json.htm
    const selectedList = page.params.slug || 'de-en';
    const url = `${assets}/lists/${selectedList}.csv`;
    // const url = `${page.params.slug || defaultList}.csv`;
    const response = await fetch(url);

    if (response.ok) {
      return { props: { 
        selectedList: selectedList, 
        phrases: await response.text().then(text => text.split('\n').map(x => x.split(','))) 
      } };
    }

    return { status: response.status, error: new Error(`Could not load ${url}`) };
  }
</script>

<script>
  import { goto, prefetch } from '$app/navigation';
  import { browser } from '$app/env';

  import Card, { Content, PrimaryAction, Actions, ActionButtons, ActionIcons, } from '@smui/card';
  import Button, { Label } from '@smui/button';
  import IconButton, { Icon } from '@smui/icon-button';
  import Slider from '@smui/slider';
  import FormField from '@smui/form-field';
  import Tooltip, { Wrapper } from '@smui/tooltip';
  import Menu from '@smui/menu';
  import List, { Item, Separator, Text } from '@smui/list';

  import "@fontsource/roboto/400.css"
  import "@fontsource/roboto/700.css"
  import "@fontsource/roboto-mono"
  import 'material-icons/iconfont/material-icons.css';

  export let selectedList;
  export let phrases;

  let translationRevealed, listMenu, menuAnchor;

  $: currentWordIndex = browser ? Number(localStorage.getItem(`list_${selectedList}_currentWordIndex`) || '0') : 0;
  $: [currentPhrase, currentTranslation] = phrases[currentWordIndex];

  $: {
    currentWordIndex; // block is triggered when current index changes
    translationRevealed = false;
    if (browser) { localStorage.setItem(`list_${selectedList}_currentWordIndex`, currentWordIndex) }
  }

  $: finished = currentWordIndex + 1 >= phrases.length;

  let header = 'Die 1000 häufigsten deutschen Wörter';

  function open_list_menu() {
    listMenu.setOpen(true);
    prefetch('/list/de-en');
    prefetch('/list/verben-mit-praepositionen');
  }
</script>

<svelte:head>
  <link rel="stylesheet" href={`${assets}/css/bare.css`} />

  <title>1000 words</title>
</svelte:head>

<h1 on:mouseenter={() => header = 'The 1000 most common german words'} on:mouseleave={() => header = 'Die 1000 häufigsten deutschen Wörter'}>{header}</h1>

<a hidden href="/list/de-en">1</a>
<a hidden href="/list/verben-mit-praepositionen">2</a>

<Card>
  {#key phrases.length} <!-- Workaround for https://github.com/hperrin/svelte-material-ui/issues/247 -->
    <Slider discrete tickMarks bind:value={currentWordIndex} max={phrases.length-1} />
  {/key}

  <Content>
    <h2>{currentPhrase}</h2>
    <p id="translation" class:translationRevealed>{currentTranslation}</p>
  </Content>
  
  <Actions>
    <ActionButtons>
      <div bind:this={menuAnchor}>
        <Button on:click={open_list_menu}>Änderungsliste</Button>
        <Menu bind:this={listMenu} bind:anchorElement={menuAnchor} anchorCorner="BOTTOM_LEFT">
          <List>
            <Item on:SMUI:action={() => goto('/list/de-en')}><Text>Deutsch - English</Text></Item>
            <Item on:SMUI:action={() => goto('/list/verben-mit-praepositionen')}><Text>Verben mit Präpositionen</Text></Item>
          </List>
        </Menu>
      </div>
    </ActionButtons>

    <ActionIcons>
      <!-- https://github.com/hperrin/svelte-material-ui/issues/108#issuecomment-782583530 -->
      <Wrapper>
        <IconButton class="material-icons" ripple={false} disabled={translationRevealed} on:click={() => translationRevealed = true}>visibility</IconButton>
        <Tooltip yPos="above">Reveal</Tooltip>
      </Wrapper>
      
      <Wrapper>
        <IconButton on:click={() => finished ? currentWordIndex = 0 : currentWordIndex += 1} bind:pressed={finished}>
          <Icon class="material-icons">arrow_forward</Icon>
          <Icon class="material-icons" on>replay</Icon>
        </IconButton>
        <Tooltip yPos="above">Get next word</Tooltip>
      </Wrapper>
    </ActionIcons>
  </Actions>
</Card>

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
    filter: blur(4px);
  }

  #translation.translationRevealed {
    filter: none;
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
import adapter_static from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
export default {
  kit: {
    adapter: adapter_static(),

    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',

    prerender: {
      pages: ['*', '/list/de-en'],  // need to add one of the dynamic pages, svelte kit will then find the other lists based on prefetch calls
    },
    
    vite: { 
      /*optimizeDeps: {
        include: ['@material/ripple', '@material/dom', '@material/icon-button']
      },*/
      /*ssr: {
        noExternal: ['@smui/card', '@smui/button', '@smui/icon-button', '@smui/slider', '@smui/form-field', '@smui/menu', '@smui/select', '@smui/list', '@material/typography']
      }*/
    }
  },
};

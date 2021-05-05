const adapter_static = require('@sveltejs/adapter-static');

/** @type {import('@sveltejs/kit').Config} */
module.exports = {
  kit: {
    adapter: adapter_static(),

    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    
    vite: { 
      /*optimizeDeps: {
        include: ['@material/ripple', '@material/dom', '@material/icon-button']
      },*/
      ssr: {
        noExternal: ['@smui/card', '@smui/button', '@smui/icon-button']
      }
    }
  },
};


# 1000 Words

A simple flashcard application, deployable to any static file server.


## Demo

https://1000-words.pages.dev
  
## Contributing

To add a new list of cards:

1. Create the csv files and add it to the `static/lists` folder.
1. Add an entry to the `static/lists/metadata.json`.

  
## Deployment

To build the static files run:

```bash
  yarn run build
```
The files will end up in the `build` directory.

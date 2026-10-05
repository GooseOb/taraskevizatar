This repo contains only the code of
[the frontend](https://gooseob.github.io/taraskevizatar/)

JSON files and taraskevization logic had been moved to
[this repo](https://github.com/GooseOb/taraskevizer)

# Taraskevizatar

This project is a web interface for the latest version of
[Taraskevizer package](https://npmjs.com/package/taraskevizer)

## Development

The converter itself lives in the local `../taraskevizer` module
(the yet unreleased version), so check it out next to this repo and build it first:

```sh
git clone https://github.com/GooseOb/taraskevizer.git ../taraskevizer
cd ../taraskevizer && bun install && bun run build && cd ../taraskevizatar
```

Then:

```sh
bun install
bun dev
```

```sh
npm install
npm run dev
```

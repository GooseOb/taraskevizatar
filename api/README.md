# Currently not working and not up to date

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## How it works

#### Send request to http://localhost:3000/

#### Body DTO (JSON):

```
{
    "text": text to convert
    "alphabet": 0 - cyrillic, 1 - latin, 2 - arabic
    "alwaysJ": 0 - only i letter, 1 - й letter after vowels
}
```

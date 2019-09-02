# Todown

> Markdown driven tasks

### 🚧 Abandoned project. I moved to [Things 3][1] instead.

## Getting started

- Clone [this repository](https://github.com/phortuin/todown)
- Install dependencies
- Build
- Run development server & watcher

```bash
$ git clone git@github.com:phortuin/todown.git
$ npm i
$ npm run build
$ npm run dev
```

## Running local database for persistence

> Requirements: Homebrew

```bash
$ brew services start mongo
```

## Environment variables

You need a `.env` file and a `.env.production` file to be able to respectively run development & deploy to production. The format is provided in `.env.example`.

[1]: https://culturedcode.com/things/

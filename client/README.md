# Taraskevizatar

It's a simple web application that uses the newest
[Taraskevizer package](https://npmjs.com/package/taraskevizer)
version

# Development

- Make sure you have [Bun](https://bun.sh) installed

- Install dependencies and build the project
  (First build is required for correct service worker work)

  ```sh
  bun install
  bun run build
  ```

- Start the development
  ```sh
  bun dev
  ```

Before commit, you'll be prompted to update cache.
If that causing issues with the command line,
pass `-n` to the `git commit` command.

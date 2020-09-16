<img align="right" src="https://raw.githubusercontent.com/d-zone-org/d-zone/rewrite/packages/webapp-yakshaving/doodle.svg" width="300px" alt="Yakshaving logo"/>

# Yakshaving

> Simple, powerful and smart wrapper around rollup

## Installation

```bash
yarn add yakshaving
```

## Features

- Fast development mode

  - Bundles app in development mode with sucrase rather than typescript.
  - Separate bundle for dependencies, prevents waste of time in treeshaking them.
  - Caching of the dependency bundle, prevents building of dependencies every restart.

- Built in configuration validation, so you don't end up breaking something by mistake.

- Think it needs more? [Let us know!](https://github.com/d-zone-org/d-zone/issues/new)

## Documentation

- Check out the documentation [here](https://github.com/d-zone-org/d-zone/tree/rewrite/packages/webapp-yakshaving/docs)!
- Want an example? See how we are using it [here](https://github.com/d-zone-org/d-zone/blob/rewrite/packages/webapp/build.config.js).

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

## License

Copyright 2020 Sagnik Pradhan

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

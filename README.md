# esbuild-plugin-copy-import
<a href="https://npm.im/esbuild-plugin-copy-import"><img src="https://badgen.net/npm/v/esbuild-plugin-copy-import"></a> <a href="https://packagephobia.now.sh/result?p=esbuild-plugin-copy-import"><img src="https://packagephobia.now.sh/badge?p=esbuild-plugin-copy-import"></a>

An esbuild plugin that copies imported module to the destination directory and sets the imported value to the relative path.

## Install

```bash
npm install -D esbuild-plugin-copy-import
```

## Usage

```js
import copyImportPlugin from 'esbuild-plugin-copy-import';

/** @type esbuild.BuildOptions */
const config = {
  plugins: [
    copyImportPlugin({
      // Custom filter, defaults to /.+\?url/
      filter: /\.wasm\?url$/,
      // Optional path inside the `outDir`
      outRelativePath: 'dist-wasm',
      // Defaults to `?url.
      // This will be stripped from the import path.
      suffix: '?url',
    }),
  ],
  // ...
};
```

```ts
import wasmModuleUrl from 'example.wasm?url';

// In this example, this runs inside ./dist/index.js
// and the `example.wasm` file is located at ./dist/dist-wasm/example.wasm
assert.strictEqual(wasmModuleUrl, './dist-wasm/example.wasm');
```

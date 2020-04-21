import autoPreprocess from 'svelte-preprocess';

export default {
  // we'll extract any component CSS out into
  // a separate file — better for performance
  css: css => {
    css.write('public/build/bundle.css');
  },
  // Preprocess scss and ts
  preprocess: autoPreprocess({
    scss: {
      renderSync: true,
    },
    typescript: {
      transpileOnly: true,
      tsconfigFile: './tsconfig.json'
    }
  })
}
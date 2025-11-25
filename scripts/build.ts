const isDev = process.argv.includes(`--dev`)

await Bun.build({
  entrypoints: [`core/easyscript.ts`],
  minify: !isDev,
  outdir: isDev ? `workspace` : `dist`,
  target: `bun`,
  // external: [],
})

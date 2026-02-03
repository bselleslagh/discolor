# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
bun x sv create --template minimal --types ts --add prettier eslint vitest="usages:unit,component" playwright tailwindcss="plugins:typography,forms" mcp="ide:claude-code+setup:remote" --install bun discolor
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Deploying to Vercel

To deploy this app to Vercel:

1. Import your repository in Vercel
2. Configure the following settings:

| Setting | Value |
|---------|-------|
| Framework Preset | SvelteKit |
| Root Directory | `./` |
| Build Command | `bun run build` |
| Output Directory | `svelte-kit/output` |
| Install Command | `bun install` |

3. Add the following environment variables:

| Variable | Description |
|----------|-------------|
| `PUBLIC_CONVEX_URL` | Your Convex deployment URL |
| `RESEND_API_KEY` | Your Resend API key for email functionality |

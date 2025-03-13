# Provider Staffing Calculator

A calculator app to determine the recommended number of technicians based on a medical practice's yearly revenue projections.

## Features

- Calculate staffing needs based on projected yearly revenue
- Support for both Medical Doctors (MD) and Optometric Doctors (OD)
- Adjustable revenue per FTE assumptions
- Visual representation of staff with diverse emoji representations
- Mobile responsive design

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Preview Production Build Locally

```sh
npm run preview
```

## Deployment to Vercel

This application is configured for easy deployment to Vercel.

### Deploy with Vercel CLI

1. Install the Vercel CLI:
   ```sh
   npm install -g vercel
   ```

2. Login to Vercel:
   ```sh
   vercel login
   ```

3. Deploy the application:
   ```sh
   vercel
   ```

### Deploy with Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your repository in the Vercel dashboard
3. Vercel will automatically detect the Vue/Vite configuration and deploy your application

The application will be built using the standard build command `npm run build` and the output directory is set to `dist` in the vercel.json configuration file.

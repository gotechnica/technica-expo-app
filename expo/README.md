# Hackathon Expo App React Client

## Local development

Run `npm install` in this directory to install the necessary packages.

Run `npm run start` to boot up the React project. You'll be able to access the client via `localhost:3000` or `localhost:3000` depending on how you decide to format your URL [(more information here)]().

For consistent code style, use [Prettier](https://github.com/prettier/prettier).

## Deployment via gh-pages

This React client is setup to be easily deployable via GitHub Pages.

### Step 1: Choose your public expo URL

You have two options for the URL: `https://your-hackathon.com/expo` or `https://expo.your-hackathon.com`.

##### Option 1: `your-hackathon.com/expo`

- In package.json, update homepage to `https://your-hackathon.github.io/expo`
- In public/404.html, update segmentCount to `1`
- In src/App.js, update the Router basename to `"/expo"`
- Rename this current repo to just `expo`

##### Option 2: `expo.your-hackathon.com`

- In package.json, update homepage to `https://your-hackathon.github.io`
- In public/404.html, update segmentCount to `0`
- In src/App.js, update the Router basename to `"/"`
- Add a file `CNAME` in the /public directory with expo.your-hackathon.com

### Step 2: Update your backend API URL

Head over to [the backend API directory]() for instructions on deploying your backend/API server! Once that's up, replace `prodURL` in `src/Backend.js` with your backend URL.

### Step 3: Deploy the frontend!

Run `npm run deploy` in this directory. Wait a few minutes, and your expo client should be up at the URL you chose in step 1!
NOTE: This only deploys your _client_ (frontend), not the backend.

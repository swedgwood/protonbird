# Protonbird: Better Proton Bridge Integration for Thunderbird

**WIP! Definitely nowhere near finished, proceed at your own risk!**

Support versions:
- Thunderbird 102

Features:
- Currently the only planned feature is to have Proton Mail's labels show up as tags on Thunderbird by creating tags for each subfolder under `Labels/`, and syncing the state of labelled mail with Thunderbird tags.


## Development env

To run locally, you just need to `npm install`, and then run `npm run build`, and the built files will lie in `dist`.

You can load this as a temporary extension in Thunderbird using [this guide](https://developer.thunderbird.net/add-ons/mailextensions/hello-world-add-on#installing). The manifest file you will want to load will be at `dist/manifest.json`.

### Flatpak notes

If you want to develop using the Flatpak version of Thunderbird, as of writing (13th Aug 2022) you have to use the beta branch to get version 102, and you must manually add access to the `dist` directory to the permissions granted to the app.
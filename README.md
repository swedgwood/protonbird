# Thunderbird Addon: Proton Mail Label Support

**WIP! Definitely nowhere near finished, proceed at your own risk!**

Support versions:
- Thunderbird 102

This extension allows you to use Thunderbird's tag features to interact with existing Proton Mail labels.

Proton Bridge represents labels as subfolders under the `/Labels/` folder, i.e. if you have a label called `Receipt`, there will be a folder called `/Labels/Receipt`. If you add this label to a message, then in Thunderbird this message will exist both in it's original location (i.e. Inbox, Archive, or whatever folder you have it in) as well as within the `/Labels/<label name>` folder. This is annoying, and Thunderbird supports a native form of labelling called 'tags', so this extension simply creates tags for each label, and syncs the state of those tags with the state of labels. 

## Development env

To run locally, you just need to `npm install`, and then run `npm run build`, and the built files will lie in `dist`.

You can load this as a temporary extension in Thunderbird using [this guide](https://developer.thunderbird.net/add-ons/mailextensions/hello-world-add-on#installing). The manifest file you will want to load will be at `dist/manifest.json`.

### Flatpak notes

If you want to develop using the Flatpak version of Thunderbird, as of writing (13th Aug 2022) you have to use the beta branch to get version 102, and you must manually add access to the `dist` directory to the permissions granted to the app.
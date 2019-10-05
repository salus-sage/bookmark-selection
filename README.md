# Bookmark selection

Browser extension to bookmark any selected text in a web page.

## Demo (Chromium-based browsers)

- Download this repo and unzip
- Open `chrome://extensions/`
- Enable developer mode
- Click on Load Unpacked
- Choose the `dist/chrome/` from the unzipped directory
- Visit any web page, highlight text and right click
- Click on Bookmark Selection
- Bookmark will be saved to `Other bookmarks/` folder

------

## Contribute

This project uses [webextension-toolbox](https://github.com/HaNdTriX/webextension-toolbox) for building/bundling the source code. It provides the following commands:

### Install

	$ npm install

### Development

    npm run dev chrome
    npm run dev firefox
    npm run dev opera
    npm run dev edge

### Build

    npm run build chrome
    npm run build firefox
    npm run build opera
    npm run build edge

# Bookmark selection

Browser extension to bookmark any selected text in a web page.

## Status

Proof of concept. Tested in recent Firefox and Chromium. Functional, but might fail to highlight the
bookmarked text in some edge cases.

This project uses a [proposed syntax](https://www.w3.org/TR/selectors-states/#frags)
for encoding an arbitrary selection in the fragment identifier of a URL, as implemented in [selector-state-frags](https://github.com/Treora/selector-state-frags/).

## Usage

In a browser with this extension installed:

- Open any web page
- Select some text in the page, then right-click to open the context menu
- There should now be the option *Bookmark selected text*; click it
- A folder called *Quotes* should appear among your bookmarks, containing a
  bookmark the selected quote
- The bookmarked quote will be highlighted, also when reopening the page (if the
  quote will still be present in the renewed page)

## Install from source

To run it Chromium-based browsers:

- Clone/download this repo
- In the repo’s directory, run `npm install`, then `npm run build chrome`
- In the browser, visit `about:extensions`
- Enable developer mode, click on *Load unpacked*
- Choose the `dist/chrome/` from this directory

This project uses [webextension-toolbox](https://github.com/webextension-toolbox/webextension-toolbox)
for building/bundling the source code. Look there for more details about
building the extension.

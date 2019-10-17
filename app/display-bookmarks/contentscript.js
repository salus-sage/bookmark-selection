import { createTextQuoteSelector } from '@annotator/dom';
import { parse } from '@annotator/fragment-identifier';
import highlightRange from 'dom-highlight-range';
import { remoteFunction } from 'webextension-rpc';

const retrieveBookmarks = remoteFunction('retrieveBookmarks');

async function displayBookmarksInPage() {
  const bookmarks = await retrieveBookmarks({ url: document.URL });

  for (const bookmark of bookmarks) {
    const fragmentIdentifier = bookmark.url.split('#')[1];
    if (fragmentIdentifier === undefined) continue;
    let selector;
    try {
      selector = parse(fragmentIdentifier).selector;
    } catch (err) {
      // Likely a fragment identifier we do not understand; skip it.
      continue
    }

    // Find the matching text(s) in the body, and highlight each.
    const matches = createTextQuoteSelector(selector)(document.body);
    for await (const match of matches) {
      highlightRange(match, 'a', {
        href: bookmark.url,
        style: 'all: unset; background: #ffff0099; cursor: pointer;',
      });
    }
  }
}

displayBookmarksInPage();

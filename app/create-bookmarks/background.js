import { stringify } from '@annotator/fragment-identifier';
import { remoteFunction } from 'webextension-rpc';

function createPreciseUrl(url, selector) {
	// const { preferredUrlStandard } = await browser.storage.local.get('preferredUrlStandard');
	const preferredUrlStandard = 'WebAnnotationNote';

	const properUrl = url.split('#')[0];
	const currentFragment = url.split('#')[1] || '';

	if (preferredUrlStandard === 'WebAnnotationNote') {
		// Syntax for annotator note https://www.w3.org/TR/selectors-states/#frags
		const fragmentIdentifier = stringify(selector);
		return properUrl + '#' + fragmentIdentifier;
	}
	else if (preferredUrlStandard === 'scrollToTextFragment') {
		// See https://wicg.github.io/ScrollToTextFragment/
		const maybePrefix = selector.prefix ? encodeURIComponent(selector.prefix) + '-,' : '';
		const textStart = encodeURIComponent(selector.exact);
		const maybeSuffix = selector.suffix ? ',-' + encodeURIComponent(selector.suffix) : '';
		return `${properUrl}#${currentFragment}:~:text=${maybePrefix}${textStart}${maybeSuffix}`;
	}
	else if (preferredUrlStandard === 'fragmention') {
		// See http://www.kevinmarks.com/fragmentions.html
		return properUrl + '#' + encodeURIComponent(selector.exact);
	}
}

async function createBookmark(tab, selectedText) {
	const selector = await remoteFunction('describeSelection', { tabId: tab.id })();
	const bookmarkUrl = createPreciseUrl(tab.url, selector);
	const bookmarkTitle = `“${selectedText}”`;

	await browser.bookmarks.create({
	  title: bookmarkTitle,
	  url: bookmarkUrl,
	});
}

function onContextMenuClick(info, tab) {
  switch (info.menuItemId) {
    case 'bookmark-selection':
      createBookmark(tab, info.selectionText);
      break;
  }
}

async function init() {
  // Create context menu item
  browser.contextMenus.create({
    id: 'bookmark-selection',
    title: 'Bookmark selected text',
    contexts: ['selection'],
  });

  browser.contextMenus.onClicked.addListener(onContextMenuClick);
}

init();

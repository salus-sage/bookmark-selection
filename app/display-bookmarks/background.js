import whenAllSettled from 'when-all-settled';
import { makeRemotelyCallable, remoteFunction } from 'webextension-rpc';

function normaliseUrl(url) {
	// Remove the fragment identifier, if any.
	url = url.split('#')[0]
	// Ignore the URL scheme for authority based URLs (see e.g. RFC 2396 section 3). In other words,
	// we ignore whether a document was loaded through https or http or whatever other protocol.
	url = url.replace(/^[^:]+:\/\//, '//')
	return url
}

async function retrieveBookmarks({ url }) {
	const bookmarkTree = await browser.bookmarks.getTree();

	const toScan = [...bookmarkTree];
	const allBookmarks = [];

	while (toScan.length > 0) {
		const next = toScan.shift();
		if (next.url) {
			allBookmarks.push(next);
		}
		if (next.children) {
			toScan.push(...next.children);
		}
	}

	const matchingBookmarks = allBookmarks.filter(
		bookmark => normaliseUrl(bookmark.url) === normaliseUrl(url)
	);

	return matchingBookmarks;
}

makeRemotelyCallable({
	retrieveBookmarks,
});

async function onBookmarkChange() {
	// Update the bookmarks in every tab.
	const tabs = await browser.tabs.query({ status: 'complete' });
	const refreshingPromises = tabs.map(tab =>
		remoteFunction('displayBookmarksInPage', { tabId: tab.id })()
	);
	// Wait until all tabs completed, ignoring any errors.
	await whenAllSettled(refreshingPromises);
}

browser.bookmarks.onCreated.addListener(onBookmarkChange);
browser.bookmarks.onRemoved.addListener(onBookmarkChange);
browser.bookmarks.onChanged.addListener(onBookmarkChange);
if (browser.bookmarks.onImportEnded) {
	browser.bookmarks.onImportEnded.addListener(onBookmarkChange);
}

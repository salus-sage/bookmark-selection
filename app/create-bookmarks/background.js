import { stringify } from 'selector-state-frags';
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

	const bookmarkFolderId = await getBookmarkFolderId();

	await browser.bookmarks.create({
		title: bookmarkTitle,
		url: bookmarkUrl,
		parentId: bookmarkFolderId,
	});
}

// Get the id of the folder for our bookmarks. Create the folder if needed.
async function getBookmarkFolderId() {
	// Read the supposed folder id from our settings.
	let { bookmarkFolderId } = await browser.storage.local.get('bookmarkFolderId');

	// Check if the folder exists and is indeed a folder.
	try {
		const bookmarkFolder = await browser.bookmarks.get(bookmarkFolderId);
		if (bookmarkFolder.url) throw new Error;
	} catch (err) {
		// Ignore the existing, faulty setting. We will update the stored value further below.
		bookmarkFolderId = undefined;
	}

	if (bookmarkFolderId === undefined) {
		const bookmarkFolderName = browser.i18n.getMessage('bookmarkFolderName');

		// First, try find an existing folder with matching title (perhaps from our previous life).
		const foundFolders = await browser.bookmarks.search({ title: bookmarkFolderName });
		if (foundFolders.length > 0) {
			// Found (at least) one. We use it.
			bookmarkFolderId = foundFolders[0].id;
		}
		else {
			// Create a new folder.
			const bookmarkTree = await browser.bookmarks.getTree();
			// Simply take the root’s first child: probably the main bookmarks menu or bookmarks toolbar.
			const mainBookmarksFolderId = bookmarkTree[0].children[0].id;
			const bookmarkFolder = await browser.bookmarks.create({
				parentId: mainBookmarksFolderId,
				title: bookmarkFolderName,
			});
			bookmarkFolderId = bookmarkFolder.id;
		}

		// Update our settings to remember the folder.
		await browser.storage.local.set({ bookmarkFolderId });
	}

	return bookmarkFolderId;
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
		title: browser.i18n.getMessage('bookmarkSelectionContextMenuItem'),
		contexts: ['selection'],
	});

	browser.contextMenus.onClicked.addListener(onContextMenuClick);
}

init();

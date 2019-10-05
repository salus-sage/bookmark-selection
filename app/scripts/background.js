async function createBookmark(tab, selectedText) {
	const bookmarkTitle = tab.title + ' – ' + selectedText;

	await browser.bookmarks.create({
	  title: bookmarkTitle,
	  url: tab.url, // TODO put selection into fragment identifier
	});
}

function onContextMenuClick(info, tab) {
  switch (info.menuItemId) {
    case 'bookmark-selection':
      const created = createBookmark(tab, info.selectionText);
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

  browser.contextMenus.onClicked.addListener(onContextMenuClick)
}

init();

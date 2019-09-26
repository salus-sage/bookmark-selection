browser.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion)
});

browser.browserAction.setBadgeText({
  text: `'Allo'`
});

console.log(`'Allo 'Allo! Event Page for Browser Action`)

var onCreated = function(e){
	if (browser.runtime.lastError) {
	    console.log("error creating item:" + browser.runtime.lastError);
	  } else {
	    console.log("item created successfully");

	  }
}

//Create Bookmark
var createBookmark = function(info, tab){
	var newTitle = tab.title+" - "+info.selectionText

	var createBookmark = browser.bookmarks.create({
	  title: newTitle,
	  url: tab.url
	});
	return createBookmark;
}
//Create context menu
browser.contextMenus.create({
  id: "log-selection",
  title: "Bookmark Selection '%s'",
  contexts: ["selection"]
}, onCreated);

browser.contextMenus.onClicked.addListener(function(info, tab) {
	console.log(info, tab, browser);
  switch (info.menuItemId) {
    case "log-selection":
      //console.log(info.selectionText);
      var created = createBookmark(info, tab);
      //console.log(created, "Bookmark Created")
      break;
    
  }
})
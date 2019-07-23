function execute(tab){
	let windowWidth = 0;
	let windowHeight = 0;
	// alert(screen.availWidth)
	chrome.windows.getCurrent(function(w) {
		windowWidth = screen.availWidth; //タスクバーなどを除くモニタ有効域の幅
		windowHeight = screen.availHeight; //タスクバーなどを除くモニタ有効域の高さ

		chrome.windows.update(w.id,
							{
								left: screen.availLeft,
								top: screen.availTop,
								width: windowWidth / 2, 
								height: windowHeight
							}, 
							function(){
									chrome.tabs.executeScript(tab.id,
										{
											code: 'window.scrollTo(0, 0);'
										}
									);});
		chrome.tabs.reload(tab.id);
		chrome.windows.create(
								{
									url: "http://translate.google.com/translate?u=" + tab.url, 
									left: windowWidth / 2 + screen.availLeft,
									top: screen.availTop,
									width: windowWidth / 2, 
									height: windowHeight
								}, 
		)
	});	
}

chrome.tabs.onUpdated.addListener(function(tabid,info,tab){
  if (info.status === 'complete') {
    chrome.tabs.executeScript(tabid,{
		code: `let searchBar = document.getElementById('wtgbr');
				let langSelect = document.getElementById('gt-c');
				let target = document.getElementById("contentframe");        
				searchBar.parentNode.removeChild(searchBar);
				langSelect.parentNode.removeChild(langSelect); 
				target.style.top = "0px";
				target.style.marginTop = "0px"`
    });
  }
});
chrome.runtime.onInstalled.addListener(function () {
	chrome.contextMenus.create({
		"id" : "menu",
		"title" : "原文と翻訳文を比較する",
		"type" : "normal",
	});
});
chrome.contextMenus.onClicked.addListener(function(info, tab){
	execute(tab);
});
chrome.browserAction.onClicked.addListener(function(tab){
	execute(tab);
});
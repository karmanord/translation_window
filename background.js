function excecute(tab){
	let windowWidth = 0;
	let windowHeight = 0;
	chrome.tabs.reload(tab.id);
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
							() => {
									chrome.tabs.executeScript(tab.id,
										{
											code: 'window.scrollTo(0, 0);'
										}
									);});
							
		chrome.windows.create(
								{
									url: "http://translate.google.com/translate?u=" + tab.url, 
									left: windowWidth / 2 + screen.availLeft,
									top: screen.availTop,
									width: windowWidth / 2, 
									height: windowHeight
								}, 
								tab => {
										document.addEventListener('DOMContentLoaded', function() {
											chrome.tabs.executeScript(tab.id,
												{
													code: `searchBar = document.getElementById('wtgbr');
														translationFromTo = document.getElementById('gt-c');
														body.removeChild(searchBar);
														body.removeChild(translationFromTo);`
												}
											)
										});
								});
	});	
}

chrome.runtime.onInstalled.addListener(function () {
	chrome.contextMenus.create({
		"title" : "原文と翻訳文を比較する",
		"type" : "normal",
	});
});
chrome.contextMenus.onClicked.addListener(function(info, tab){
	excecute(tab);
});
chrome.browserAction.onClicked.addListener(function(tab){
	excecute(tab);
});

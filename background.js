let originalTabId = -1;
let translateTabId = -1;

function execute(tab){
	originalTabId = tab.id
	chrome.windows.getCurrent(function(w) {
		chrome.windows.update(w.id,
							{
								left: screen.availLeft,
								top: screen.availTop,
								width: screen.availWidth / 2, 
								height: screen.availHeight
							}, function(){
									chrome.tabs.executeScript(originalTabId,
										{
											code: 'window.scrollTo(0, 0);'
										}
									);});
		chrome.tabs.reload(originalTabId);
		chrome.windows.create(
								{
									url: tab.url, 
									// url: "http://translate.google.com/translate?u=" + tab.url, 
									left: screen.availWidth / 2 + screen.availLeft,
									top: screen.availTop,
									width: screen.availWidth / 2, 
									height: screen.availHeight
								}, function(window){
									translateTabId = window.tabs[0].id
								} 
		)
	});	
}

// 翻訳ページ起動完了時、上部のGoogle翻訳バーを削除する
chrome.tabs.onUpdated.addListener(function(tabid,info,tab){
  if (info.status === 'complete' && translateTabId === tabid) {
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

let currentTabId = "";
let date = new Date();
let prevTimeStamp = date.getTime();
let prevElement = "";

let shift = false;
document.onkeydown = function(e) {
  shift = e.shiftKey;
}
document.onkeyup = function(e) {
  shift = e.shiftKey;
}
chrome.runtime.onConnect.addListener(function(port) {
	if (port.name == "sync_scroll") {
		console.log(shift);
		port.onMessage.addListener(function(msg, sendingPort) {
			// console.log(currentTabId);
			// console.log(translateTabId);
			// console.log(sendingPort.sender.tab.id);

			date = new Date();
			let currentTimeStamp = date.getTime();
			if (currentTabId && currentTabId !== sendingPort.sender.tab.id && currentTimeStamp - prevTimeStamp < 500){
				return;
			}
			prevTimeStamp = currentTimeStamp;
			currentTabId = sendingPort.sender.tab.id;
			let sendTabId = "";
			if (originalTabId === currentTabId) {
				sendTabId = translateTabId;
			} else {
				sendTabId = originalTabId;
			}
			// let currentElement = msg.querySelector;
			// if (!prevElement || prevElement === currentElement){
				let X = msg.window_scrollX;
				let Y = msg.window_scrollY;
				chrome.tabs.executeScript(sendTabId,
					{
						code: `window.scrollTo(${X}, ${Y});`
					}
				)
			// } else {
			// 	console.log(msg.element);
			// 	chrome.tabs.executeScript(sendTabId,
			// 		{
			// 			// code: `${msg.element}.scrollIntoView();`
			// 		}
			// 	)
			// }
			// prevElement = currentElement;
				// console.log(prevElement);

		});
	}
});

// 右クリックのメニュー内容
chrome.runtime.onInstalled.addListener(function() {
	chrome.contextMenus.create({
		"id": "menu",
		"title": "原文と翻訳文を比較する",
		"type": "normal",
	});
});

// ブラウザのアイコン押下時
chrome.browserAction.onClicked.addListener(function(tab){
	execute(tab);
});

// 右クリックのメニュー押下時
chrome.contextMenus.onClicked.addListener(function(info, tab){
	execute(tab);
});

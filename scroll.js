// 各ウィンドウに、スクロール量をbackgroundに投げるイベントを仕込む
let port = chrome.runtime.connect({name: "sync_scroll"});
window.addEventListener('scroll', function() {
	port.postMessage({
		window_scrollX: window.scrollX,
		window_scrollY: window.scrollY
	});
},false);
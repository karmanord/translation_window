// window.onload = function() {
let shift = false;
document.onkeydown = function(e) {
  shift = e.shiftKey;
}
document.onkeyup = function(e) {
  shift = e.shiftKey;
}
 // 各ウィンドウに、スクロール量をbackgroundに投げるイベントを仕込む
let port = chrome.runtime.connect({name: "sync_scroll"});
  window.addEventListener('scroll', function() {
    if (!shift){
    port.postMessage({
        window_scrollX: window.scrollX,
        window_scrollY: window.scrollY
    });
  }
});

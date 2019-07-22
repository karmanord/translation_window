translationButton=document.getElementById("translationButton");
translationButton.addEventListener('click', function(){
	createPage();
});

originalButton=document.getElementById("originalButton");
originalButton.addEventListener('click', function(){
	createPage();
});

function createPage(){
	let tablink = ""
	let windowWidth = 0
	let windowHeight = 0

	chrome.tabs.getSelected(null,function(tab) {
	tablink = tab.url;
	});
	chrome.windows.getCurrent(function(window) {
	
	windowWidth = screen.availWidth; //タスクバーなどを除くモニタ有効域の幅
	windowHeight = screen.availHeight; //タスクバーなどを除くモニタ有効域の高さ
    
    chrome.windows.update(window.id,
                          {
                            left: screen.availLeft,
                            top: screen.availTop,
                            width: windowWidth / 2, 
                            height: windowHeight
                          }, 
                          tab => {});
    chrome.windows.create({
                            url: "http://translate.google.com/translate?u=" + tablink, 
                            left: windowWidth / 2 + screen.availLeft,
                            top: screen.availTop,
                            width: windowWidth / 2, 
                            height: windowHeight
                          }, 
                          tab => {
                            searchBar = document.getElementById('wtgbr');
                            translationFromTo = document.getElementById('gt-c');
                            body.removeChild(searchBar);
                          });
	});
}


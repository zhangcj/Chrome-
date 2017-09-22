$(function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {}, function (response) {
        });
    });
    //var reader = new FileReader();
    //reader.readAsDataURL("http://www.verycd.com/favicon.ico?v=2");
})
//chrome.extension.onMessage.addListener(
//  function (request, sender, sendResponse) {
//      sendResponse(11);
//  }
//);
//chrome.extension.onRequest.addListener(
//    function (data) {
//        alert(1);
//    }
//);
//chrome.runtime.onMessage.addListener(
//  function (request, sender, sendResponse) {
//      console.log(sender.tab ?
//                  "来自内容脚本：" + sender.tab.url :
//                  "来自扩展程序");
//      if (request.greeting == "您好")
//          sendResponse({ farewell: "再见" });
//  });
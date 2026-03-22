// 확장 아이콘 클릭 시 사이드패널 열기
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId })
})

// 설치 시 사이드패널 기본 동작 설정
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setOptions({ enabled: true })
})

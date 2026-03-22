import { useCallback } from 'react'

// 현재 열린 탭 목록 가져오기
export function useTabs() {
  const getCurrentTabs = useCallback(() =>
    new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.query({ currentWindow: true }, (tabs) => {
          resolve(
            tabs
              .filter((t) => t.url && !t.url.startsWith('chrome://'))
              .map((t) => ({ url: t.url, title: t.title, favIconUrl: t.favIconUrl }))
          )
        })
      } else {
        // 개발 환경 더미 데이터
        resolve([
          { url: 'https://figma.com/file/abc', title: 'Figma - 버튼 컴포넌트' },
          { url: 'https://github.com/my/repo', title: 'GitHub - my/repo' },
          { url: 'https://notion.so/my-doc', title: 'Notion - 기획서' },
        ])
      }
    }),
  [])

  const openTabs = useCallback((tabs) => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      tabs.forEach((tab) => chrome.tabs.create({ url: tab.url }))
    } else {
      tabs.forEach((tab) => window.open(tab.url, '_blank'))
    }
  }, [])

  return { getCurrentTabs, openTabs }
}

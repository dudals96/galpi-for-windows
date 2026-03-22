import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

// chrome.storage.sync 가 없을 때(개발 환경) localStorage 폴백
const storage = {
  get: (key) =>
    new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get(key, (result) => resolve(result[key] ?? []))
      } else {
        const raw = localStorage.getItem(key)
        resolve(raw ? JSON.parse(raw) : [])
      }
    }),
  set: (key, value) =>
    new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set({ [key]: value }, resolve)
      } else {
        localStorage.setItem(key, JSON.stringify(value))
        resolve()
      }
    }),
}

const STORAGE_KEY = 'galpi_contexts'

export function useContexts() {
  const [contexts, setContexts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    storage.get(STORAGE_KEY).then((data) => {
      setContexts(data)
      setLoading(false)
    })
  }, [])

  const save = useCallback(async (updated) => {
    setContexts(updated)
    await storage.set(STORAGE_KEY, updated)
  }, [])

  const addContext = useCallback(async ({ name, color, tabs, memo }) => {
    const newContext = {
      id: uuidv4(),
      name,
      color,
      tabs,
      memo: memo ?? '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    await save([...contexts, newContext])
    return newContext
  }, [contexts, save])

  const updateContext = useCallback(async (id, changes) => {
    const updated = contexts.map((c) =>
      c.id === id ? { ...c, ...changes, updatedAt: Date.now() } : c
    )
    await save(updated)
  }, [contexts, save])

  const deleteContext = useCallback(async (id) => {
    await save(contexts.filter((c) => c.id !== id))
  }, [contexts, save])

  return { contexts, loading, addContext, updateContext, deleteContext }
}

import { useState } from 'react'
import { useContexts } from './hooks/useContexts'
import { useTabs } from './hooks/useTabs'
import { ContextCard } from './components/ContextCard'
import { SaveModal } from './components/SaveModal'
import './App.css'

export default function App() {
  const { contexts, loading, addContext, updateContext, deleteContext } = useContexts()
  const { getCurrentTabs, openTabs } = useTabs()
  const [showModal, setShowModal] = useState(false)
  const [pendingTabs, setPendingTabs] = useState([])
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleSaveCurrent = async () => {
    const tabs = await getCurrentTabs()
    if (tabs.length === 0) return
    setPendingTabs(tabs)
    setShowModal(true)
  }

  const handleModalSave = async ({ name, color, tabs }) => {
    await addContext({ name, color, tabs })
    setShowModal(false)
    setPendingTabs([])
  }

  const handleDeleteConfirmed = async () => {
    if (deleteConfirm) {
      await deleteContext(deleteConfirm)
      setDeleteConfirm(null)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <span className="logo">📌</span>
          <h1 className="app-title">갈피</h1>
        </div>
        <button className="btn-save-current" onClick={handleSaveCurrent} title="현재 탭들을 컨텍스트로 저장">
          + 저장
        </button>
      </header>

      <main className="app-body">
        {loading ? (
          <div className="empty-state">
            <div className="spinner" />
          </div>
        ) : contexts.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">🗂️</p>
            <p className="empty-title">저장된 작업 맥락이 없어요</p>
            <p className="empty-desc">
              탭을 열고 <strong>+ 저장</strong>을 눌러<br />
              지금 작업을 보관해 보세요
            </p>
            <button className="btn-primary" onClick={handleSaveCurrent}>
              현재 탭 저장하기
            </button>
          </div>
        ) : (
          <ul className="context-list">
            {[...contexts].reverse().map((ctx) => (
              <li key={ctx.id}>
                <ContextCard
                  context={ctx}
                  onResume={() => openTabs(ctx.tabs)}
                  onDelete={() => setDeleteConfirm(ctx.id)}
                  onUpdate={updateContext}
                />
              </li>
            ))}
          </ul>
        )}
      </main>

      {showModal && (
        <SaveModal
          tabs={pendingTabs}
          onSave={handleModalSave}
          onClose={() => { setShowModal(false); setPendingTabs([]) }}
        />
      )}

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <p className="modal-title">삭제할까요?</p>
            <p className="modal-desc">이 작업은 되돌릴 수 없어요.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>취소</button>
              <button className="btn-danger" onClick={handleDeleteConfirmed}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

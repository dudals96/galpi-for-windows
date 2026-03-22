import { useState, useRef, useEffect } from 'react'

const COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // yellow
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#6B7280', // gray
]

function getFavicon(url) {
  try {
    const origin = new URL(url).origin
    return `https://www.google.com/s2/favicons?sz=16&domain_url=${origin}`
  } catch {
    return null
  }
}

export function ContextCard({ context, onResume, onDelete, onUpdate }) {
  const [expanded, setExpanded] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [nameValue, setNameValue] = useState(context.name)
  const [editingMemo, setEditingMemo] = useState(false)
  const [memoValue, setMemoValue] = useState(context.memo)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const nameRef = useRef(null)
  const memoRef = useRef(null)

  useEffect(() => { if (editingName) nameRef.current?.focus() }, [editingName])
  useEffect(() => { if (editingMemo) memoRef.current?.focus() }, [editingMemo])

  const commitName = () => {
    const trimmed = nameValue.trim()
    if (trimmed && trimmed !== context.name) onUpdate(context.id, { name: trimmed })
    setEditingName(false)
  }

  const commitMemo = () => {
    if (memoValue !== context.memo) onUpdate(context.id, { memo: memoValue })
    setEditingMemo(false)
  }

  return (
    <div className="context-card">
      <div className="card-header" onClick={() => setExpanded((v) => !v)}>
        <div className="card-title-row">
          <div
            className="color-dot"
            style={{ backgroundColor: context.color }}
            onClick={(e) => { e.stopPropagation(); setShowColorPicker((v) => !v) }}
            title="색상 변경"
          />
          {showColorPicker && (
            <div className="color-picker" onClick={(e) => e.stopPropagation()}>
              {COLORS.map((c) => (
                <div
                  key={c}
                  className="color-option"
                  style={{ backgroundColor: c, outline: c === context.color ? '2px solid #fff' : 'none' }}
                  onClick={() => { onUpdate(context.id, { color: c }); setShowColorPicker(false) }}
                />
              ))}
            </div>
          )}

          {editingName ? (
            <input
              ref={nameRef}
              className="name-input"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={commitName}
              onKeyDown={(e) => { if (e.key === 'Enter') commitName(); if (e.key === 'Escape') { setNameValue(context.name); setEditingName(false) } }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className="card-name"
              onDoubleClick={(e) => { e.stopPropagation(); setEditingName(true) }}
              title="더블클릭으로 이름 편집"
            >
              {context.name}
            </span>
          )}

          <span className="tab-count">{context.tabs.length}개</span>
        </div>

        <div className="card-actions" onClick={(e) => e.stopPropagation()}>
          <button className="btn-resume" onClick={onResume} title="탭 모두 열기">▶</button>
          <button className="btn-delete" onClick={onDelete} title="삭제">✕</button>
          <span className="expand-icon">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div className="card-body">
          <ul className="tab-list">
            {context.tabs.map((tab, i) => (
              <li key={i} className="tab-item">
                {getFavicon(tab.url) && (
                  <img src={getFavicon(tab.url)} alt="" className="tab-favicon" width={14} height={14} />
                )}
                <a href={tab.url} target="_blank" rel="noreferrer" className="tab-title" title={tab.url}>
                  {tab.title || tab.url}
                </a>
              </li>
            ))}
          </ul>

          <div className="memo-section">
            {editingMemo ? (
              <textarea
                ref={memoRef}
                className="memo-input"
                value={memoValue}
                placeholder="메모 추가..."
                onChange={(e) => setMemoValue(e.target.value)}
                onBlur={commitMemo}
                rows={3}
              />
            ) : (
              <p
                className={`memo-text ${!context.memo ? 'memo-placeholder' : ''}`}
                onClick={() => setEditingMemo(true)}
                title="클릭으로 메모 편집"
              >
                {context.memo || '메모 추가...'}
              </p>
            )}
          </div>

          <p className="card-date">
            {new Date(context.updatedAt).toLocaleDateString('ko-KR', {
              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>
      )}
    </div>
  )
}

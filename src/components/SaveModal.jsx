import { useState, useEffect, useRef } from 'react'

const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#06B6D4', '#6B7280',
]

export function SaveModal({ tabs, onSave, onClose }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(COLORS[Math.floor(Math.random() * COLORS.length)])
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onSave({ name: trimmed, color, tabs })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">현재 탭 저장</h3>
        <p className="modal-tab-count">{tabs.length}개 탭</p>

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className="modal-name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="컨텍스트 이름 (예: A 프로젝트)"
            onKeyDown={(e) => { if (e.key === 'Escape') onClose() }}
          />

          <div className="modal-colors">
            {COLORS.map((c) => (
              <div
                key={c}
                className="color-option"
                style={{
                  backgroundColor: c,
                  outline: c === color ? '2px solid rgba(255,255,255,0.9)' : 'none',
                  transform: c === color ? 'scale(1.2)' : 'scale(1)',
                }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>취소</button>
            <button type="submit" className="btn-primary" disabled={!name.trim()}>저장</button>
          </div>
        </form>
      </div>
    </div>
  )
}

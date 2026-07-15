import { useEffect } from 'react'

export default function ConfirmDialog({ open, title, message, confirmLabel, busy, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return
    function handleKey(e) {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal-box"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="confirm-dialog-title" className="modal-title">
          {title}
        </h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button type="button" className="btn-confirm-no" onClick={onCancel} disabled={busy}>
            No
          </button>
          <button type="button" className="btn-confirm-yes" onClick={onConfirm} disabled={busy}>
            {busy ? 'Deleting…' : confirmLabel || 'Yes'}
          </button>
        </div>
      </div>
    </div>
  )
}
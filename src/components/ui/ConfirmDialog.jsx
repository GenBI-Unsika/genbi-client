import React from 'react';
import Modal from './Modal.jsx';

export default function ConfirmDialog({ isOpen, title, description, confirmText = 'Ya', cancelText = 'Tidak', tone = 'default', onConfirm, onCancel }) {
  const confirmClass = tone === 'danger' ? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-300' : 'bg-primary-600 hover:bg-primary-700 focus-visible:ring-primary-300';

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title || 'Konfirmasi'}>
      {description ? <p className="text-sm text-gray-600">{description}</p> : null}

      <div className="mt-6 flex items-center justify-end gap-2">
        <button type="button" onClick={onCancel} className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          {cancelText}
        </button>
        <button type="button" onClick={onConfirm} className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 ${confirmClass}`}>
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}

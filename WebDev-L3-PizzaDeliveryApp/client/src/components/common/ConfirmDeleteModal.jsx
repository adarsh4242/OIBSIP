import Modal from "./Modal";

export default function ConfirmDeleteModal({ product, loading, onClose, onConfirm }) {
  return <Modal open={Boolean(product)} title="Delete product" onClose={onClose}>
    <p className="text-black/65">Delete <strong>{product?.name}</strong>? This action cannot be undone.</p>
    <div className="mt-6 flex justify-end gap-3"><button className="btn-muted" onClick={onClose}>Cancel</button><button className="rounded-full bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700" disabled={loading} onClick={onConfirm}>{loading ? "Deleting..." : "Delete"}</button></div>
  </Modal>;
}

import { useEffect, useState } from "react";
import Modal from "../common/Modal";

const blankForm = { name: "", description: "", price: "", discountPrice: "", category: "veg", stock: 0, images: "", isFeatured: false, isActive: true };

export default function ProductFormModal({ open, product, loading, onClose, onSubmit }) {
  const [form, setForm] = useState(blankForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    setForm(product ? { ...blankForm, ...product, images: (product.images || []).join(", ") } : blankForm);
  }, [open, product]);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.description.trim() || form.price === "" || Number(form.price) < 0) {
      setError("Name, description, and a valid price are required.");
      return;
    }
    onSubmit({
      name: form.name.trim(), description: form.description.trim(), price: Number(form.price),
      discountPrice: form.discountPrice === "" ? undefined : Number(form.discountPrice),
      category: form.category, stock: Math.max(Number(form.stock) || 0, 0),
      images: form.images.split(",").map((image) => image.trim()).filter(Boolean),
      isFeatured: Boolean(form.isFeatured), isActive: Boolean(form.isActive),
    });
  };

  const preview = form.images.split(",").map((image) => image.trim()).find(Boolean);
  return <Modal open={open} title={product ? "Edit product" : "Add product"} onClose={onClose}>
    <form className="max-h-[75vh] space-y-4 overflow-y-auto pr-1" onSubmit={submit}>
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {preview && <img className="h-36 w-full rounded-2xl object-cover" src={preview} alt="Product preview" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
      <input className="input" name="name" placeholder="Product name" value={form.name} onChange={update} required />
      <textarea className="input min-h-28" name="description" placeholder="Description" value={form.description} onChange={update} required />
      <div className="grid gap-3 sm:grid-cols-2"><input className="input" name="price" type="number" min="0" step="0.01" placeholder="Price" value={form.price} onChange={update} required /><input className="input" name="discountPrice" type="number" min="0" step="0.01" placeholder="Discount price (optional)" value={form.discountPrice} onChange={update} /></div>
      <div className="grid gap-3 sm:grid-cols-2"><select className="input" name="category" value={form.category} onChange={update}><option value="veg">Veg</option><option value="non-veg">Non-veg</option><option value="sides">Sides</option><option value="drinks">Drinks</option></select><input className="input" name="stock" type="number" min="0" placeholder="Stock" value={form.stock} onChange={update} /></div>
      <input className="input" name="images" placeholder="Image URLs separated by commas" value={form.images} onChange={update} />
      <div className="flex flex-wrap gap-5 text-sm"><label className="flex items-center gap-2"><input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={update} /> Featured</label><label className="flex items-center gap-2"><input type="checkbox" name="isActive" checked={form.isActive} onChange={update} /> Active</label></div>
      <div className="flex justify-end gap-3 border-t pt-4"><button type="button" className="btn-muted" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={loading}>{loading ? "Saving..." : product ? "Save changes" : "Create product"}</button></div>
    </form>
  </Modal>;
}

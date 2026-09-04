import { useEffect, useState } from "react";
import Modal from "../common/Modal";

const emptyProduct = () => ({
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  category: "veg",
  stock: 0,
  images: "",
  isFeatured: false,
  isActive: true,
});

export default function BulkProductFormModal({ open, loading, onClose, onSubmit }) {
  const [products, setProducts] = useState([emptyProduct()]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setProducts([emptyProduct()]);
      setError("");
    }
  }, [open]);

  const updateProduct = (index, event) => {
    const { name, value, type, checked } = event.target;
    setProducts((current) => current.map((product, productIndex) => (
      productIndex === index
        ? { ...product, [name]: type === "checkbox" ? checked : value }
        : product
    )));
  };

  const removeDraft = (index) => {
    setProducts((current) => current.filter((_, productIndex) => productIndex !== index));
  };

  const addDraft = () => setProducts((current) => [...current, emptyProduct()]);

  const submit = (event) => {
    event.preventDefault();
    if (!products.length || products.some((product) => (
      !product.name.trim() || !product.description.trim() || product.price === "" || Number(product.price) < 0
    ))) {
      setError("Every product needs a name, description, and valid price.");
      return;
    }

    onSubmit(products.map((product) => ({
      name: product.name.trim(),
      description: product.description.trim(),
      price: Number(product.price),
      discountPrice: product.discountPrice === "" ? undefined : Number(product.discountPrice),
      category: product.category,
      stock: Math.max(Number(product.stock) || 0, 0),
      images: product.images.split(",").map((image) => image.trim()).filter(Boolean),
      isFeatured: Boolean(product.isFeatured),
      isActive: Boolean(product.isActive),
    })));
  };

  return <Modal open={open} title="Add multiple products" onClose={onClose}>
    <form className="max-h-[75vh] space-y-4 overflow-y-auto pr-1" onSubmit={submit}>
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {products.map((product, index) => <fieldset className="rounded-2xl border border-black/10 p-4" key={index}>
        <div className="mb-3 flex items-center justify-between"><legend className="font-bold">Product {index + 1}</legend>{products.length > 1 && <button type="button" className="text-sm font-semibold text-red-600" onClick={() => removeDraft(index)}>Remove row</button>}</div>
        <div className="space-y-3">
          <input className="input" name="name" placeholder="Product name" value={product.name} onChange={(event) => updateProduct(index, event)} required />
          <textarea className="input min-h-20" name="description" placeholder="Description" value={product.description} onChange={(event) => updateProduct(index, event)} required />
          <div className="grid gap-3 sm:grid-cols-2"><input className="input" name="price" type="number" min="0" step="0.01" placeholder="Price" value={product.price} onChange={(event) => updateProduct(index, event)} required /><input className="input" name="discountPrice" type="number" min="0" step="0.01" placeholder="Discount price" value={product.discountPrice} onChange={(event) => updateProduct(index, event)} /></div>
          <div className="grid gap-3 sm:grid-cols-2"><select className="input" name="category" value={product.category} onChange={(event) => updateProduct(index, event)}><option value="veg">Veg</option><option value="non-veg">Non-veg</option><option value="sides">Sides</option><option value="drinks">Drinks</option></select><input className="input" name="stock" type="number" min="0" placeholder="Stock" value={product.stock} onChange={(event) => updateProduct(index, event)} /></div>
          <input className="input" name="images" placeholder="Image URLs separated by commas" value={product.images} onChange={(event) => updateProduct(index, event)} />
          <div className="flex gap-5 text-sm"><label className="flex items-center gap-2"><input type="checkbox" name="isFeatured" checked={product.isFeatured} onChange={(event) => updateProduct(index, event)} /> Featured</label><label className="flex items-center gap-2"><input type="checkbox" name="isActive" checked={product.isActive} onChange={(event) => updateProduct(index, event)} /> Active</label></div>
        </div>
      </fieldset>)}
      <button type="button" className="btn-muted w-full" onClick={addDraft}>+ Add another row</button>
      <div className="flex justify-end gap-3 border-t pt-4"><button type="button" className="btn-muted" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={loading}>{loading ? "Creating..." : `Create ${products.length} product${products.length === 1 ? "" : "s"}`}</button></div>
    </form>
  </Modal>;
}

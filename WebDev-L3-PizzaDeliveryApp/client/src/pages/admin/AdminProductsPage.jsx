import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axiosInstance";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ErrorBanner from "../../components/common/ErrorBanner";
import ProductTable from "../../components/admin/ProductTable";
import ProductFormModal from "../../components/admin/ProductFormModal";
import BulkProductFormModal from "../../components/admin/BulkProductFormModal";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [bulkFormOpen, setBulkFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/admin/products");
      setProducts(response.data.products || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const saveProduct = async (payload) => {
    try {
      setSaving(true);
      if (editingProduct) await api.put(`/products/${editingProduct._id}`, payload);
      else await api.post("/products", payload);
      toast.success(editingProduct ? "Product updated" : "Product created");
      setFormOpen(false);
      setEditingProduct(null);
      await fetchProducts();
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const saveMultipleProducts = async (payloads) => {
    try {
      setSaving(true);
      await Promise.all(payloads.map((payload) => api.post("/products", payload)));
      toast.success(`${payloads.length} product${payloads.length === 1 ? "" : "s"} created`);
      setBulkFormOpen(false);
      await fetchProducts();
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || "Failed to create products");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async () => {
    if (!deletingProduct) return;
    try {
      setDeleting(true);
      await api.delete(`/products/${deletingProduct._id}`);
      toast.success("Product deleted");
      setDeletingProduct(null);
      await fetchProducts();
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  return <section>
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="font-bold uppercase tracking-widest text-ember">Admin</p><h1 className="text-4xl font-black">Manage products</h1><p className="mt-2 text-black/55">Create, edit, and remove products shown in your public menu.</p></div><div className="flex flex-wrap gap-3"><button className="btn-muted" onClick={() => setBulkFormOpen(true)}>+ Add Multiple</button><button className="btn-primary" onClick={() => { setEditingProduct(null); setFormOpen(true); }}>+ Add Product</button></div></div>
    <ErrorBanner message={error} />
    {loading ? <Loader /> : products.length === 0 ? <EmptyState title="No products found" text="Create your first pizza or menu item." /> : <ProductTable products={products} onEdit={(product) => { setEditingProduct(product); setFormOpen(true); }} onDelete={setDeletingProduct} />}
    <ProductFormModal open={formOpen} product={editingProduct} loading={saving} onClose={() => { setFormOpen(false); setEditingProduct(null); }} onSubmit={saveProduct} />
    <BulkProductFormModal open={bulkFormOpen} loading={saving} onClose={() => setBulkFormOpen(false)} onSubmit={saveMultipleProducts} />
    <ConfirmDeleteModal product={deletingProduct} loading={deleting} onClose={() => setDeletingProduct(null)} onConfirm={deleteProduct} />
  </section>;
}

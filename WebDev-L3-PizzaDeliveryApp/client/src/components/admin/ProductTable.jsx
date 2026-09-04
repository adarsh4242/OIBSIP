export default function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
      <table className="min-w-[760px] w-full text-left text-sm">
        <thead className="border-b border-black/10 bg-black/[0.02] text-xs uppercase tracking-wide text-black/50">
          <tr><th className="px-5 py-4">Image</th><th className="px-5 py-4">Name</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Price</th><th className="px-5 py-4">Stock</th><th className="px-5 py-4">Featured</th><th className="px-5 py-4">Active</th><th className="px-5 py-4">Actions</th></tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-black/[0.02]">
              <td className="px-5 py-4"><img className="h-12 w-12 rounded-xl object-cover" src={product.images?.[0] || "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=200"} alt="" /></td>
              <td className="px-5 py-4 font-semibold">{product.name}</td>
              <td className="px-5 py-4 capitalize">{product.category}</td>
              <td className="px-5 py-4">₹{product.price}</td>
              <td className="px-5 py-4">{product.stock}</td>
              <td className="px-5 py-4">{product.isFeatured ? "Yes" : "No"}</td>
              <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${product.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{product.isActive ? "Active" : "Hidden"}</span></td>
              <td className="px-5 py-4"><div className="flex gap-2"><button className="btn-muted px-3 py-1.5 text-xs" onClick={() => onEdit(product)}>Edit</button><button className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100" onClick={() => onDelete(product)}>Delete</button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

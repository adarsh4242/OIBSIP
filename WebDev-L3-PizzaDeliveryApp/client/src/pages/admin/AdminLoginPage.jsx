import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { login } from "../../features/auth/authSlice";
import ErrorBanner from "../../components/common/ErrorBanner";

export default function AdminLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async (event) => {
    event.preventDefault();
    const result = await dispatch(login(form));

    if (result.meta.requestStatus !== "fulfilled") return;
    if (result.payload.user.role !== "admin") {
      toast.error("This account does not have admin access");
      return;
    }

    toast.success("Admin login successful");
    navigate("/admin/products");
  };

  return <div className="mx-auto max-w-md">
    <div className="panel border-t-4 border-ember">
      <p className="font-bold uppercase tracking-widest text-ember">Administration</p>
      <h1 className="mt-2 text-3xl font-black">Admin sign in</h1>
      <p className="mt-2 text-sm text-black/55">Sign in to manage products and orders.</p>
      <ErrorBanner message={error} />
      <form className="mt-6 space-y-4" onSubmit={submit}>
        <input className="input" type="email" placeholder="Admin email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <input className="input" type="password" placeholder="Admin password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        <button className="btn-primary w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in as admin"}</button>
      </form>
      <Link className="mt-5 inline-block text-sm font-semibold text-ember" to="/login">Regular customer login</Link>
    </div>
  </div>;
}

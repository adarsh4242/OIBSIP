import { useState } from "react";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const pizzas = [
  { id: 1, name: "Margherita", price: 199 },
  { id: 2, name: "Farmhouse", price: 249 },
  { id: 3, name: "Peppy Paneer", price: 299 },
  { id: 4, name: "Veg Extravaganza", price: 349 }
];

function App() {
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [errors, setErrors] = useState({});
  const [statusFilter, setStatusFilter] = useState("All");
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: ""
  });

  const addToCart = (pizza) => {
    const existingItem = cart.find((item) => item.id === pizza.id);

    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item.id === pizza.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...pizza, quantity: 1 }]);
    }
  };

  const removeFromCart = (pizzaId) => {
    const existingItem = cart.find((item) => item.id === pizzaId);

    if (existingItem.quantity === 1) {
      setCart(cart.filter((item) => item.id !== pizzaId));
    } else {
      const updatedCart = cart.map((item) =>
        item.id === pizzaId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      setCart(updatedCart);
    }
  };

  const clearCart = () => {
    setCart([]);
    setShowCheckout(false);
    setErrors({});
    setCustomer({
      name: "",
      phone: "",
      address: ""
    });
  };

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const validateForm = () => {
    const newErrors = {};

    if (!customer.name.trim() || customer.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!/^\d{10}$/.test(customer.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!customer.address.trim() || customer.address.trim().length < 5) {
      newErrors.address = "Address must be at least 5 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setMessage("");

    if (cart.length === 0) {
      setMessage("Your cart is empty");
      setMessageType("error");
      return;
    }

    if (!validateForm()) {
      setMessage("Please fix the form errors");
      setMessageType("error");
      return;
    }

    const orderData = {
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      cart,
      totalPrice
    };

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Order placed successfully!");
        setMessageType("success");
        setCart([]);
        setCustomer({
          name: "",
          phone: "",
          address: ""
        });
        setErrors({});
        setShowCheckout(false);
        fetchOrders();
      } else {
        setMessage(data.message || "Failed to place order");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Order error:", error);
      setMessage("Failed to place order");
      setMessageType("error");
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders`);
      const data = await response.json();

      if (response.ok) {
        setOrders(data);
        setShowOrders(true);
      } else {
        setMessage(data.message || "Failed to fetch orders");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
      setMessage("Failed to fetch orders");
      setMessageType("error");
    }
  };

  const deleteOrder = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Order deleted successfully");
        setMessageType("success");
        setOrders(orders.filter((order) => order._id !== id));
      } else {
        setMessage(data.message || "Failed to delete order");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Delete order error:", error);
      setMessage("Failed to delete order");
      setMessageType("error");
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Order status updated successfully");
        setMessageType("success");
        setOrders(
          orders.map((order) =>
            order._id === id ? { ...order, status: newStatus } : order
          )
        );
      } else {
        setMessage(data.message || "Failed to update order status");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Update status error:", error);
      setMessage("Failed to update order status");
      setMessageType("error");
    }
  };

  const filteredOrders =
    statusFilter === "All"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  return (
    <div className="App">
      <h1>Pizza Delivery App</h1>

      {message && (
        <div className={`alert-box ${messageType === "success" ? "success" : "error"}`}>
          {message}
        </div>
      )}

      <h2>Our Menu</h2>
      <div className="pizza-list">
        {pizzas.map((pizza) => (
          <div key={pizza.id} className="pizza-card">
            <h3>{pizza.name}</h3>
            <p>Price: ₹{pizza.price}</p>
            <button onClick={() => addToCart(pizza)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <h2>Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="cart-section">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <span>
                {item.name} - ₹{item.price} x {item.quantity}
              </span>
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))}

          <h3>Total: ₹{totalPrice}</h3>

          <div className="cart-buttons">
            <button onClick={clearCart}>Clear Cart</button>
            <button onClick={() => setShowCheckout(true)}>
              Proceed to Checkout
            </button>
          </div>

          {showCheckout && (
            <form className="checkout-form" onSubmit={handleCheckout}>
              <h3>Checkout Form</h3>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={customer.name}
                onChange={handleChange}
                required
              />
              {errors.name && <p className="error-text">{errors.name}</p>}

              <input
                type="text"
                name="phone"
                placeholder="Enter your phone"
                value={customer.phone}
                onChange={handleChange}
                required
              />
              {errors.phone && <p className="error-text">{errors.phone}</p>}

              <textarea
                name="address"
                placeholder="Enter your address"
                value={customer.address}
                onChange={handleChange}
                required
              />
              {errors.address && <p className="error-text">{errors.address}</p>}

              <button type="submit">Place Order</button>
            </form>
          )}
        </div>
      )}

      <div className="view-orders-wrapper">
        <button onClick={fetchOrders}>View Orders</button>
      </div>

      {showOrders && (
        <div className="orders-section">
          <div className="orders-header">
            <h2>All Orders</h2>

            <div className="filter-box">
              <label htmlFor="statusFilter">Filter by Status:</label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Preparing">Preparing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <p>No orders found for selected status.</p>
          ) : (
            filteredOrders.map((order) => (
              <div key={order._id} className="order-card">
                <h3>{order.name}</h3>
                <p>Phone: {order.phone}</p>
                <p>Address: {order.address}</p>
                <p>Total Price: ₹{order.totalPrice}</p>
                <p>Status: {order.status}</p>

                <div className="status-row">
                  <label htmlFor={`status-${order._id}`}>Update Status:</label>
                  <select
                    id={`status-${order._id}`}
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order._id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                <p className="ordered-items">
                  Ordered Items:
                  {order.cart.map((item, index) => (
                    <span key={index}>
                      {" "}
                      {item.name} x {item.quantity}
                      {index < order.cart.length - 1 ? "," : ""}
                    </span>
                  ))}
                </p>

                <button onClick={() => deleteOrder(order._id)}>
                  Delete Order
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default App;
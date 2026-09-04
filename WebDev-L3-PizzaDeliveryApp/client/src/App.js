import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const getItemKey = (item) => item._id || item.id || item.name;

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:5000/api/menu");
      if (!res.ok) throw new Error("Failed to fetch menu");
      const data = await res.json();
      setMenu(data);
    } catch (err) {
      setError("Failed to fetch menu");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setMessage("Failed to fetch orders");
    }
  }, []);

  const addToCart = (pizza) => {
    const pizzaKey = getItemKey(pizza);

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => getItemKey(item) === pizzaKey);

      if (existingItem) {
        return prevCart.map((item) =>
          getItemKey(item) === pizzaKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { ...pizza, quantity: 1 }];
    });
  };

  const removeFromCart = (pizzaKey) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          getItemKey(item) === pizzaKey
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      setMessage("Your cart is empty");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
          total: getTotalPrice(),
        }),
      });

      if (!res.ok) throw new Error("Failed to place order");

      setMessage("Order placed successfully");
      setCart([]);
      fetchOrders();
    } catch (err) {
      setMessage("Failed to place order");
    }
  };

  const MenuPage = () => (
    <div className="page">
      <h2>Our Menu</h2>

      {loading ? (
        <p>Loading menu...</p>
      ) : menu.length === 0 ? (
        <p>No pizzas available</p>
      ) : (
        <div className="grid">
          {menu.map((pizza) => (
            <div key={getItemKey(pizza)} className="card">
              <h3>{pizza.name}</h3>
              <p>Price: ₹{pizza.price}</p>
              <button className="btn" onClick={() => addToCart(pizza)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const CartPage = () => (
    <div className="page">
      <h2>Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="grid">
          {cart.map((item) => (
            <div key={getItemKey(item)} className="card">
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>
              <p>Qty: {item.quantity}</p>
              <p>Total: ₹{item.price * item.quantity}</p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button className="btn" onClick={() => addToCart(item)}>+</button>
                <button className="btn danger" onClick={() => removeFromCart(getItemKey(item))}>-</button>
              </div>
            </div>
          ))}

          <div className="summary">
            <h3>Total Cart Price: ₹{getTotalPrice()}</h3>
            <button className="btn" onClick={placeOrder}>Place Order</button>
          </div>
        </div>
      )}
    </div>
  );

  const OrdersPage = () => {
    useEffect(() => {
      fetchOrders();
    }, []);

    return (
      <div className="page">
        <h2>Orders</h2>
        <button className="btn" onClick={fetchOrders}>Refresh Orders</button>

        {orders.length === 0 ? (
          <p style={{ marginTop: "20px" }}>No orders found</p>
        ) : (
          <div className="grid" style={{ marginTop: "20px" }}>
            {orders.map((order, index) => (
              <div key={order._id || index} className="card">
                <h3>Order #{index + 1}</h3>
                <p>Total: ₹{order.total}</p>
                <ul>
                  {order.items?.map((item, i) => (
                    <li key={i}>
                      {item.name} - Qty: {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Router>
      <div className="app">
        <style>{`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
          }

          body {
            background: #f4f4f4;
          }

          .app {
            min-height: 100vh;
            background: #f4f4f4;
            color: #222;
            padding: 20px;
          }

          h1 {
            text-align: center;
            margin-bottom: 20px;
            color: #d35400;
          }

          h2 {
            margin-bottom: 16px;
          }

          nav {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-bottom: 30px;
            flex-wrap: wrap;
          }

          nav a {
            text-decoration: none;
            color: white;
            background: #d35400;
            padding: 10px 16px;
            border-radius: 8px;
            font-weight: bold;
          }

          nav a:hover {
            background: #a84300;
          }

          .page {
            max-width: 900px;
            margin: auto;
          }

          .grid {
            display: grid;
            gap: 15px;
          }

          .card {
            background: white;
            border-radius: 10px;
            padding: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          }

          .card h3 {
            margin-bottom: 10px;
            color: #d35400;
          }

          .card p {
            margin-bottom: 8px;
          }

          .btn {
            background: #d35400;
            color: white;
            border: none;
            padding: 8px 14px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
          }

          .btn:hover {
            background: #a84300;
          }

          .danger {
            background: #c0392b;
          }

          .danger:hover {
            background: #922b21;
          }

          .summary {
            background: #fff3e8;
            border: 1px solid #ffd2b3;
            border-radius: 10px;
            padding: 16px;
          }

          .message {
            text-align: center;
            color: green;
            margin-bottom: 15px;
          }

          .error {
            text-align: center;
            color: red;
            margin-bottom: 15px;
          }

          ul {
            margin-top: 10px;
            padding-left: 20px;
          }

          li {
            margin-bottom: 6px;
          }
        `}</style>

        <h1>Pizza Delivery App</h1>

        <nav>
          <Link to="/">Menu</Link>
          <Link to="/cart">
            Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </Link>
          <Link to="/orders">Orders</Link>
        </nav>

        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}

        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
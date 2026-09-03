import { useState } from "react";
import "./App.css";

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
    setCustomer({
      name: "",
      phone: "",
      address: ""
    });
  };

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty");
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
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Order placed successfully!");
        setCart([]);
        setCustomer({
          name: "",
          phone: "",
          address: ""
        });
        setShowCheckout(false);
        fetchOrders();
      } else {
        alert(data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to place order");
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/orders");
      const data = await response.json();

      if (response.ok) {
        setOrders(data);
        setShowOrders(true);
      } else {
        alert(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
      alert("Failed to fetch orders");
    }
  };

  return (
    <div className="App">
      <h1>Pizza Delivery App</h1>
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

              <input
                type="text"
                name="phone"
                placeholder="Enter your phone"
                value={customer.phone}
                onChange={handleChange}
                required
              />

              <textarea
                name="address"
                placeholder="Enter your address"
                value={customer.address}
                onChange={handleChange}
                required
              />

              <button type="submit">Place Order</button>
            </form>
          )}
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        <button onClick={fetchOrders}>View Orders</button>
      </div>

      {showOrders && (
        <div className="orders-section">
          <h2>All Orders</h2>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="order-card">
                <h3>{order.name}</h3>
                <p>Phone: {order.phone}</p>
                <p>Address: {order.address}</p>
                <p>Total Price: ₹{order.totalPrice}</p>
                <p>
                  Ordered Items:
                  {order.cart.map((item, index) => (
                    <span key={index}>
                      {" "}
                      {item.name} x {item.quantity}
                      {index < order.cart.length - 1 ? "," : ""}
                    </span>
                  ))}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default App;
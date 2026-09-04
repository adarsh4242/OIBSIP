import React from "react";

function CartPage({ cart, addToCart, removeFromCart, getTotalPrice, placeOrder }) {
  return (
    <div>
      <h2>Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div
              key={item._id || item.id}
              style={{
                border: "1px solid #999",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>
              <p>Qty: {item.quantity}</p>
              <p>Total: ₹{item.price * item.quantity}</p>
              <button onClick={() => addToCart(item)}>+</button>
              <button onClick={() => removeFromCart(item._id || item.id)} style={{ marginLeft: "10px" }}>-</button>
            </div>
          ))}

          <h3>Total Cart Price: ₹{getTotalPrice()}</h3>
          <button onClick={placeOrder}>Place Order</button>
        </div>
      )}
    </div>
  );
}

export default CartPage;
import React from "react";

function MenuPage({ menu, loading, addToCart }) {
  return (
    <div>
      <h2>Our Menu</h2>

      {loading ? (
        <p>Loading menu...</p>
      ) : menu.length === 0 ? (
        <p>No pizzas available</p>
      ) : (
        menu.map((pizza) => (
          <div
            key={pizza._id || pizza.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <h3>{pizza.name}</h3>
            <p>Price: ₹{pizza.price}</p>
            <button onClick={() => addToCart(pizza)}>Add to Cart</button>
          </div>
        ))
      )}
    </div>
  );
}

export default MenuPage;
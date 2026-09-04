import React, { useEffect } from "react";

function OrdersPage({ orders, fetchOrders }) {
  useEffect(() => {
  fetchOrders();
}, [fetchOrders]);

  return (
    <div>
      <h2>Orders</h2>
      <button onClick={fetchOrders}>Refresh Orders</button>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div style={{ marginTop: "20px" }}>
          {orders.map((order, index) => (
            <div
              key={order._id || index}
              style={{
                border: "1px solid green",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              <h3>Order #{index + 1}</h3>
              <p>Total: ₹{order.total}</p>
              <ul>
                {order.items &&
                  order.items.map((item, i) => (
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
}

export default OrdersPage;
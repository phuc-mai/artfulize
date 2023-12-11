"use client";

import "../../styles/Order.scss";
import Navbar from "@components/Navbar";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Loader from "@components/Loader";

const Order = () => {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const userId = session?.user?._id;
  const orders = session?.user?.orderList;

  console.log(orders);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <div className="orders">
        <h1>Your Orders</h1>
        <div className="order-list">
          {orders?.map((order, index) => (
            <div className="order" key={index}>
              <div className="order-title">
                <h4>Order ID: {order._id}</h4>
                <h2>Total Paid: ${order.paymentInfo.amountPaid}</h2>
              </div>

              <div className="order-items">
                {order.orderItems.map((item) => (
                  <div className="product">
                    <div className="product-info">
                      <img src={item.image} alt={item.title} />
                      <div className="orderItemInfo">
                        <h4>{item.title}</h4>
                      </div>
                    </div>
                    <div className="product-info2">
                      <h3>${item.price}/each</h3>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Order;

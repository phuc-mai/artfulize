"use client";

import "../../styles/Cart.scss";
import Navbar from "@components/Navbar";
import {
  AddCircle,
  RemoveCircle,
  Delete,
  ArrowCircleLeft,
} from "@mui/icons-material";
import variables from "../../styles/variables.module.scss";
import getStripe from "@lib/getStripe";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

const Cart = () => {
  const { data: session, update } = useSession();

  const cart = session?.user?.cart;
  const userId = session?.user?._id;

  const updateCart = async (cart) => {
    const response = await fetch(`/api/users/${userId}/cart`, {
      method: "POST",
      body: JSON.stringify({ cart }),
    });

    const data = await response.json();
    update({ user: { cart: data } });
  };

  const increaseQty = (cartItem) => {
    const newCart = cart.map((item) => {
      if (item === cartItem) {
        item.quantity += 1;
        return item;
      } else return item;
    });
    updateCart(newCart)
  };

  const decreaseQty = (cartItem) => {
    const newCart = cart.map((item) => {
      if (item === cartItem && item.quantity > 1) {
        item.quantity -= 1;
        return item;
      } else return item;
    });
    updateCart(newCart)
  };

  const removeFromCart = (cartItem) => {
    const newCart = cart.filter((item) => item.workId !== cartItem.workId);
    updateCart(newCart)
  };

  const calculateSubtotal = (cart) => {
    return cart?.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);
  };
  
  const subtotal = calculateSubtotal(cart);
  
  const handleCheckout = async () => {
    const stripe = await getStripe();

    const response = await fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cart: cart,
        userId: userId,
      }),
    });

    if (response.statusCode === 500) {
      return;
    }

    const data = await response.json();

    toast.loading("Redirecting...");

    const res =stripe.redirectToCheckout({ sessionId: data.id });
    console.log(res)
    if(res.error) {
      console.log(res.error);
      toast.error(res.error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="cart">
        <div className="details">
          <div className="top">
            <h1>Your Cart</h1>
            <h2>
              Subtotal: <span>${subtotal?.toFixed(2)}</span>
            </h2>
          </div>

          {cart?.length > 0 && (
            <div className="all-items">
              {cart?.map((item, index) => (
                <div className="item" key={index}>
                  <div className="item_info">
                    <img src={item.image} alt="" />
                    <div className="text">
                      <h3>{item.title}</h3>
                      <p>Category: {item.category}</p>
                      <p>Seller: {item.creator.username}</p>
                    </div>
                  </div>

                  <div className="quantity">
                    <AddCircle
                      onClick={() => increaseQty(item)}
                      sx={{
                        fontSize: "18px",
                        color: variables.darkgrey,
                        cursor: "pointer",
                      }}
                    />
                    <h3>{item.quantity}</h3>
                    <RemoveCircle
                      onClick={() => decreaseQty(item)}
                      sx={{
                        fontSize: "18px",
                        color: variables.darkgrey,
                        cursor: "pointer",
                      }}
                    />
                  </div>
                  <div className="price">
                    <h2>{item.quantity * item.price}</h2>
                    <p>${item.price} / each</p>
                  </div>
                  <div className="remove">
                    <Delete
                      onClick={() => removeFromCart(item)}
                      sx={{ cursor: "pointer" }}
                    />
                  </div>
                </div>
              ))}

              <div className="bottom">
                <a href="/">
                  <ArrowCircleLeft /> Continue shopping
                </a>
                <button onClick={() => handleCheckout()}>CHECK OUT NOW</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;

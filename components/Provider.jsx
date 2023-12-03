"use client";

// import { CartProvider } from "@context/CartContext";
import { SessionProvider } from "next-auth/react";

const Provider = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
};

export default Provider;

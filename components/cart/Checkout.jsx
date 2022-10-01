import React from "react";
import { useCartStore } from "@/hooks/useCartStore";

export default function Checkout(props) {
  const checkOutURL = useCartStore((state) => state.cartURL);
  console.log(checkOutURL);
  return (
    <div>
      <iframe src={checkOutURL} frameBorder="20"></iframe>
    </div>
  );
}

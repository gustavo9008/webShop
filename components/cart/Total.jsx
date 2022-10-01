import Link from "next/link";
import React from "react";

export default function Total(props) {
  console.log(props);
  return (
    <aside className="bg-gray-400 h-5/6 p-4 rounded-md mt-14">
      <h3>Order Summary</h3>
      <h4>
        Subtotal :{" "}
        {Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
        }).format(props.cartTotal.subtotalAmount.amount)}
      </h4>
      <h4>
        Tax estimate:{" "}
        {Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
        }).format(props.cartTotal.totalTaxAmount.amount)}
      </h4>
      <h4>
        Order Total:{" "}
        {Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
        }).format(props.cartTotal.totalAmount.amount)}
      </h4>

      {/* <Link href={props.checkoutUrl}>
        <a>Checkout</a>
      </Link> */}
      <a href={props.checkoutUrl}>Checkout</a>
    </aside>
  );
}

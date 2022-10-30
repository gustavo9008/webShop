import Link from "next/link";
import React from "react";

export default function Total(props) {
  // console.log(props.cartTotal);
  return (
    <section className="text-xl bg-gray-600 w-[250px] Psm:m-auto Psm:w-full text-white h-5/6 p-4 rounded-md mt-14">
      <h3>Order Summary</h3>

      <aside className="divide-y divide-solid divide-gray-500">
        <div className="flex justify-between mt-4">
          <h4>Subtotal:</h4>
          <h4 className="font-bold">
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
            }).format(props.cartTotal.subtotalAmount.amount)}
          </h4>
        </div>

        <div className="flex justify-between mt-4">
          <h4>Tax estimate:</h4>
          <h4 className="font-bold">
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
            }).format(props.cartTotal.totalTaxAmount.amount)}
          </h4>
        </div>

        <div className="flex justify-between mt-4">
          <h4>Order Total:</h4>
          <h4 className="font-bold">
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
            }).format(props.cartTotal.totalAmount.amount)}
          </h4>
        </div>
      </aside>
      <span className="text-sm">Shipping is calculated at checout.</span>
      <div className="mt-8">
        <a
          className="flex items-center justify-center rounded-md border border-transparent bg-indigo-500 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-600"
          href={props.checkoutUrl}
        >
          Checkout
        </a>
      </div>
    </section>
  );
}

import React from "react";
import { useCartStore } from "@/hooks/useCartStore";
import { axiosFetch } from "@/utils/axiosFetch.js";
import CartProductCard from "@/components/cart/CartProductCard";
import Total from "./Total";

export default function Cart(props) {
  const cart = useCartStore((state) => state.cartItems);
  const cartEstimate = useCartStore((state) => state.estimatedCost);
  const cartId = useCartStore((state) => state.cartId);
  const addCart = useCartStore((state) => state.addCart);
  const checkOutURL = useCartStore((state) => state.cartURL);

  const gql = String.raw;

  React.useEffect(() => {
    async function loadCart(id) {
      const query = gql`
        query GetCart($cartId: ID!) {
          cart(id: $cartId) {
            id
            checkoutUrl
            totalQuantity
            cost {
              subtotalAmount {
                amount
              }
              totalAmount {
                amount
              }
              totalTaxAmount {
                amount
              }
            }
            estimatedCost {
              totalAmount {
                amount
              }
            }
            lines(first: 100) {
              nodes {
                id
                quantity
                estimatedCost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    quantityAvailable
                    image {
                      altText
                      url
                    }
                    product {
                      id
                      title
                      handle
                    }
                  }
                }
              }
            }
          }
        }
      `;

      let data = {
        query,
        variables: { cartId: id },
        type: "GET_CART",
        subType: "LOAD_CART",
      };

      const res = await axiosFetch("/api/getproducts", data);
      // console.log(res.data);

      if (res.status === 200) {
        res.data.estimatedCost.totalTaxAmount !== null &&
          (await addCart(res.data));
      }
    }
    if (cartId !== null) {
      loadCart(cartId);
    }
  }, [cartId]);

  return (
    <section className="flex justify-between Psm:flex-col">
      <ul className="divide-y divide-solid divide-gray-500">
        <h1 className="text-4xl text-center mb-4 text-white">Shopping Cart</h1>

        {cart !== null &&
          cart.map((item, i) => {
            return <CartProductCard key={i} item={item} />;
          })}
      </ul>

      {cartEstimate !== null && (
        <Total cartTotal={cartEstimate} checkoutUrl={checkOutURL} />
      )}
    </section>
  );
}

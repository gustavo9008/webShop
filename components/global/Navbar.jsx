import Link from "next/link";
import React from "react";
import { useCartStore } from "../../hooks/useCartStore";
import { axiosFetch } from "@/utils/axiosFetch.js";

const Navbar = () => {
  const cartId = useCartStore((state) => state.cartId);
  const cartUrl = useCartStore((state) => state.cartURL);
  const estimatedCost = useCartStore((state) => state.estimatedCost);
  // const cartQuantity = useCartStore((state) => state.cartQuantity);
  const cartQuantity = useCartStore((state) => state.cartQuantity);
  const addCart = useCartStore((state) => state.addCart);
  const addCartUrl = useCartStore((state) => state.addCartURL);
  const gql = String.raw;

  // const query = gql`
  //   mutation CreateCart {
  //     cartCreate {
  //       cart {
  //         checkoutUrl
  //         id
  //       }
  //     }
  //   }
  // `;
  // async function getCartId() {
  //   let data = {
  //     query,
  //     type: "GET_CART",
  //   };
  //   const items = await axiosFetch("/api/getproducts", data);
  //   console.log(items);
  // }
  React.useEffect(() => {
    var localCartData = JSON.parse(window.localStorage.getItem("shopifyCart"));

    const getCartId = async () => {
      const query = gql`
        mutation CreateCart {
          cartCreate {
            cart {
              checkoutUrl
              id
            }
          }
        }
      `;
      let data = {
        query,
        type: "GET_CART",
        subType: "GET_CART_ID",
      };
      // if(localCartData?)

      const cart = await axiosFetch("/api/getproducts", data);
      if (cart.status === 200) {
        localCartData = window.localStorage.setItem(
          "shopifyCart",
          JSON.stringify(cart.data)
        );
        // addCartId(localCartData.id);
        addCart(cart.data);
      }
    };

    const loadCart = async (CartId) => {
      const query = gql`
        query GetCart($cartId: ID!) {
          cart(id: $cartId) {
            id
            checkoutUrl
            totalQuantity
          }
        }
      `;

      let data = {
        query,
        variables: { cartId: CartId },
        type: "GET_CART",
        subType: "GET_LOAD_CART",
      };

      const res = await axiosFetch("/api/getproducts", data);

      if (res.status === 200) {
        res.data.cartId === null && (await getCartId());
        res.data.cartId !== null && (await addCart(res.data));
      }
    };

    if (localCartData) {
      // console.log(localCartData);
      // let newCart = {
      //   cartId: localCartData.id,
      //   checkoutUrl: localCartData.checkoutUrl,
      // };
      // console.log(newCart);
      // localCartData = window.localStorage.setItem(
      //   "shopifyCart",
      //   JSON.stringify(newCart)
      // );
      // console.log(localCartData.id);
      // addCartId(localCartData.id);
      // addCartUrl(localCartData.checkoutUrl);
      loadCart(localCartData.cartId);
    } else {
      getCartId();
    }

    // getCartId();
  }, []);

  return (
    <nav>
      <div className="container px-6 py-3 mx-auto lg:flex lg:justify-between lg:items-center">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/">
              <a className="text-2xl font-bold text-gray-800 dark:text-white lg:text-3xl hover:text-gray-700 dark:hover:text-gray-300">
                WebShop-Shopify
              </a>
            </Link>
          </div>

          {/* <!-- Mobile menu button --> */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
              aria-label="toggle menu"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path
                  fillRule="evenodd"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        {/* <!-- Mobile Menu open: "block", Menu closed: "hidden" --> */}
        <div className="items-center lg:flex">
          <div className="flex flex-col lg:flex-row lg:mx-6">
            <a
              className="my-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 lg:mx-4 lg:my-0"
              href="#"
            >
              Home
            </a>
            <a
              className="my-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 lg:mx-4 lg:my-0"
              href="#"
            >
              Shop
            </a>
            <a
              className="my-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 lg:mx-4 lg:my-0"
              href="#"
            >
              Contact
            </a>
            <a
              className="my-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 lg:mx-4 lg:my-0"
              href="#"
            >
              About
            </a>
          </div>

          <div className="flex justify-center lg:block">
            <Link href={"/cart"}>
              <a className="relative text-gray-700 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-300">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="absolute top-0 -left-4 p-1 text-xs text-white bg-blue-500 rounded-full">
                  {cartQuantity}
                </span>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

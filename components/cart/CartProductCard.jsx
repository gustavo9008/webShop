import React from "react";
import Image from "next/image";
import { useCartStore } from "../../hooks/useCartStore";
import { axiosFetch } from "@/utils/axiosFetch";

const CartCart = (props) => {
  const setAnimateCart = useCartStore((state) => state.setAnimateCart);
  const cartId = useCartStore((state) => state.cartId);
  const addCart = useCartStore((state) => state.addCart);
  const [containerHeight, setContainerHeight] = React.useState(null);
  const [containerWidth, setContainerWidth] = React.useState(null);
  const parentRef = React.useRef();
  const gql = String.raw;

  const sizeColor = props?.item.merchandise.title.split("/");

  const SelectOption = () => {
    // const [selectedValue, setSelectedValue] = React.useState(null);
    let dValue;
    let options = [];

    for (let num = 0; num < props.item.merchandise.quantityAvailable; num++) {
      // const element = array[index];
      if (num + 1 === props.item.quantity) {
        // setSelectedValue(props.item.quantity);
        dValue = props.item.quantity;
        options.push(<option key={num}>{props.item.quantity}</option>);
      } else {
        options.push(<option key={num}>{num + 1}</option>);
      }
      // options.push(
      //   <option key={num} defaultValue={props.item.quantity} value={num + 1}>
      //     {num + 1}
      //   </option>
      // );
      // console.log(options);
    }

    return (
      <select
        defaultValue={dValue}
        onChange={async (e) => {
          setContainerHeight(parentRef.current.clientHeight);
          setContainerWidth(parentRef.current.clientWidth);
          let mutation = {
            cartId: cartId,
            lines: {
              id: props.item.id,
              merchandiseId: props.item.merchandise.id,
              quantity: Number(e.target.value),
            },
          };

          await updateCart(mutation);
        }}
        className="text-black appearance-none block text-sm font-normal bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        name="quantity-select"
        id="qSelect"
      >
        {options}
      </select>
    );
  };

  // for (let num = 0; num < props.item.merchandise.quantityAvailable; num++) {
  //   // const element = array[index];
  //   console.log(props.item.quantity);
  //   console.log(num);
  //   if (num + 1 === props.item.quantity) {
  //     console.log("it equals");
  //     options.push(
  //       <option key={num} selected>
  //         {props.item.quantity}
  //       </option>
  //     );
  //   } else {
  //     options.push(<option key={num}>{num + 1}</option>);
  //   }
  //   // options.push(
  //   //   <option key={num} defaultValue={props.item.quantity} value={num + 1}>
  //   //     {num + 1}
  //   //   </option>
  //   // );
  //   console.log(options);

  function checkSize() {
    setContainerHeight(parentRef.current.clientHeight);
    setContainerWidth(parentRef.current.clientWidth);
    console.log(parentRef.current.clientWidth);
    console.log(parentRef.current.clientHeight);
  }
  // }

  async function updateCart(mutation) {
    const query = gql`
      mutation { cartLinesUpdate(cartId: "${mutation.cartId}" lines: {id: "${mutation.lines.id}", quantity: ${mutation.lines.quantity}}) {
          cart {
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
                      title
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }}
      
    `;

    let data = {
      query,
      variables: null,
      type: "UPDATE_CART",
    };

    const res = await axiosFetch("/api/getproducts", data);
    if (res.status === 200) {
      setAnimateCart(true);
      addCart(res.data);
      setContainerHeight(null);
      setContainerWidth(null);
      setTimeout(() => {
        setAnimateCart(false);
      }, 5000);
    }
  }

  async function deleteItem() {
    const itemToDelete = {
      id: props.item.id,
      merchandiseId: props.item.merchandise.id,
    };

    let query = gql`
      mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
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
                      title
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const data = {
      query,
      variables: {
        cartId: cartId,
        lineIds: [props.item.id],
      },
      type: "DELETE_ITEM_CART",
    };

    const res = await axiosFetch("/api/getproducts", data);
    if (res.status === 200) {
      addCart(res.data);
    }
  }

  return (
    <li
      ref={parentRef}
      className="flex Psm:flex-col justify-between mb-2 p-4 Psm:w-full max-w-lg text-white relative"
    >
      <main className="flex">
        <div className="w-[150px] mr-2">
          <div className="grid grid-rows-1 justify-items-stretch">
            <figure className="aspect-w-4 aspect-h-5 mb-2">
              <Image
                className="object-cover"
                src={props.item.merchandise.image.url}
                layout="fill"
                priority="true"
                alt={props.item.merchandise.image.altText}
                placeholder="blur"
                blurDataURL={props.item.merchandise.image.url}
              />
            </figure>
          </div>
        </div>

        <section>
          <p className="w-[200px] mb-2">
            {props.item.merchandise.product.title}
          </p>
          <span className="block mb-2">
            {sizeColor[0]} | {sizeColor[2]}
          </span>
          <span className="block mb-2">
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
            }).format(props.item.estimatedCost.totalAmount.amount)}
          </span>
        </section>
      </main>

      <aside className="flex Psm:flex-row flex-col justify-between Psm:justify-end">
        <SelectOption />
        {/* //===== delete btn ===== */}
        <span
          onClick={deleteItem}
          className="ml-20 relative top-[5px] block cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </span>
        {/* //===== test size width btn ===== */}
        <span>
          <button onClick={checkSize}>check size</button>
        </span>
      </aside>
      <div
        className="absolute bg-black bg-opacity-20 outline-none focus:outline-none top-0 left-0 rounded-md"
        style={{
          height: containerHeight,
          width: containerWidth,
        }}
      ></div>
    </li>
  );
};

export default CartCart;

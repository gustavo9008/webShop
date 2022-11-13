import React from "react";
import ColorSelect from "./ColorSelect";
import { useCartStore } from "../../hooks/useCartStore";
import { axiosFetch } from "@/utils/axiosFetch";

export default function SingleItem(props) {
  // const cartQuantity = useCartStore((state) => state.cartQuantity);
  const setAnimateCart = useCartStore((state) => state.setAnimateCart);
  const [isPending, startTransition] = React.useTransition();
  const cartId = useCartStore((state) => state.cartId);
  const addCart = useCartStore((state) => state.addCart);
  const [btnState, setBtnState] = React.useState(true);
  const [btnColor, setBtnColor] = React.useState("bg-gray-900");
  //===== state right below is for checking if size option is available on the item, if 0 than no size option is available =====
  const [itemSizeOption] = React.useState(
    props.item.variant.filter((opAv) => opAv.name === "Size").length
  );
  //=====  =====
  const [selectedItem, setSelectedItem] = React.useState({
    id: null,
    color: null,
    size: null,
  });

  // console.log(props.item.variant.filter((opAv) => opAv.name === "Size").length);
  // //===== check for option availble =====
  // if (props.item.variant.filter((opAv) => opAv.name === "Size").length === 0) {
  //   console.log(
  //     props.item.variant.filter((opAv) => opAv.name === "Size").length
  //   );

  //   setSelectedItem(false);
  // }
  let preRenderColor = [
    "bg-yellow-500",
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-gray-500",
    "bg-stone-500",
    "bg-teal-500",
    "bg-purple-500",
    "bg-pink-500",
  ];
  const gql = String.raw;

  function enableBtnCheck() {
    if (itemSizeOption !== 0) {
      setBtnState(false);
      setBtnColor("bg-blue-500");
    }

    if (itemSizeOption === 0) {
      setBtnState(false);
      setBtnColor("bg-blue-500");
    }
  }

  // notes: need to refactored
  const selectOption = (option, sizeColor, type) => {
    let newOptions = {
      ...option,
    };
    function checkSize() {
      if (selectedItem.size) {
        if (selectedItem.id !== option?.id) {
          let selectSize;

          option?.size &&
            (selectSize = sizeColor?.itemQuantity.filter(
              (varSize) => varSize.size === option?.size
            ));

          option?.color &&
            (selectSize = sizeColor.itemQuantity.filter(
              (varSize) => varSize.size === selectedItem?.size
            ));
          newOptions = {
            ...option,
            id: selectSize[0].id,
          };
        }
      }
    }

    // if()
    if (option.color) {
      checkSize();
    }

    startTransition(() => {
      setSelectedItem((prev) => ({
        ...prev,
        ...newOptions,
      }));
    });

    // isPending === false && enableBtnCheck();
  };

  const addToCart = async () => {
    const variantId = selectedItem.id;
    let query = gql`
      mutation AddToCart($cartId: ID!, $variantId: ID!) {
        cartLinesAdd(
          cartId: $cartId
          lines: [{ quantity: 1, merchandiseId: $variantId }]
        ) {
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
      }
    `;

    let data = {
      query,
      variables: { cartId, variantId },
      type: "ADD_TO_CART",
    };

    const res = await axiosFetch("/api/getproducts", data);
    // let newItem = {
    //   cartQuantity: cartCount.cartQuantity + 1,
    //   cartItems: cartCount.cartItems.push({ ...selectedItem }),
    // };
    if (res.status === 200) {
      addCart(res.data);
      setAnimateCart(true);
      setSelectedItem({
        id: null,
        color: null,
        size: null,
      });

      startTransition(() => {
        setBtnState(true);
        setBtnColor("bg-gray-900");
      });
      // setBtnState(true);
      // setBtnColor("bg-gray-900");
      setTimeout(() => {
        setAnimateCart(false);
      }, 5000);
    }
  };

  React.useEffect(() => {
    if (selectedItem.id !== null && selectedItem.color !== null) {
      // console.log("id and color is not null");
      enableBtnCheck();
    }
  }, [selectedItem]);

  return (
    <header className="p-4 Psm:p-2 bg-white dark:bg-gray-800 max-w-[900px] m-auto">
      <div className="flex Psm:flex-col-reverse flex-row-reverse">
        <div className="flex items-center justify-center w-full px-6 py-8 Psm:px-0 lg:w-1/2">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
              <span className="text-blue-600 dark:text-blue-400">
                {props.item.title}
              </span>
            </h2>
            <div>
              {/* price section */}
              <p className="block w-12 p-2 text-white text-xl font-semibold text-center">
                {Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                }).format(props.item.priceRange)}
              </p>

              <div className="text-white">
                {/* color options */}
                <h5>COLOR: {selectedItem.color}</h5>
                <div className="flex justify-start pl-6 gap-6 py-4 flex-wrap">
                  {/* color option func */}
                  {props.item !== null &&
                    props.item.options?.map((size, i) => {
                      // nested map finds size available for each color
                      let selectAvalaibleOption;
                      let colorVal = size.name.split("/");

                      let optionAvailable = props.item.variant.filter(
                        (opAv) => opAv.name === "Size"
                      );

                      if (optionAvailable.length === 0) {
                        selectAvalaibleOption = {
                          color: colorVal[0].toLowerCase(),
                          id: size?.itemQuantity[0].id,
                        };
                      } else {
                        selectAvalaibleOption = {
                          color: colorVal[0].toLowerCase(),
                        };
                      }

                      return (
                        <ColorSelect
                          key={i}
                          selectOption={() => {
                            // before setSelectOption, func check if size is selected

                            selectOption(
                              { ...selectAvalaibleOption },
                              size,
                              "CHANGE_COLOR"
                            );
                          }}
                          colorName={colorVal[0].toLowerCase()}
                          styles={
                            selectedItem.color === colorVal[0].toLowerCase() &&
                            "ring-white ring-offset-black ring ring-offset-4"
                          }
                          colorBtn={colorVal[1].toLowerCase()}
                        />
                      );
                    })}
                  {/* //=====  ===== */}
                </div>
              </div>
              <div className="text-white">
                {/* filter check if size option is available */}
                {itemSizeOption === 1 && <h5 className="pb-4">Size: </h5>}
                {/* //=====  ===== */}
                <div className="flex gap-4 flex-wrap justify-center">
                  {/* //===== load initial size option func, this does not include ids, is simply for loading the size options ===== */}
                  {selectedItem.color === null &&
                    props.item.variant.filter((opAv) => opAv.name === "Size")
                      .length > 0 &&
                    props.item.variant[1]?.values.map((size, i) => {
                      let selectColor =
                        selectedItem.size === size
                          ? "bg-blue-600"
                          : "bg-gray-500 hover:bg-blue-600";
                      return (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            selectOption({ size: size });
                          }}
                          className={`${selectColor} cursor-pointer px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform  rounded-md hover:bg-blue-500 focus:outline-none basis-28`}
                          key={i}
                        >
                          {size}
                        </button>
                      );
                    })}
                  {/* //=====  ===== */}
                  {/* //===== function for chooosing size with ids, loads when user clicks a color in the option of colors ===== */}
                  {selectedItem.color !== null &&
                    props.item.variant.filter((opAv) => opAv.name === "Size")
                      .length > 0 &&
                    props.item.options?.map((size, i) => {
                      // nested map finds size available for each color
                      let sizesbtn = size.itemQuantity.map((sizeOption, i) => {
                        if (
                          sizeOption.color.split("/")[0].toLowerCase() !==
                          selectedItem.color
                        )
                          return;

                        let selectColor =
                          selectedItem.size === sizeOption.size
                            ? "bg-blue-600"
                            : "bg-gray-500 hover:bg-blue-600";

                        return (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              selectOption(
                                {
                                  size: sizeOption.size,
                                  id: sizeOption.id,
                                },
                                size,
                                "CHANGE_SIZE"
                              );
                            }}
                            className={`${selectColor} cursor-pointer px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform  rounded-md hover:bg-blue-500 focus:outline-none basis-28`}
                            key={i}
                          >
                            {sizeOption.size}
                          </button>
                        );
                      });
                      // let selectColor =
                      //   selectedItem.size === size
                      //     ? "bg-blue-600"
                      //     : "bg-gray-500 hover:bg-blue-600";
                      return sizesbtn;
                    })}
                  {}
                </div>
              </div>
            </div>

            <div className="flex flex-col mt-6 space-y-3 lg:space-y-0 lg:flex-row">
              <button
                disabled={btnState}
                onClick={addToCart}
                href="#"
                className={`${btnColor} block px-3 py-3 font-semibold text-center text-white transition-colors duration-200 transform  rounded-md`}
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[50%] Psm:max-w-[100%]">
          <div className="w-full h-full bg-cover">
            <div className="w-full h-full">
              <picture className="w-full">
                <img
                  className="m-auto object-cover"
                  src={props.item.featuredImage.url}
                  alt={props.item.featuredImage.altText}
                />
              </picture>
            </div>
          </div>
        </div>
      </div>

      <h4 className="text-white pt-5">Detail:</h4>
      <p className="mt-2 text-xl text-gray-500 dark:text-gray-400">
        {props.item.description}
      </p>
    </header>
  );
}

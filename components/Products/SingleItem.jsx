import React from "react";
import ColorSelect from "./ColorSelect";
import { useCartStore } from "../../hooks/useCartStore";
import { axiosFetch } from "@/utils/axiosFetch";

export default function SingleItem(props) {
  // const cartQuantity = useCartStore((state) => state.cartQuantity);
  // const cartItems = useCartStore((state) => state.cartItems);
  const cartId = useCartStore((state) => state.cartId);
  const addCart = useCartStore((state) => state.addCart);
  const [selectedItem, setSelectedItem] = React.useState({
    id: null,
    color: null,
    size: null,
  });
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
    if (option.color) {
      checkSize();
    }

    setSelectedItem((prev) => ({
      ...prev,
      ...newOptions,
    }));
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
                      title
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
    }
  };

  return (
    <header className="p-4 bg-white dark:bg-gray-800 max-w-[900px] m-auto">
      <div className="flex Psm:flex-col-reverse flex-row-reverse">
        <div className="flex items-center justify-center w-full px-6 py-8 lg:w-1/2">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
              <span className="text-blue-600 dark:text-blue-400">
                {props.item.title}
              </span>
            </h2>
            <div>
              <p className="block w-12 p-2 text-white text-xl font-semibold text-center">
                {Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                }).format(props.item.priceRange)}
              </p>

              <div className="text-white">
                <h5>COLOR: {selectedItem.color}</h5>
                <div className="grid grid-cols-3 gap-4 mt-4 mb-4">
                  {/* {props.item !== null &&
                    props.item.options.map((color, i) => {
                      let colorVal = color.name.split("/");

                      return (
                        <ColorSelect
                          key={i}
                          selectOption={selectOption}
                          colorName={colorVal[0].toLowerCase()}
                          styles={
                            selectedItem.color === colorVal[0].toLowerCase() &&
                            "ring-white ring-offset-black ring ring-offset-4"
                          }
                          colorBtn={colorVal[1]}
                        />
                      );
                    })} */}
                  {/* color buttons */}
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
                {props.item.variant.filter((opAv) => opAv.name === "Size")
                  .length > 0 && <h5>Size: </h5>}

                <div className="grid grid-cols-3 gap-4">
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
                          className={`${selectColor} cursor-pointer px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform  rounded-md hover:bg-blue-500 focus:outline-none`}
                          key={i}
                        >
                          {size}
                        </button>
                      );
                    })}

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
                            className={`${selectColor} cursor-pointer px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform  rounded-md hover:bg-blue-500 focus:outline-none`}
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
                onClick={addToCart}
                href="#"
                className="block px-3 py-2 text-sm font-semibold text-center text-white transition-colors duration-200 transform bg-gray-900 rounded-md hover:bg-gray-700"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>

        <div className="">
          <div className="w-full h-full bg-cover">
            <div className="w-full h-full bg-white">
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

      <h4>Detail:</h4>
      <p className="mt-2 text-xl text-gray-500 dark:text-gray-400">
        {props.item.description}
      </p>
    </header>
  );
}

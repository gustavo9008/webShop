import React from "react";
import ColorSelect from "./ColorSelect";

export default function SingleItem(props) {
  const [selectedItem, setSelectedItem] = React.useState({
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

  const selectOption = (option) => {
    console.log(option);
    setSelectedItem((prev) => ({
      ...prev,
      ...option,
    }));
  };

  // console.log(props.item.options);
  console.log(props.item);
  return (
    <header className="bg-white dark:bg-gray-800 max-w-[900px] m-auto">
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
                  {props.item !== null &&
                    props.item.options.map((color, i) => {
                      console.log(
                        color.name.toLowerCase() === ("white" || "black")
                      );
                      let colorVal = color.name.split("/");

                      console.log(colorVal);

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
                    })}
                </div>
              </div>
              <div className="text-white">
                <h5>Size: {"size"}</h5>
                <div className="grid grid-cols-3 gap-4">
                  {props.item.variant[1].values.map((size, i) => {
                    let selectColor =
                      selectedItem.size === size
                        ? "bg-blue-600"
                        : "bg-gray-500 hover:bg-blue-600";
                    return (
                      <p
                        onClick={() => {
                          selectOption({ size: size });
                        }}
                        className={`${selectColor} cursor-pointer px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform  rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80`}
                        key={i}
                      >
                        {size}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-col mt-6 space-y-3 lg:space-y-0 lg:flex-row">
              <button
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
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 lg:text-base">
        {props.item.description}
      </p>
    </header>
  );
}

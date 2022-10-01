import React from "react";
import styles from "../../styles/Home.module.css";

export default function Hero() {
  return (
    <aside
      id={`${styles.mainHero}`}
      className="bg-[rgba(9,18,34,.591)] px-4 m-auto"
    >
      <div className="container px-6 py-16 mx-auto">
        <div className="items-center lg:flex">
          <div className="w-full lg:w-1/2">
            <div className="lg:max-w-lg">
              <h1 className="text-2xl font-semibold text-gray-800 uppercase dark:text-white lg:text-3xl">
                Best Place To Choose Your Clothes
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Hello this is a test shop, you cannot buy any item from this
                webshop. This shop is for testing out the shopify storefront
                api. All products in this page are fake.
              </p>
              <button className="w-full px-3 py-2 mt-6 text-xs font-medium text-white uppercase transition-colors duration-200 transform bg-blue-600 rounded-md lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
                Shop Now
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center w-full mt-6 lg:mt-0 lg:w-1/2">
            {/* <img
              className="w-full h-full lg:max-w-2xl"
              src="../../../assets/svg/Catalogue-pana.svg"
              alt="Catalogue-pana.svg"
            /> */}
          </div>
        </div>
      </div>
    </aside>
  );
}

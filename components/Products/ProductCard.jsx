import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard(props) {
  return (
    <>
      <div
        id={props.id}
        className="max-w-[400px] flex flex-col justify-between overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800"
      >
        <div className="px-4 py-2">
          <h1 className="text-regular font-bold text-gray-800 uppercase dark:text-white">
            <Link href={`/product/${props.item.handle}?id=${props.item.id}`}>
              <a> {props.item.title} </a>
            </Link>
          </h1>
        </div>
        <aside className="grid grid-rows-1 justify-items-stretch">
          <figure className="aspect-w-4 aspect-h-3 mb-2">
            <Image
              className="object-cover"
              src={props.item.images.url}
              layout="fill"
              priority="true"
              alt={props.item.images.altText}
              placeholder="blur"
              blurDataURL={props.item.images.url}
            />
          </figure>

          {/* <img
          className="object-cover w-full h-48 mt-2"
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=320&q=80"
          alt="NIKE AIR"
        /> */}

          <div className="flex items-center justify-between px-4 py-2 bg-gray-900">
            <h1 className="text-lg font-bold text-white">
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
              }).format(props.item.priceRange)}
            </h1>
            {/* <button className="px-2 py-1 text-xs font-semibold text-gray-900 uppercase transition-colors duration-200 transform bg-white rounded hover:bg-gray-200 focus:bg-gray-400 focus:outline-none">
              Add to cart
            </button> */}
          </div>
        </aside>
      </div>
    </>
  );
}

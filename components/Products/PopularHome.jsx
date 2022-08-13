import React from "react";
import { axiosFetch } from "@/utils/axiosFetch.js";
import ProductCard from "@/components/Products/ProductCard";

export default function PopularHome(props) {
  const [homeProducts, setHomeProducts] = React.useState(null);
  const getProducts = async (amount) => {
    const gql = String.raw;

    const query = gql`
      query Products {
        products(first: ${amount}) {
          edges {
            node {
              id
              createdAt
              title
              handle
              tags
              priceRange {
                minVariantPrice {
                  amount
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
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
      type: "MULTIPLE_PRODUCTS",
    };

    const items = await axiosFetch("/api/getproducts", data);
    if (items.statusText === "OK") {
      console.log(items);
      setHomeProducts(items.data);
    }
  };

  React.useEffect(() => {
    getProducts(3);
  }, []);
  return (
    <>
      <section className="bg-[#4c4f58] py-12">
        <aside className="max-w-[800px] m-auto">
          <h2 className="text-white text-2xl font-semibold px-4 pb-6 text-center">
            Popular Items
          </h2>

          <div className="max-w-[800px] m-auto grid justify-center grid-cols-3 gap-4 Psm:grid-cols-2 Psm:grid-rows-1 px-3">
            {homeProducts !== null &&
              homeProducts.map((item, i) => {
                return <ProductCard key={i} item={item} />;
              })}
          </div>
        </aside>
      </section>
    </>
  );
}

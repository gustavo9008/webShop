import React from 'react';
import { useRouter } from 'next/router';
import { axiosFetch } from "@/utils/axiosFetch.js";
// import Item from "@/components/Products/Item"
import SingleItem from '@/components/Products/SingleItem';
import { useItemState } from "../../hooks/useCartStore";
import Spinner from "@/components/loaders/Spinner";




export default function Item(props) {

  // const item = useItemState((state) => state.item);
  // const setItem = useItemState((state) => state.addItem)
  // const variantItem = useItemState((state) => state.variantItem)
  // const setVariantItem = use

  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [item, setItem] = React.useState(null)


  console.log(item);

  const getItem = async (queryParams) => {
    // const urlId = router.query;
    // console.log(urlId.id);

    // let queryId = queryParams.split('/product/');
    // console.log(queryParams);


    const gql = String.raw;

    const query = gql`
  query Product {
  product(id: "gid://shopify/Product/${queryParams}") {
    title
    handle
    id
    description
    totalInventory
    options {
      name
      values
    }
    variants(first: 100){
      nodes{
        id
        quantityAvailable
        selectedOptions{
          name
          value
        }
      }
    }
    options {
      name 
      values
    }
    featuredImage {
      url
      altText
    }
    priceRange {
                minVariantPrice {
                  amount
                }
              }
   }
  
}`;
    // console.log(query);

    let data = {
      type: "SINGLE_PRODUCT",
      query,
    };
    const item = await axiosFetch("/api/getproducts", data);
    if (item.status === 200) {
      // console.log(item);
      setItem(item.data)
    }
  }

  React.useEffect(() => {
    let queryParams = new URL(document.location.href).searchParams.get("id");
    // console.log(queryParams);
    item !== null && (queryParams !== item.id.split("gid://shopify/Product/")[1]) && getItem(queryParams)
    item === null && getItem(queryParams)
  }, [item]);

  return (

    <>
      <p>single item</p>

      {item !== null && (
        <section className='bg-white dark:bg-gray-800 '>
          <SingleItem item={item} />
        </section>
      )}

      {item === null && <Spinner />}



    </>

  );
}

import { axiosFetch } from "@/utils/axiosFetch";

export default async function handler(req, res) {
    // console.log(req.body.type);
    const gql = String.raw;
    const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN;
    const SHOPIFY_URL = process.env.SHOPIFY_URL;
    let url = SHOPIFY_URL;
    let headers = { 'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN };
    let variables = {}




    const query = req.body.query

    let data = {
        query,
        variables
    }
    // const fetch = axiosFetch;

    const shopifyRes = await axiosFetch(url, data, headers);
    // console.log("data", shopifyRes.data);
    var productData;

    async function singleItemTransform(data) {
        let product = data.data.product
        console.log(product.variants.nodes[0].selectedOptions);

        let options = product.options.map((option) => {
            if (option.name !== "Color") return;
            let name = option.values.map((color) => {

                let name = color

                console.log(name);
                let itemQuantity = product.variants.nodes.filter((variant) => variant.selectedOptions[0].value === name)


                return {
                    name: name,
                    itemQuantity,

                }
            });

            console.log(name);
            // let fullOption = { opti: name.map(op => { return { op }; }) }

            return name;


            // return {
            //     name: name,
            //     variant: {
            //         itemQuantity,
            //     }
            // }


        })[0]

        productData = {
            id: product.id,
            title: product.title,
            description: product.description,
            handle: product.handle,
            tags: product.handle,
            priceRange: product.priceRange.minVariantPrice.amount,
            featuredImage: product.featuredImage,
            variant: product.options,
            options: options,

        }

        // console.log(productData);

        res.status(200).json(productData)

        // productData = shopifyRes.data.data;
        return;
    }

    async function multlipleItemsTransform() {
        productData = await shopifyRes.data.data.products.edges.map((product) => {
            let objProduct = {
                id: product.node.id.split("gid://shopify/Product/")[1],
                title: product.node.title,
                handle: product.node.handle,
                tags: product.node.handle,
                priceRange: product.node.priceRange.minVariantPrice.amount,
                images: product.node.images.edges[0].node,
            }

            return objProduct
        }
        );
        res.status(200).json(productData)

    }


    switch (req.body.type) {
        case "SINGLE_PRODUCT":
            await singleItemTransform(shopifyRes.data);
            res.end();
            break;
        case "MULTIPLE_PRODUCTS":
            await multlipleItemsTransform();
            res.end();
            break;

        default:
            break;
    }






    // res.status(200).json(productData)

}

import { axiosFetch } from "@/utils/axiosFetch";

export default async function handler(req, res) {
    const gql = String.raw;
    const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN;
    const SHOPIFY_URL = process.env.SHOPIFY_URL;
    let url = SHOPIFY_URL;
    let headers = { 'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN };


    const variables = req.body.variables
    const query = req.body.query

    let data = {
        query,
        variables
    }
    const shopifyRes = await axiosFetch(url, data, headers);
    if (shopifyRes.status !== 200) {
        res.status(400).json({ "error": "Something went Wrong, please try again later." });
        res.end();
        return;
    }
    var productData;

    async function singleItemTransform(data) {
        let product = data.data.product;
        //===== nested map method. need too rework it =====
        let options = product.options.map((option) => {
            if (option.name !== "Color") return;
            let name = option.values.map((color) => {

                let name = color
                let itemQuantity = product.variants.nodes.filter((variant) => variant.selectedOptions[0].value === name).map((values) => {


                    return {
                        id: values.id,
                        quantity: values.quantityAvailable,
                        color: values.selectedOptions[0]?.value,
                        size: values.selectedOptions[1]?.value,
                    };
                })


                return {
                    name: name,
                    itemQuantity,

                }
            });
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

    async function getCart() {
        // console.log("getting cart......");
        let cart;

        if (shopifyRes.data.data.cart === null) {
            cart = {
                cartId: null
            }

        }

        if (shopifyRes.data.data.cart !== null) {
            if (req.body.subType === "GET_LOAD_CART" && shopifyRes.data.data.cart != null) {
                cart = {
                    cartId: await shopifyRes.data.data.cart.id,
                    cartUrl: await shopifyRes.data.data.cart.checkoutUrl,
                    cartQuantity: await shopifyRes.data.data.cart.totalQuantity,
                }
            }

            if (req.body.subType === "GET_CART_ID") {
                cart = {
                    cartId: await shopifyRes.data.data.cartCreate.cart.id,
                    cartUrl: await shopifyRes.data.data.cartCreate.cart.checkoutUrl,
                    cartQuantity: await shopifyRes.data.data.cartCreate.cart.totalQuantity,
                }
            }

            if (req.body.subType === "LOAD_CART") {
                // console.log(shopifyRes.data.data.cart);
                cart = {
                    cartId: shopifyRes.data.data.cart.id,
                    cartUrl: shopifyRes.data.data.cart.checkoutUrl,
                    cartQuantity: shopifyRes.data.data.cart.totalQuantity,
                    estimatedCost: shopifyRes.data.data.cart.cost,
                    cartItems: shopifyRes.data.data.cart.lines.nodes,
                }
            }
        }


        res.status(200).json(cart)

    }

    async function addToCart() {

        let updatedCart = {
            cartQuantity: shopifyRes.data.data.cartLinesAdd.cart.totalQuantity,
            estimatedCost: shopifyRes.data.data.cartLinesAdd.cart.cost,
            cartItems: shopifyRes.data.data.cartLinesAdd.cart.lines.nodes
        }
        // res.status(200).json(shopifyRes.data);
        res.status(200).json(updatedCart);

    }

    async function updateShoppingCart() {
        // console.log(shopifyRes.data.data.cartLinesUpdate.cart.cost);
        let cartData = {
            cartQuantity: shopifyRes.data.data.cartLinesUpdate.cart.totalQuantity,
            estimatedCost: shopifyRes.data.data.cartLinesUpdate.cart.cost,
            cartItems: shopifyRes.data.data.cartLinesUpdate.cart.lines.nodes
        }
        res.status(200).json(cartData);

    }

    async function deleteItemCart() {
        let cartData = {
            cartQuantity: shopifyRes.data.data.cartLinesRemove.cart.totalQuantity,
            estimatedCost: shopifyRes.data.data.cartLinesRemove.cart.cost,
            cartItems: shopifyRes.data.data.cartLinesRemove.cart.lines.nodes
        }
        res.status(200).json(cartData);
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
        case "GET_CART":
            await getCart();
            res.end();
            break;
        case "ADD_TO_CART":
            await addToCart();
            res.end();
            break;
        case "UPDATE_CART":
            await updateShoppingCart();
            res.end();
            break;
        case "DELETE_ITEM_CART":
            await deleteItemCart();
            res.end();
            break;

        default:
            break;
    }






    // res.status(200).json(productData)

}
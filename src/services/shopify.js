/**
 * Terra Lotus — Shopify Storefront API Service
 *
 * Setup:
 * 1. In Shopify Admin → Apps → Develop Apps → Create app
 * 2. Enable Storefront API, grant: products, cart, checkout scopes
 * 3. Copy the Storefront Access Token (NOT the Admin API key)
 * 4. Paste below
 *
 * Docs: https://shopify.dev/docs/api/storefront
 */

const SHOPIFY_DOMAIN = 'terralotus.shop';
const STOREFRONT_TOKEN = 'YOUR_STOREFRONT_ACCESS_TOKEN'; // ← paste here
const API_URL = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;

async function shopifyFetch(query, variables = {}) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`);
  const { data, errors } = await res.json();
  if (errors) throw new Error(errors[0].message);
  return data;
}

// ─── Products ─────────────────────────────────────────────────────────────

export async function fetchAllProducts() {
  const query = `
    query GetProducts {
      products(first: 20, sortKey: BEST_SELLING) {
        edges {
          node {
            id
            handle
            title
            description
            images(first: 8) { edges { node { url altText } } }
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  price { amount currencyCode }
                  compareAtPrice { amount currencyCode }
                  availableForSale
                  selectedOptions { name value }
                }
              }
            }
            priceRange {
              minVariantPrice { amount currencyCode }
            }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch(query);
  return data.products.edges.map(e => e.node);
}

export async function fetchProductByHandle(handle) {
  const query = `
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        id
        handle
        title
        description
        images(first: 10) { edges { node { url altText } } }
        variants(first: 30) {
          edges {
            node {
              id
              title
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
              availableForSale
              selectedOptions { name value }
            }
          }
        }
        metafields(identifiers: [
          { namespace: "custom", key: "ingredients" }
          { namespace: "custom", key: "how_to_use" }
        ]) {
          key
          value
        }
      }
    }
  `;
  const data = await shopifyFetch(query, { handle });
  return data.product;
}

// ─── Cart ─────────────────────────────────────────────────────────────────

export async function createCart(lines = []) {
  const query = `
    mutation CreateCart($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price { amount currencyCode }
                    product { title images(first: 1) { edges { node { url } } } }
                  }
                }
              }
            }
          }
          cost {
            subtotalAmount { amount currencyCode }
            totalAmount { amount currencyCode }
          }
        }
        userErrors { field message }
      }
    }
  `;
  const data = await shopifyFetch(query, { lines });
  return data.cartCreate.cart;
}

export async function addToCart(cartId, lines) {
  const query = `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 20) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price { amount currencyCode }
                    product { title images(first: 1) { edges { node { url } } } }
                  }
                }
              }
            }
          }
          cost {
            subtotalAmount { amount currencyCode }
            totalAmount { amount currencyCode }
          }
        }
        userErrors { field message }
      }
    }
  `;
  const data = await shopifyFetch(query, { cartId, lines });
  return data.cartLinesAdd.cart;
}

export async function updateCartLine(cartId, lineId, quantity) {
  const query = `
    mutation UpdateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          cost { subtotalAmount { amount currencyCode } }
          lines(first: 20) {
            edges {
              node {
                id
                quantity
                merchandise { ... on ProductVariant { id title price { amount } } }
              }
            }
          }
        }
      }
    }
  `;
  return shopifyFetch(query, { cartId, lines: [{ id: lineId, quantity }] });
}

export async function removeCartLine(cartId, lineIds) {
  const query = `
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { id checkoutUrl cost { subtotalAmount { amount } } }
      }
    }
  `;
  return shopifyFetch(query, { cartId, lineIds });
}

/**
 * Open Shopify checkout in browser.
 * Call this instead of building your own checkout UI.
 *
 * Usage:
 *   const cart = await createCart([{ merchandiseId: variantGid, quantity: 1 }]);
 *   openCheckout(cart.checkoutUrl);
 */
export function openCheckout(checkoutUrl) {
  const { Linking } = require('react-native');
  Linking.openURL(checkoutUrl);
}

// ─── Subscription helper ───────────────────────────────────────────────────
// Terra Lotus uses Shopify's native subscription via selling plans.
// To implement subscribe & save via API, use selling plan groups:

export async function fetchSellingPlans(productId) {
  const query = `
    query GetSellingPlans($id: ID!) {
      product(id: $id) {
        sellingPlanGroups(first: 5) {
          edges {
            node {
              name
              sellingPlans(first: 5) {
                edges {
                  node {
                    id
                    name
                    priceAdjustments {
                      adjustmentValue {
                        ... on SellingPlanPercentagePriceAdjustment {
                          adjustmentPercentage
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch(query, { id: productId });
  return data.product.sellingPlanGroups;
}

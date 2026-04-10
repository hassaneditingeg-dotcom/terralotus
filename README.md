# Terra Lotus Mobile App

**Stack:** Expo (React Native) · iOS + Android

---

## Quick Start

```bash
npm install
npm run ios        # iOS simulator
npm run android    # Android emulator
```

---

## What's Built

### Screens
- **Home** — Collection hero image, featured products, Us vs Them, reviews, 30-day guarantee
- **Shop** — Product grid with category filter chips (All / Face & Body / Body Care / Wellness / Sun Care)
- **Product Detail** — Image gallery, scent/size selectors, Subscribe & Save 25%, ingredient accordion, Add to Cart
- **Cart** — Qty controls, subtotal, live total, Shopify checkout bridge
- **Wishlist** — Heart-saved products grid
- **Search** — Real-time product filter, trending chips
- **About** — Founder story, values, store links, email signup

### Products (5 active — Lip Balm removed)
1. **Tallow Honey Balm** — $20 / $34.99 (4oz), 4 scents, Subscribe & Save
2. **Tallow Soap 3 Pack** — $20, 3 scents (image swaps per scent)
3. **Organic Deodorant** — $20, 3 scents (Citrus Blossom / Rose Vanilla / Santal Vanilla, images swap)
4. **Scalp & Hair Oil** — $24.99
5. **Sunscreen SPF 50** — $34.99, Coming Soon

---

## Adding Your Real Product Images

Place images in `assets/products/` and update the `imageUrls` in `src/data/products.js`:

```js
// Replace CDN URLs with local requires:
images: [require('../../assets/products/balm-main.jpg')]
```

For the collection hero image (`VARIATION_3___202604041844.png`):
1. Copy it to `assets/collection-hero.jpg`
2. In `HomeScreen.js`, replace the `COLLECTION_IMG` constant:
```js
const COLLECTION_IMG = require('../../assets/collection-hero.jpg');
```

---

## Connecting Shopify Checkout

In `src/services/shopify.js`, add your Storefront API token and store URL.

In `CartScreen.js`, map each product variant to its Shopify Variant ID from your store admin:
```js
// Admin → Products → [Product] → Variants → copy numeric ID
const handleCheckout = () => {
  const variantParams = items.map(i => `SHOPIFY_VARIANT_ID:${i.quantity}`).join(',');
  Linking.openURL(`https://terralotus.shop/cart/${variantParams}`);
};
```

---

## Deployment

```bash
npm install -g eas-cli
eas login
eas init

# Build for both stores
npm run build:all

# Submit
npm run submit:ios
npm run submit:android
```

Requires: Apple Developer account ($99/yr) and Google Play account ($25 one-time).

---

## What to Ask Claude Code Next

- "Add the collection hero image from assets/"
- "Wire up Shopify checkout with real variant IDs"
- "Add push notifications for cart abandonment"
- "Build an order history screen"
- "Add an AI skin quiz"
# terra-lotus
# terra-lotus
# terra-lotus
# terra-lotus
# terra-lotus
# terra-lotus
# terra-lotus

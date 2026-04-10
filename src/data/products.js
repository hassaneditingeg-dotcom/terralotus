// Terra Lotus — Product Catalog
// Lip Balm removed. 5 active products.

export const PRODUCTS = [
  {
    id: '1',
    shopifyHandle: 'tallow-honey-balm-4oz',
    short: 'Tallow Honey Balm (4 oz)',
    tagline: 'Moisturize & Soothe Your Skin The Natural Way',
    price: 34.99,
    rating: 4.84,
    reviewCount: 64182,
    scents: ['Citrus', 'Lavender', 'Unscented', 'Vanilla'],
    sizes: ['4oz'],
    // CDN image URLs
    imageUrls: [
      'https://terralotus.shop/cdn/shop/files/60_1.png?v=1760839088&width=600',
      'https://terralotus.shop/cdn/shop/files/square.jpg?v=1760839088&width=600',
      'https://terralotus.shop/cdn/shop/files/square-3.jpg?v=1760839088&width=600',
    ],
    isBestseller: true,
    isComingSoon: false,
    category: 'Face & Body',
    hasSubscription: true,
    subscriptionDiscount: 0.25,
    highlights: [
      'Grass Fed Tallow',
      'Italian Olive Oil, Beeswax & Raw Honey',
      'Family Owned & Produced In USA',
      'Third Party Tested & Verified',
    ],
    ingredients: [
      { name: '100% Grass-Fed Beef Tallow', benefit: 'Rich in vitamins A, D, E & K — nourishes the skin barrier' },
      { name: 'Italian Olive Oil', benefit: 'Antioxidant-rich hydration, softens and conditions skin' },
      { name: 'Beeswax', benefit: 'Creates a breathable layer of lasting moisture' },
      { name: 'Raw Honey', benefit: 'Soothes dry skin and seals in gentle hydration' },
    ],
    description: "Say good-bye to chemical filled moisturizers, and say hello to nature's intended skincare. We make every batch with the highest quality Grass Fed Beef Tallow, Olive Oil, and Raw Honey.",
    howToUse: 'Safe and effective on all skin types. Most users love it for their face, arms, and any dry or wrinkled areas!',
    reviews: [
      { name: 'Annie K.', text: 'Love it! I use it on my face, arms, and back every day. Really helped with my wrinkles too.' },
      { name: 'Angie, 39 ✅ Verified', text: 'Makes my skin feel amazing every single day. Highly moisturizing, great for under makeup.' },
      { name: 'Arnie, 45 ✅ Verified', text: 'Feels like a natural miracle in a jar. Clean beauty at its finest.' },
    ],
  },
  {
    id: '6',
    shopifyHandle: 'tallow-honey-balm-2oz',
    short: 'Tallow Honey Balm (2 oz)',
    tagline: 'Moisturize & Soothe Your Skin The Natural Way',
    price: 20.00,
    rating: 4.84,
    reviewCount: 64182,
    scents: ['Citrus', 'Lavender', 'Unscented', 'Vanilla'],
    sizes: ['2oz'],
    imageUrls: [
      'https://terralotus.shop/cdn/shop/files/60_1.png?v=1760839088&width=600',
      'https://terralotus.shop/cdn/shop/files/square.jpg?v=1760839088&width=600',
      'https://terralotus.shop/cdn/shop/files/square-3.jpg?v=1760839088&width=600',
    ],
    isBestseller: true,
    isComingSoon: false,
    category: 'Face & Body',
    hasSubscription: true,
    subscriptionDiscount: 0.25,
    highlights: [
      'Grass Fed Tallow',
      'Italian Olive Oil, Beeswax & Raw Honey',
      'Family Owned & Produced In USA',
      'Third Party Tested & Verified',
    ],
    ingredients: [
      { name: '100% Grass-Fed Beef Tallow', benefit: 'Rich in vitamins A, D, E & K — nourishes the skin barrier' },
      { name: 'Italian Olive Oil', benefit: 'Antioxidant-rich hydration, softens and conditions skin' },
      { name: 'Beeswax', benefit: 'Creates a breathable layer of lasting moisture' },
      { name: 'Raw Honey', benefit: 'Soothes dry skin and seals in gentle hydration' },
    ],
    description: "Say good-bye to chemical filled moisturizers, and say hello to nature's intended skincare. We make every batch with the highest quality Grass Fed Beef Tallow, Olive Oil, and Raw Honey.",
    howToUse: 'Safe and effective on all skin types. Most users love it for their face, arms, and any dry or wrinkled areas!',
    reviews: [
      { name: 'Annie K.', text: 'Love it! I use it on my face, arms, and back every day. Really helped with my wrinkles too.' },
      { name: 'Angie, 39 ✅ Verified', text: 'Makes my skin feel amazing every single day. Highly moisturizing, great for under makeup.' },
      { name: 'Arnie, 45 ✅ Verified', text: 'Feels like a natural miracle in a jar. Clean beauty at its finest.' },
    ],
  },
  {
    id: '2',
    shopifyHandle: 'tallow-soap-3-pack',
    short: 'Tallow Soap — 3 Pack',
    tagline: 'Cleanse Without Stripping Your Skin',
    price: 20.00,
    rating: 4.87,
    reviewCount: 18419,
    scents: ['Unscented', 'Citrus', 'Lavender'],
    sizes: ['3 Pack'],
    // Scent-specific image mapping
    scentImageUrls: {
      'Unscented': 'https://terralotus.shop/cdn/shop/files/soap1.jpg?v=1755892764&width=600',
      'Citrus': 'https://terralotus.shop/cdn/shop/files/soap2.jpg?v=1755898318&width=600',
      'Lavender': 'https://terralotus.shop/cdn/shop/files/soap1.jpg?v=1755892764&width=600',
    },
    imageUrls: [
      'https://terralotus.shop/cdn/shop/files/soap1.jpg?v=1755892764&width=600',
      'https://terralotus.shop/cdn/shop/files/soap2.jpg?v=1755898318&width=600',
    ],
    isBestseller: false,
    isComingSoon: false,
    category: 'Body Care',
    hasSubscription: false,
    highlights: [
      'Grass-fed tallow cleanses without stripping',
      'Gentle enough for sensitive skin',
      '3 bars — great value',
      '100% natural formulation',
    ],
    ingredients: [
      { name: 'Grass-Fed Beef Tallow', benefit: 'Nourishing cleanse that preserves the moisture barrier' },
      { name: 'Olive Oil', benefit: 'Gentle surfactant with antioxidant protection' },
      { name: 'Raw Honey', benefit: 'Natural antibacterial and gentle lather' },
    ],
    description: 'Our Tallow Soap cleanses your skin without stripping it. No sulfates, no synthetic foaming agents — just grass-fed tallow and natural ingredients.',
    howToUse: 'Lather in hands or with a cloth and apply to body. Rinse thoroughly. Safe for face and body.',
    reviews: [],
  },
  {
    id: '3',
    shopifyHandle: 'deodorant',
    short: 'Deodorant (2.5 oz)',
    tagline: 'All-Day Protection, Naturally',
    price: 20.00,
    rating: 4.94,
    reviewCount: 15992,
    scents: ['Citrus Blossom', 'Rose Vanilla', 'Santal Vanilla'],
    sizes: ['2.5oz'],
    // Scent-specific images — use local assets when available
    scentImageUrls: {
      'Citrus Blossom': 'https://terralotus.shop/cdn/shop/files/1_9.jpg?v=1761070433&width=600',
      'Rose Vanilla': 'https://terralotus.shop/cdn/shop/files/1_7.jpg?v=1761069887&width=600',
      'Santal Vanilla': 'https://terralotus.shop/cdn/shop/files/1_9.jpg?v=1761070433&width=600',
    },
    imageUrls: [
      'https://terralotus.shop/cdn/shop/files/1_9.jpg?v=1761070433&width=600',
      'https://terralotus.shop/cdn/shop/files/1_7.jpg?v=1761069887&width=600',
    ],
    isBestseller: false,
    isComingSoon: false,
    category: 'Body Care',
    hasSubscription: false,
    highlights: [
      'No aluminum, no parabens, no synthetic fragrance',
      'All-day odor protection',
      'Gentle on sensitive underarm skin',
      'Made in USA',
    ],
    ingredients: [
      { name: 'Grass-Fed Tallow', benefit: 'Nourishes skin while providing a smooth glide' },
      { name: 'Baking Soda', benefit: 'Natural odor neutralizer' },
      { name: 'Arrowroot Powder', benefit: 'Absorbs moisture without blocking pores' },
      { name: 'Beeswax', benefit: 'Protective, conditioning texture' },
    ],
    description: 'A natural deodorant that actually works. No aluminum. No synthetic fragrance. No parabens. Just clean, simple ingredients.',
    howToUse: 'Apply a small amount to clean underarms. Allow a 1–2 week adjustment period if switching from conventional deodorant.',
    reviews: [],
  },
  {
    id: '4',
    shopifyHandle: 'scalp-hair-oil',
    short: 'Scalp & Hair Oil (2oz)',
    tagline: 'Strengthen, Nourish & Revive Your Hair Naturally',
    price: 24.99,
    rating: 4.9,
    reviewCount: 12104,
    scents: ['Rosemary & Vitamin A'],
    sizes: ['2oz'],
    imageUrls: [
      'https://terralotus.shop/cdn/shop/files/HQ_oil.png?width=600',
      'https://terralotus.shop/cdn/shop/files/oil_lifestyle.jpg?width=600',
    ],
    isBestseller: false,
    isComingSoon: false,
    imageScale: 1.15,
    category: 'Wellness',
    hasSubscription: false,
    highlights: [
      'Rosemary & Vitamin A formula',
      'Strengthens hair from scalp to tip',
      'Handcrafted in USA',
      'Non-greasy, absorbs quickly',
    ],
    ingredients: [
      { name: 'Rosemary Oil', benefit: 'Stimulates scalp circulation to support hair growth' },
      { name: 'Vitamin A', benefit: 'Nourishes follicles and promotes healthy hair thickness' },
      { name: 'Jojoba Oil', benefit: "Lightweight carrier that mimics scalp's natural sebum" },
    ],
    description: 'Our Scalp & Hair Strengthening Oil is handcrafted with potent rosemary and vitamin A to nourish your scalp and strengthen every strand.',
    howToUse: 'Apply a few drops to scalp and hair roots. Massage gently. Leave for 30 minutes or overnight, then wash.',
    reviews: [],
  },
  {
    id: '5',
    shopifyHandle: 'tallow-sunscreen-spf50',
    short: 'Tallow Sunscreen SPF 50',
    tagline: 'Natural Sun Protection Without Compromise',
    price: 34.99,
    rating: null,
    reviewCount: 17291,
    scents: ['Unscented'],
    sizes: ['5 fl oz'],
    imageUrls: [
      'https://terralotus.shop/cdn/shop/files/sun1.jpg?v=1769121140&width=600',
      'https://terralotus.shop/cdn/shop/files/sun2.jpg?v=1769121141&width=600',
    ],
    isBestseller: false,
    isComingSoon: false,
    category: 'Sun Care',
    hasSubscription: false,
    highlights: [
      'SPF 50 mineral protection — non-nano zinc oxide',
      '100% Grass-Fed Tallow base',
      'Water resistant 80 minutes',
      'Jojoba Oil, Beeswax & Vitamin E',
    ],
    ingredients: [
      { name: 'Non-Nano Zinc Oxide', benefit: 'Broad-spectrum UVA/UVB mineral protection' },
      { name: 'Grass-Fed Tallow', benefit: 'Nourishing base that conditions while you protect' },
      { name: 'Jojoba Oil', benefit: 'Lightweight moisture without clogging pores' },
      { name: 'Beeswax', benefit: 'Water resistance and skin-smoothing texture' },
      { name: 'Vitamin E', benefit: 'Antioxidant protection from free radicals' },
    ],
    description: 'SPF 50 mineral sun protection built on our signature grass-fed tallow base. No chemical filters. No reef-harming chemicals. Water resistant for 80 minutes.',
    howToUse: 'Apply liberally 15 minutes before sun exposure. Reapply every 2 hours or after swimming.',
    reviews: [],
  },
];

export const CATEGORIES = ['All', 'Face & Body', 'Body Care', 'Wellness', 'Sun Care'];

export const getProductById = (id) => PRODUCTS.find(p => p.id === id);

export const getProductsByCategory = (category) =>
  category === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === category);

export const getBestsellers = () => PRODUCTS.filter(p => p.isBestseller);

export const getProductsByIds = (ids = []) => PRODUCTS.filter(p => ids.includes(p.id));

export const getProductImageUrl = (product, scent = null, index = 0) => {
  if (scent && product.scentImageUrls && product.scentImageUrls[scent]) {
    return product.scentImageUrls[scent];
  }
  if (product.imageUrls && product.imageUrls[index]) {
    return product.imageUrls[index];
  }
  return product.imageUrls?.[0] || null;
};

// ── Local Asset Map ───────────────────────────────────────────────────────────
// Keyed by product id. 'default' = ordered image array; 'scents' overrides
// index 0 when that scent is selected.
const LOCAL_IMAGES = {
  '1': {
    scents: {
      Citrus: require('../../assets/balm-4oz-citrus.jpg'),
      Lavender: require('../../assets/balm-4oz-lavender.jpg'),
      Unscented: require('../../assets/balm-4oz-unscented.jpg'),
      Vanilla: require('../../assets/balm-4oz-vanilla.jpg'),
    },
    default: [
      require('../../assets/balm-4oz-4jars.jpg'),
      require('../../assets/balm-4oz-30days.jpg'),
      require('../../assets/balm-4oz-ingredients.jpg'),
      require('../../assets/balm-4oz-citrus.jpg'),
      require('../../assets/balm-4oz-lavender.jpg'),
      require('../../assets/balm-4oz-vanilla.jpg'),
      require('../../assets/balm-4oz-unscented.jpg'),
    ],
  },
  '2': {
    scents: {
      Unscented: require('../../assets/soap-unscented-new.jpg'),
      Citrus:    require('../../assets/soap-citrus.jpg'),
      Lavender:  require('../../assets/soap-lavender-new.jpg'),
    },
    default: [
      require('../../assets/soap-unscented-new.jpg'),
      require('../../assets/soap-citrus.jpg'),
      require('../../assets/soap-satisfaction.jpg'),
      require('../../assets/soap-lavender-new.jpg'),
    ],
  },
  '3': {
    scents: {
      'Citrus Blossom': require('../../assets/deo-citrus-kitchen.jpg'),
      'Rose Vanilla':   require('../../assets/Deodorant - Rose vanilla.webp'),
      'Santal Vanilla': require('../../assets/deo-santal.jpg'),
    },
    default: [
      require('../../assets/deo-citrus-swirl.jpg'),
      require('../../assets/deo-citrus-kitchen.jpg'),
      require('../../assets/deo-santal.jpg'),
      require('../../assets/Deodorant - Rose vanilla.webp'),
    ],
  },
  '4': {
    default: [
      require('../../assets/oil-3.jpg'),
      require('../../assets/oil-1.jpg'),
      require('../../assets/oil-5.jpg'),
      require('../../assets/hair-oil-dropper.jpg'),
      require('../../assets/oil-4.jpg'),
      require('../../assets/oil-2.jpg'),
    ],
  },
  '5': {
    default: [
      require('../../assets/sunscreen-underwater.jpg'),
      require('../../assets/sunscreen-sand.jpg'),
      require('../../assets/sunscreen-family.jpg'),
      require('../../assets/sunscreen-larger.jpg'),
      require('../../assets/sunscreen-ingredients.jpg'),
    ],
  },
  '6': {
    scents: {
      Citrus: require('../../assets/balm-2oz-citrus.jpg'),
      Lavender: require('../../assets/balm-2oz-lavender.jpg'),
      Unscented: require('../../assets/balm-2oz-unscented.jpg'),
      Vanilla: require('../../assets/balm-2oz-vanilla.jpg'),
    },
    default: [
      require('../../assets/balm-2oz-4jars-woman.jpg'),
      require('../../assets/balm-2oz-unscented.jpg'),
      require('../../assets/balm-2oz-citrus.jpg'),
      require('../../assets/balm-2oz-lavender.jpg'),
      require('../../assets/balm-2oz-vanilla.jpg'),
    ],
  },
};

// Returns an ordered array of Image source values for a product.
// Local assets preferred; CDN URLs used as fallback.
export const getProductAllImageSources = (product) => {
  const local = LOCAL_IMAGES[product.id];
  if (local && local.default?.length > 0) {
    return local.default;
  }
  return (product.imageUrls || []).map((url) => ({ uri: url }));
};

export const getScentImageIndex = (product, scent) => {
  const local = LOCAL_IMAGES[product.id];
  if (local && local.scents && local.scents[scent] && local.default) {
    const idx = local.default.indexOf(local.scents[scent]);
    return idx !== -1 ? idx : 0;
  }
  return 0;
};

// Returns a single image source for a given product/scent/index.
export const getProductImageSource = (product, scent = null, index = 0) => {
  const sources = getProductAllImageSources(product, scent);
  return sources[index] || sources[0] || null;
};

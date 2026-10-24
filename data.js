/* Shortbarrel demo data. Snapshot 2026-10-24.
 * CATALOG: products, prices, copy and images from shortbarrelbourbon.com (/products.json).
 *   soldOutOnSite = sold out on the current store.
 * RETAILERS / VARIANTS: AccelPay/LiquidCommerce retailer variants, active and in stock,
 *   matched on brand and product name. Only one Shortbarrel/Old Fourth bottle on the
 *   demo's product list has an in-stock network listing: Shortbarrel Toasted at Sips.
 *   Three retailers are excluded on purpose (Josh, 2026-10-24).
 * Every other route is the illustrative "Licensed retailer in <state>" at the site price.
 * Gopuff: 0 locations (live brand-facet check, 2026-10-24).
 */
window.DEMO_DATA = {
 "STATE_COUNTS": {
  "TX": 1
 },
 "STORAGE_KEY": "shortbarrel-shopify-demo-v1",
 "RB_URL": "https://www.reservebar.com/search?q=shortbarrel",
 "NO_SHIP": [
  "AR",
  "MS",
  "MT",
  "UT"
 ],
 "TRY_ZIPS": "77006, 30306 or 10007",
 "CATALOG": {
  "fourgrain": {
   "id": "fourgrain",
   "handle": "shortbarrel-bourbon-four-grain-750ml",
   "name": "Shortbarrel Four Grain",
   "line": "Core release · Kentucky straight bourbon · 92 proof",
   "type": "Bourbon",
   "size": "750ml",
   "image": "assets/prod-fourgrain.jpg",
   "sitePrice": 4499,
   "desc": "<p>Four Grains. One Balanced Bourbon. Bourbon Built for Real Life</p><p>Our flagship Four Grain is blended from select Kentucky straight bourbons and further aged under our direction in Atlanta, Georgia. Bottled at 92 proof and non-chill filtered, it delivers a full, rounded profile that works just as well neat as it does over ice or in a cocktail. The goal is simple: a bourbon with enough character for enthusiasts and enough balance to become your go-to bottle.</p><p>This stays aligned with the current page’s claims that it’s a blend of four-to-five-year-old Kentucky whiskey, secondarily aged in Atlanta, bottled at 92 proof, and non-chill filtered.</p>",
   "url": "https://shortbarrelbourbon.com/products/shortbarrel-bourbon-four-grain-750ml"
  },
  "rye101": {
   "id": "rye101",
   "handle": "shortbarrel-bourbon-rye-101-750ml",
   "name": "Shortbarrel Rye 101",
   "line": "Core release · MGP rye · 101 proof",
   "type": "Rye",
   "size": "750ml",
   "image": "assets/prod-rye101.jpg",
   "sitePrice": 6499,
   "desc": "<p>Rye 101 is a blend of non-chill filtered MGP rye barrels, all over 6 years old and blended to our specifications.</p><p>We feel that 101 is the perfect proof to hold up to cocktails, sip neat, or enjoy on the rocks. The spice blends with a subtle sweetness to dance this blend across all of your taste buds. Our rye is our most awarded product. Multiple Gold And Double Gold’s at both New York and San Francisco Spirit Competitions.</p>",
   "url": "https://shortbarrelbourbon.com/products/shortbarrel-bourbon-rye-101-750ml"
  },
  "toasted": {
   "id": "toasted",
   "handle": "shortbarrel-bourbon-toasted-barrel-kentucky-straight-bourbon-94-proof-750ml",
   "name": "Shortbarrel Toasted",
   "line": "Core release · toasted barrel finish · 94 proof",
   "type": "Bourbon",
   "size": "750ml",
   "image": "assets/prod-toasted.jpg",
   "sitePrice": 6499,
   "desc": "<p>Small Batch Kentucky Straight Bourbon Whiskey Finished in toasted kelvin barrels</p><p>A small batch Kentucky Bourbon aged a minimum of 5 years. Sourced from Bardstown Bourbon Company and Green River, blended together. Then re-barreled in new traditional medium toasted Kelvin barrels for a minimum of 6 months. The result IS a pleasantly balanced toasted bourbon with just the right amount of vanilla, candy and sweet oak flavor.</p><p>Bottled at 94 proof this bourbon will surely become a staple in any collection.</p>",
   "url": "https://shortbarrelbourbon.com/products/shortbarrel-bourbon-toasted-barrel-kentucky-straight-bourbon-94-proof-750ml",
   "soldOutOnSite": true
  },
  "doubleoak": {
   "id": "doubleoak",
   "handle": "shortbarrel-double-oak-sb-6-collective",
   "name": "Shortbarrel Double Oaked",
   "line": "Limited release",
   "type": "Bourbon",
   "size": "750ml",
   "image": "assets/prod-doubleoak.jpg",
   "sitePrice": 8499,
   "desc": "<p>Double Oaked Bourbon</p><p>Structure. Sweetness. Depth.</p><p>Our Double Oak Bourbon begins with a blend of straight bourbons selected for balance, typically bringing together traditional and high-rye mashbills to create a layered base.</p><p>Before it ever sees a second barrel, the blend already works:</p><p>Caramel and vanilla from the corn base</p><p>Spice and lift from the rye content</p><p>A balanced, approachable structure</p><p>From there, it moves into new Kelvin barrels with varying char levels. This second maturation deepens texture, integrates sweetness, and builds a longer, more expressive finish.</p><p>THE RESULT:</p><p>A bourbon that leans into richness and structure, without losing clarity.</p>",
   "url": "https://shortbarrelbourbon.com/products/shortbarrel-double-oak-sb-6-collective"
  },
  "cigar4": {
   "id": "cigar4",
   "handle": "shortbarrel-cigar-batch-iv",
   "name": "Shortbarrel Cigar Batch IV",
   "line": "Limited release · 2026 NYWSC Double Gold",
   "type": "Bourbon",
   "size": "750ml",
   "image": "assets/prod-cigar4.jpg",
   "sitePrice": 9499,
   "desc": "<p>AWARD WINNING BOURBON IS BACK IN STOCK!</p><p>2026 NY WORLD SPIRITS COMPETITION</p><p>DOUBLE GOLD MEDAL</p><p>BEST OF CLASS - SPECIAL BARREL FINISHED BOURBON</p><p>RELEASE IV:</p><p>The Cigar Batch series has always been an exercise in patience, precision and balance. Rather than relying on a single finishing cask type to define the whiskey, the series is built by blending separately finished components, allowing different mash bills, maturation profiles and finishing casks to each contribute to the final whiskey.</p>",
   "url": "https://shortbarrelbourbon.com/products/shortbarrel-cigar-batch-iv"
  },
  "solstice": {
   "id": "solstice",
   "handle": "summer-solstice",
   "name": "Shortbarrel Summer Solstice",
   "line": "Curator Series",
   "type": "Bourbon",
   "size": "750ml",
   "image": "assets/prod-solstice.jpg",
   "sitePrice": 6499,
   "desc": "<p>Shortbarrel Summer Solstice is the latest release in our Curator Series a collection dedicated to exploring uncommon cask finishes and showcasing how the right barrel can transform great bourbon into something entirely new.</p><p>Crafted from a blend of bourbons aged six years and older, this 100-proof release spent an additional nine months finishing in genuine Orange Wine casks in Atlanta, creating a whiskey that is bright, vibrant, and remarkably refreshing without sacrificing bourbon&#x27;s rich character.</p>",
   "url": "https://shortbarrelbourbon.com/products/summer-solstice"
  },
  "shortlist2": {
   "id": "shortlist2",
   "handle": "the-shortlist-2-french-oak-double-oak-collective",
   "name": "The Shortlist #2 French Oak Double Oak",
   "line": "The Shortlist release",
   "type": "Bourbon",
   "size": "750ml",
   "image": "assets/prod-shortlist2.jpg",
   "sitePrice": 11499,
   "desc": "<p>A Shortlist member release: French oak double oaked bourbon.</p>",
   "url": "https://shortbarrelbourbon.com/products/the-shortlist-2-french-oak-double-oak-collective"
  },
  "fans1": {
   "id": "fans1",
   "handle": "shortbarrel-fans-1-beam-bourbon",
   "name": "Shortbarrel Fans #1, 12 Year Beam Bourbon",
   "line": "Fans series · 134.8 proof",
   "type": "Bourbon",
   "size": "750ml",
   "image": "assets/prod-fans1.jpg",
   "sitePrice": 11999,
   "desc": "<p>12 year Beam bourbon, bottled at 134.8 proof.</p>",
   "url": "https://shortbarrelbourbon.com/products/shortbarrel-fans-1-beam-bourbon"
  },
  "fans2": {
   "id": "fans2",
   "handle": "shortbarrel-fans-2-mgp-rye",
   "name": "Shortbarrel Fans #2, 13 Year MGP Rye",
   "line": "Fans series · 114.3 proof",
   "type": "Rye",
   "size": "750ml",
   "image": "assets/prod-fans2.jpg",
   "sitePrice": 12999,
   "desc": "<p>13 year MGP rye, bottled at 114.3 proof.</p>",
   "url": "https://shortbarrelbourbon.com/products/shortbarrel-fans-2-mgp-rye"
  },
  "honeygin": {
   "id": "honeygin",
   "handle": "o4d-barrel-aged-honey-gin-collective",
   "name": "O4D Barrel Aged Honey Gin",
   "line": "Old Fourth Distillery · Atlanta",
   "type": "Gin",
   "size": "750ml",
   "image": "assets/prod-honeygin.jpg",
   "sitePrice": 3999,
   "desc": "<p>Old Fourth Distillery gin, aged a year or more in ex-Shortbarrel Bees Knees honey barrels.</p>",
   "url": "https://shortbarrelbourbon.com/products/o4d-barrel-aged-honey-gin-collective"
  }
 },
 "RETAILERS": {
  "sips": {
   "name": "Sips",
   "city": "McKinney, TX",
   "state": "TX",
   "type": "shipping"
  }
 },
 "VARIANTS": {
  "toasted": [
   {
    "r": "sips",
    "price": 6599,
    "stock": 12
   }
  ]
 },
 "GOPUFF_ZIPS": []
};

# EcoWealth: website demo (Bit Studio)

A static site with no build step. Open `index.html` directly, or serve the folder:

```
python -m http.server 8765   →   http://localhost:8765
```

## What's inside
- **Solar Sizer** (`#/sizer`): customers pick appliances by room (quantity and hours per day), set their goal and load-shedding hours, and get a recommended package. The result shows Budget, Recommended and Future-proof tiers, a 24-hour solar/usage/battery simulation, a breakdown of where the energy goes, "remove this heavy load and save $X" tips, a matching parts list from the shop, a payback estimate, a shareable link, WhatsApp handoff and site-survey booking.
- **Packages**: 8 installed packages, with budget and segment filters, side-by-side comparison, a detail page with add-ons, full / 20% deposit / monthly payment options, and a printable brochure.
- **Shop**: 23 products. Filters (category, brand, price, rating, on sale, in stock) are stored in the URL. Also sorting, grid/list view, pagination, quick view, wishlist, compare (up to 4), a product page with zoom, specs and reviews tabs and "frequently bought together", a cart drawer, delivery zones ($5 + $0.65/km), and coupons (`SUNNY10`, `ECOWEALTH`).
- **Checkout**: 3 steps. EcoCash, OneMoney, InnBucks, card, ZimSwitch and bank transfer are all simulated. It ends at an order confirmation with a timeline.
- Financing calculator, Projects, About and Contact pages.

## Files
- `js/data.js`: packages, products, appliances, delivery zones and contact details. **Edit this first.**
- `js/sizing.js`: the sizing engine (peak/surge, battery, PV, 24h simulation, package matching).
- `js/views-*.js`: one file per section. `js/app.js` is the hash router.
- `css/styles.css`: the design system (tokens at the top).

## Replace before going live
- Contact phone, WhatsApp number, email and address (`EW.company` in `js/data.js`). These are placeholders.
- Prices, stats (500+ installs etc.), testimonials, reviews and project entries. These are illustrative.
- The iStock photos are watermarked comps. License them or swap in EcoWealth's own photos.
- Checkout needs a real payment gateway (e.g. Paynow) and an orders backend.

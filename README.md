# Majlis Banquet Hall — website

Static one-page site (HTML + CSS + JS, no build step) in the style of
majlis-demo.netlify.app, with UX upgrades.

## Run

From this folder:

```
npx serve -l 4400
```

Open http://localhost:4400.

## Files

- `index.html` — all sections and copy
- `styles.css` — palette tokens at the top of the file (charcoal, gold, ivory)
- `main.js` — menu, scroll-spy, photo viewer, enquiry form, mobile action bar
- `images/` — the venue's photos and hero video

## Enquiry form

The form uses Netlify Forms (`data-netlify="true"`), so submissions arrive
in the Netlify dashboard once the folder is deployed to Netlify. On any host
without a form handler, including the local preview, it says the enquiry
didn't go through and points people to Instagram. It never shows a false
"thank you". To host elsewhere, point the form's `action` at a real endpoint.

## Facts on the page

Confirmed by the owner (October 2026): 100+ seated guests, in-house catering
(from the sister kitchen in the same plaza), a coffee, matcha and mocktail
cart, and a preferred-vendor list (DJ, décor, fruit and sweets). The hall
does not supply décor or a sound system, so the page doesn't claim them.
The copy is written for every community and occasion.

The "Now Booking" years and the footer year fill themselves in each year.

Still to come from the owner: the business phone (for call and text
buttons), the email that enquiries should go to, vendor names to list, and
new photos to replace the current set.

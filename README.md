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

Every fact comes from the demo: address, 200+ seated guests, 5★ Google,
the three Google reviews, and @majlisuc. No phone number is listed because
none could be confirmed. Add one in the contact section and the mobile action
bar once the owner gives it.

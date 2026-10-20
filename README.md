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

Enquiries are emailed to MajilisUc@gmail.com through FormSubmit
(formsubmit.co), which is free and needs no account. The very first
submission sends an activation email to that inbox; nothing is delivered
until the owner clicks "Activate Form" in it. After that, every enquiry
arrives as an email, with reply-to set to the guest's address.

If a send fails, the form says so, keeps what was typed, and offers the
phone number. It never shows a false "thank you".

## Facts on the page

Confirmed by the owner (October 2026): 100+ seated guests, in-house catering
(from the sister kitchen in the same plaza), a coffee, matcha and mocktail
cart, and a preferred-vendor list (DJ, décor, fruit and sweets). The hall
does not supply décor or a sound system, so the page doesn't claim them.
The copy is written for every community and occasion.

The "Now Booking" years and the footer year fill themselves in each year.

Phone and text: (510) 508-0007.

Still to come from the owner: vendor names to list, and new photos to
replace the current set.

# How to edit this temple website

A guide for temple staff and volunteers. No coding required — everything below is
done from the website itself.

---

## 1. Getting an account

1. Open the website and click **Sign in** (top right).
2. Choose **New here? Create an account**, enter your name, email and a password
   of at least 8 characters, then confirm the password.
   - You can also use **Continue with Google**.
3. If the email already has an account, the site tells you and switches to sign-in.

## 2. Becoming an administrator

- **The very first administrator:** sign in, go to `/admin`, and click
  **Claim administrator access**. This works only while the temple has no
  administrator yet.
- **Everyone after that:** an existing administrator opens
  **Admin → People & admins**, types the person's account email and clicks
  **Make administrator**. The person must already have created an account.
- To take access away, click **Remove** next to their name.

## 3. The admin console

Sign in and open **Admin** in the header (or go to `/admin`). Tabs:

| Tab              | What you edit                                                                    |
| ---------------- | -------------------------------------------------------------------------------- |
| Overview         | Snapshot of bookings, payments and upcoming events                               |
| Temple details   | Name, tagline, address, phone, email, social links, history, mission, about text |
| Timings          | Daily opening hours and special-date timings                                     |
| Poojas & prices  | Pooja categories, each seva's price, duration, description, and deity photos     |
| Events & notices | Events, timings, sponsors, pooja item lists, photo galleries, announcements      |
| Hall rental      | Hall details, rates and rules, plus every hall booking request                   |
| Library          | Books and scriptures shown on the public Library page                            |
| Board & donors   | Board members and the donor wall                                                 |
| People & admins  | Administrators, newsletter subscribers, event volunteers                         |
| Payments         | Online payments and receipts                                                     |
| Audit log        | Who changed what, and when                                                       |

Each section is a simple list: **Add** creates a row, the pencil edits it, the
trash deletes it. Changes appear on the public site immediately.

## 4. Common tasks

**Add a priest** — Board & donors → Priests → Add. Fill in name, title, photo
URL, languages, specializations, _serving since_, and _working days at the
temple_ (comma separated, e.g. `Monday, Tuesday, Saturday`).

**Add an event** — Events & notices → Events → Add. Set title, description,
start and end time, location, image, whether registration is required, the fee,
and the sponsorship amount. Tick **annual** for yearly festivals so it appears on
the yearly calendar.

**Sponsors and pooja items for an event** — open the event's row and use the
_Items_ and _Sponsor_ fields. They show on the public event page next to the
pooja.

**Past-event photos** — Events & notices → Event photos → Add. Click **Upload**
and choose a picture from your computer (JPG, PNG, WebP or GIF, up to 15 MB); a
thumbnail appears once it finishes. You can still paste a link instead if the
photo already lives online. Attach it to an event, or just set a year, and it
appears in the gallery. The same Upload button is on event images, book covers
and the hero image.

**Add a book** — Library → Add. Title and author are the essentials. Upload a
cover image, and add a download link or a read-online link if the text is
available. Books appear on the public Library page in display order.

**Deity photo on a pooja page** — Poojas & prices → Deities. Give each deity an
image; poojas that name that deity show the picture automatically.

**Donor wall** — Board & donors → Donors. Set a tier (e.g. Platinum, Gold) and
donors are grouped by tier on the public page. Tick _anonymous_ to hide a name.
The tier box is free text, so to create a new band just type it — for example
`$1,000 – $10,000` — on each donor who belongs in it, and a new heading appears.
The public page shows 24 donors at a time with **Previous / Next** links at the
bottom, so the wall stays readable however long the list grows.

**Hall rental** — Hall rental → Halls. Each hall has an hourly, half-day and
full-day rate; devotees are automatically charged whichever is cheapest for the
hours they book, plus the cleaning fee. The refundable deposit is what they pay
online to hold the date. `Minimum notice (days)` stops last-minute requests and
`Buffer between bookings` leaves setup/clear-up time between two events.

**Hall requests** — Hall rental → Hall booking requests. Each request holds the
date immediately so nobody else can take it. Move it to _confirmed_ once the
deposit clears, or _cancelled_ to release the date. **Mark paid** is for
deposits taken by cash or cheque at the office.

**Newsletter & volunteers** — devotees subscribe from the home page and can
volunteer for a specific event from that event's page. Both lists live under
People & admins.

## 5. Online payments

The site takes card payments through **Square**. Nothing in the admin console
needs changing when Square is set up — the keys live in the project's
environment settings:

| Variable                       | Where it comes from                                   |
| ------------------------------ | ----------------------------------------------------- |
| `SQUARE_ACCESS_TOKEN`          | Square Developer dashboard → your application         |
| `SQUARE_LOCATION_ID`           | Square dashboard → Locations                          |
| `SQUARE_ENVIRONMENT`           | `production`, or `sandbox` while testing              |
| `SQUARE_WEBHOOK_SIGNATURE_KEY` | Square webhook subscription                           |
| `SQUARE_WEBHOOK_URL`           | `https://www.hccna.online/api/public/webhooks/square` |

In Square, add a webhook subscription pointing at
`https://www.hccna.online/api/public/webhooks/square` and subscribe to
`payment.created`, `payment.updated` and `order.updated`. That is what marks a
receipt as paid.

Stripe is still wired up as a backup. If the Square keys are missing, payments
fall back to Stripe automatically; setting `PAYMENT_PROVIDER=stripe` forces the
old behaviour without any code change.

## 6. Images

Any image field has an **Upload** button — choose a file from your computer and
it is stored with the website, no external hosting needed. Uploads are limited to
15 MB and must be an image file. You can also paste a public image URL if you
prefer. Use landscape images around 1600×900 for event and hero pictures.

Only temple administrators can upload. If you see "You need temple administrator
access to upload photos", ask an existing admin to add you under People & admins.

## 7. The map on the Contact page

The map uses **Map location** in Admin → Temple details, not the postal address —
so a P.O. Box can stay as your mailing address while the map still points at the
temple building. Enter the physical street address there, then open the Contact
page to check the pin. If Map location is left empty the map falls back to the
postal address.

## 8. The audit log

Every create, edit and delete of events, priests, donors and deities is recorded
with the person's name, the date and time, and the exact before/after values of
each field. Nothing in the log can be edited or removed.

## 9. Reusing this site for another temple

1. Duplicate the project.
2. In **Admin → Temple details**, change the name, tagline, address, contact
   details, colours and logo.
3. Clear the demo content from each tab and enter the new temple's deities,
   timings, poojas, priests, events and board.
4. Claim the first administrator account as described in section 2.

Nothing else needs changing — all content shown on the public site comes from
the admin console.

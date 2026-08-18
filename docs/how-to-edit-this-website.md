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

**Past-event photos** — Events & notices → Event photos. Attach a photo to an
event (or just a year) and it appears in the gallery.

**Deity photo on a pooja page** — Poojas & prices → Deities. Give each deity an
image; poojas that name that deity show the picture automatically.

**Donor wall** — Board & donors → Donors. Set a tier (e.g. Platinum, Gold) and
donors are grouped by tier on the public page. Tick _anonymous_ to hide a name.

**Newsletter & volunteers** — devotees subscribe from the home page and can
volunteer for a specific event from that event's page. Both lists live under
People & admins.

## 5. Images

Paste a public image URL into any _image URL_ field (for example a link from the
temple's Google Drive set to "anyone with the link", or any image host). Use
landscape images around 1600×900 for event and hero pictures.

## 6. The audit log

Every create, edit and delete of events, priests, donors and deities is recorded
with the person's name, the date and time, and the exact before/after values of
each field. Nothing in the log can be edited or removed.

## 7. Reusing this site for another temple

1. Duplicate the project.
2. In **Admin → Temple details**, change the name, tagline, address, contact
   details, colours and logo.
3. Clear the demo content from each tab and enter the new temple's deities,
   timings, poojas, priests, events and board.
4. Claim the first administrator account as described in section 2.

Nothing else needs changing — all content shown on the public site comes from
the admin console.

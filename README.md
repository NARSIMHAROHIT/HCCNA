# Dharma Digital

Build a Reusable Full-Stack Hindu Temple Website, Mobile App & Management Platform

1. Project Objective

Build a modern, production-ready, full-stack digital platform for a Hindu temple based on the information, services, structure, and content available on:

Hindu Cultural Center of North Alabama (HCCNA)

The goal is to create:

A modern responsive temple website.

A mobile application for iOS and Android.

A secure devotee/user account system.

A separate administrator portal/CMS.

A priest portal/mobile experience.

Online pooja/priest-service booking.

Temple event management.

Hindu calendar/tithi/panchang functionality based on configurable location.

A reusable architecture that can be cloned and configured for other Hindu temples without rebuilding the application from scratch.

Do NOT simply create a static frontend. This must be a real full-stack application with a database, authentication, APIs, role-based access control, admin CMS, booking system, notifications, and mobile support.

2. Reference Website

Use the existing HCCNA website as the primary reference for:

Temple information

Temple services

Priest information

Pooja services

Temple timings

Events

Hindu cultural/religious resources

Books/resources

Contact information

Location information

Existing navigation/content structure

Images and other publicly available content where legally appropriate

Analyze the existing website and organize its information into a much cleaner and more modern information architecture.

Do not blindly copy the existing UI.

Create a futuristic, elegant, spiritual, premium Hindu temple experience.

The design should feel:

Modern

Peaceful

Devotional

Premium

Trustworthy

Accessible

Mobile-first

Fast

Easy to navigate

Avoid excessive animations or overly flashy designs.

3. IMPORTANT: Make the Platform Reusable

The most important architectural requirement is that this should NOT be hard-coded specifically for one temple.

Build it as a:

“Multi-Temple Ready Temple Management Platform”

The application should have a configurable Temple/Organization profile.

For example:

Temple A:

Name

Logo

Address

Latitude/longitude

Timezone

Phone

Email

Website

Social media

Temple timings

Priests

Services

Events

Calendar location

Payment configuration

Notification configuration

Branding

Temple B should be able to use the exact same application by changing configuration/content.

Create a clean separation between:

Application code

Temple configuration

Database content

Branding

Images

Services

Priests

Events

Calendar/location settings

Do not hard-code HCCNA-specific information into application logic.

4. Recommended Technology Architecture

Choose a modern, scalable technology stack.

Preferred architecture:

Web

Next.js

React

TypeScript

Tailwind CSS

Modern component library

Responsive design

Server-side rendering where appropriate

Backend

Use either:

Next.js backend/API architecture

OR

NestJS/Node.js backend

Use TypeScript throughout.

Database

Prefer:

PostgreSQL

Prisma ORM

Authentication

Implement secure authentication with:

Email/password

Password reset

Email verification

Secure sessions/JWT as appropriate

Role-based access control

Mobile

Prefer:

React Native + Expo

The mobile app should consume the same backend APIs as the website.

Do NOT create a separate backend for mobile.

5. User Roles

Implement role-based access control.

Roles should include:

SUPER ADMIN

Can manage:

Multiple temples

Temple configuration

Administrators

Users

Priests

Services

Events

Bookings

Calendar configuration

Content

Images

Notifications

System settings

TEMPLE ADMIN

Can manage their temple:

Website content

Temple details

Priests

Services

Events

Bookings

Users

Photos

Documents/books

Notifications

Temple calendar

Availability

PRIEST

Can see:

Assigned services

Booking schedule

Devotee information necessary for the service

Service date/time

Event details

Location

Special instructions

Priests should be able to:

View upcoming bookings

Accept/confirm assignments where appropriate

Mark service completed

Add notes

View their schedule

DEVOTEE / USER

Can:

Register

Login

Manage profile

View temple information

View priests

View services

View events

View Hindu calendar

Book priest services

View bookings

Cancel/reschedule according to temple policy

Receive notifications

View booking history

Manage contact information

6. Website Pages

Create a complete dynamic website with pages such as:

Home

Include:

Temple hero section

Upcoming events

Today’s temple timings

Upcoming poojas

Featured services

Priest highlights

Hindu calendar/tithi

Announcements

Quick booking

Donation CTA

Temple location

Contact information

About Temple

Include:

Temple history

Mission

Vision

Community

Temple traditions

Deities

Temple facilities

Temple Timings

Display:

Daily opening/closing times

Special timings

Festival timings

Holiday schedules

Admin must be able to edit timings without modifying code.

Priests

Display:

Priest name

Photo

Biography

Qualifications/traditions

Languages

Specializations

Services offered

Availability

Pooja / Priest Services

Create a searchable service catalog.

Each service should support:

Name

Description

Category

Duration

Price/donation amount

Priest requirements

Temple/home service option

Preparation instructions

Required materials

Availability

Booking rules

Images

Documents

FAQs

Examples could include different poojas, ceremonies, samskaras, consultations, etc.

Do not hard-code service names. Admin must be able to create/edit/delete services.

7. Priest Booking System

This is a core feature.

A devotee should be able to:

Select a service.

Select preferred date.

Select location/type of service if applicable.

See available priests/time slots.

Select an available time.

Enter required information.

Submit booking.

Receive confirmation.

See booking in their account.

Example:

Service:
“Satyanarayana Pooja”

Date:
Saturday, September 12

Available times:

10:00 AM — Priest A

1:00 PM — Priest B

4:00 PM — Priest A

Unavailable slots must not be bookable.

Prevent double-booking.

8. Booking Management

Admin dashboard should show:

Calendar view

List view

Booking status

Devotee

Priest

Service

Date

Time

Location

Payment status

Notes

Confirmation status

Booking states:

Pending

Confirmed

Assigned

Completed

Cancelled

Rescheduled

Admin should be able to:

Assign priest

Change time

Change priest

Cancel booking

Reschedule booking

Add notes

Contact devotee

Contact priest

9. Priest Availability

Create a flexible availability system.

Priests should have:

Weekly availability

Vacation/unavailable dates

Blocked dates

Service-specific availability

Maximum bookings per day

Buffer time between services

Example:

Priest A:

Monday:
9 AM–12 PM

Wednesday:
2 PM–7 PM

Saturday:
8 AM–4 PM

Admin can override availability for festivals and special events.

10. Temple Events

Create a dynamic event management system.

Each event should support:

Event name

Description

Date

Start time

End time

Recurrence

Location

Main deity

Event category

Priest

Images

Registration

Maximum attendees

Donation/fee

Registration deadline

Event status

Examples:

Festivals

Religious ceremonies

Cultural programs

Children’s programs

Classes

Community events

Special poojas

Announcements

Admin must be able to create events without touching code.

11. Hindu Calendar / Panchang

Create a prominent Hindu calendar section.

The calendar must support location-based calculations.

Admin should be able to configure:

Temple latitude

Temple longitude

City

State

Country

Timezone

The application should use these coordinates for location-dependent calculations.

Display relevant information such as:

Tithi

Nakshatra

Yoga

Karana

Sunrise

Sunset

Rahu Kalam

Festival dates

Ekadashi

Purnima

Amavasya

Other relevant Hindu calendar information

The calendar must NOT assume that every temple uses the same location.

For a reusable deployment, the admin should be able to change the temple location.

Example:

Temple A → Huntsville, Alabama

Temple B → Atlanta, Georgia

Temple C → Dallas, Texas

The application should calculate/display the appropriate local calendar information.

Use a reliable astronomical/Hindu calendar library or API rather than manually hard-coding dates.

Clearly document the source/calculation methodology.

12. Hindu Religious Books / Resources

Create a dynamic digital library.

Admin can add:

Book title

Author

Description

Category

Cover image

PDF/document

External link

Language

Publication information

Users can:

Browse

Search

Filter

Read/download where permitted

Categories can include:

Bhagavad Gita

Vedas

Upanishads

Puranas

Stotras

Children’s books

Sanskrit

Hindu philosophy

Temple publications

Do not hard-code categories.

13. Donations

Design the architecture so donations can be integrated.

Include:

Donation page

Donation categories

One-time donation

Recurring donation

Anonymous donation option

Donor account history

Use a payment provider such as Stripe where appropriate.

Do not store raw credit-card information.

Make payment configuration tenant/temple-specific.

14. User Account

After login, users should have a dashboard.

Display:

My Profile

Name

Email

Phone

Address

Preferred language

Emergency/contact information if needed

My Bookings

Display:

Upcoming bookings

Past bookings

Service

Priest

Date

Time

Location

Status

My Events

Display registered events.

Notifications

Display:

Booking confirmations

Booking changes

Upcoming service reminders

Temple announcements

Event reminders

15. Notifications

Create a notification framework supporting:

Email

Examples:

Account registration

Email verification

Password reset

Booking confirmation

Booking cancellation

Booking reschedule

Event registration

Service reminder

Push Notifications

For mobile:

Booking reminder

Event reminder

Temple announcement

Booking changes

Design notifications so the admin can configure templates.

16. Admin CMS

The admin interface is extremely important.

The administrator should NOT need a developer to change normal website content.

Create an easy CMS.

Admin should be able to edit:

Website

Home page

About page

Temple history

Contact information

Temple timings

Announcements

Footer

Navigation

Content

Text

Images

Galleries

Documents

Books

FAQs

Services

Add

Edit

Delete

Enable/disable

Change price

Change duration

Configure booking availability

Priests

Add

Edit

Delete

Profile photo

Biography

Services

Availability

Events

Create

Edit

Delete

Upload event images

Configure registration

Configure recurring events

Use a rich text editor and drag-and-drop image upload where appropriate.

17. Media Management

Create a media library.

Admin should be able to:

Upload images

Create folders/categories

Replace images

Delete images

Add alt text

Add captions

Select existing images while editing pages

Optimize images automatically.

Use cloud storage such as S3-compatible storage or another scalable object-storage solution.

18. Mobile Application

Build an iOS and Android application using the same backend.

Mobile app should include:

Home

Temple information

Today’s timings

Upcoming events

Hindu calendar

Featured poojas

Announcements

Login

Users can use the same email/password account as the website.

If a user creates an account on the website, they should be able to immediately use the same account on mobile.

Bookings

Browse services

Select date

See available priests

Select time

Book

View booking

Cancel/reschedule where permitted

Events

Browse events

Register

Receive reminders

Calendar

Daily Panchang

Monthly calendar

Festival information

Tithi

Temple events

Profile

Personal details

Booking history

Notifications

Account settings

19. Priest Mobile Experience

Priests should have a dedicated role-based mobile experience.

After logging in, a priest should see:

Today’s Schedule

Example:

8:00 AM
Ganapati Pooja
Devotee: John Doe
Temple

10:30 AM
Satyanarayana Pooja
Devotee: Jane Doe
Home Service

2:00 PM
Wedding Ceremony
Temple Hall

The priest should be able to:

View booking details

View address when applicable

Call/contact devotee where permitted

View service instructions

Mark service completed

Add notes

See upcoming schedule

Only show priests the information they actually need.

20. Admin Dashboard

Create a professional dashboard.

Dashboard metrics:

Today’s bookings

Upcoming bookings

Pending bookings

Upcoming events

Number of registered devotees

Active priests

Popular services

Donations if enabled

Calendar/events overview

Include charts where useful.

21. Search

Implement global search across:

Temple information

Priests

Services

Events

Books

Announcements

Add filters and categories.

22. SEO

The public website must be SEO-friendly.

Implement:

Metadata

Open Graph

Structured data/schema markup

Sitemap

Robots.txt

Canonical URLs

SEO-friendly URLs

Event structured data where appropriate

Local business/organization structured data where appropriate

Each temple should have configurable SEO metadata.

23. Accessibility

Follow WCAG best practices.

Support:

Keyboard navigation

Screen readers

Proper heading hierarchy

Alt text

Accessible forms

Good contrast

Large touch targets

Responsive typography

24. Security

Implement production-level security.

Include:

Password hashing

Secure authentication

Role-based authorization

API authorization

Input validation

Rate limiting

CSRF protection where applicable

XSS protection

SQL injection prevention

Secure file uploads

Audit logging

Secure environment variables

Proper secrets management

Users must never be able to access another user’s private information.

Temple admins must only access the temples they are authorized to manage.

25. Database Design

Create a clean normalized schema.

At minimum consider entities such as:

Tenant/Temple

User

Role

UserRole

Priest

PriestAvailability

Service

ServiceCategory

Booking

BookingStatus

Event

EventRegistration

TempleSchedule

CalendarLocation

Announcement

Page

ContentBlock

Media

Book

Notification

NotificationTemplate

Payment

Donation

AuditLog

Design relationships carefully.

The database must support multiple temples without duplicating application code.

26. Multi-Tenant Architecture

Architect the system so every relevant database record belongs to a temple/tenant.

For example:

Temple
↓
Priests
Services
Events
Bookings
Users/relationships
Content
Media
Calendar configuration
Payments
Notifications

Implement proper tenant isolation.

A temple administrator must NEVER be able to access another temple’s private data.

27. Internationalization

Design the application to support multiple languages in the future.

At minimum architect for:

English

Sanskrit

Hindi

Telugu

Tamil

Kannada

Malayalam

Do not necessarily translate everything during the first implementation, but ensure the architecture can support translations.

28. Design System

Create a reusable design system.

Components should include:

Header

Footer

Navigation

Hero

Cards

Event cards

Service cards

Priest cards

Calendar

Booking calendar

Forms

Tables

Modal dialogs

Notifications

Dashboard widgets

Image gallery

Rich text editor

Keep the design consistent across website and admin portal.

29. Performance

Optimize for:

Fast page load

Image optimization

Lazy loading

Code splitting

API caching

Database indexes

Efficient queries

Mobile performance

Target excellent Lighthouse scores where practical.

30. Deployment

Provide a production deployment architecture.

Prefer a setup such as:

Frontend/API:

Vercel or equivalent

Database:

PostgreSQL

Storage:

S3-compatible object storage

Email:

Transactional email provider

Push:

Firebase/APNs through appropriate mobile infrastructure

Payments:

Stripe or equivalent

The application must use environment variables for all environment-specific configuration.

31. Development Requirements

Do not build everything as one huge file.

Use:

Clean folder structure

Reusable components

Modular services

Typed APIs

Database migrations

Validation schemas

Error handling

Logging

Unit tests

Integration tests

End-to-end tests for critical workflows

Use TypeScript strictly.

Avoid unnecessary dependencies.

Document important architectural decisions.

32. Admin Editing Experience

This is one of the highest-priority requirements.

A non-technical temple administrator should be able to log in and manage the website without knowing programming.

For example:

Admin → Events → Add Event

Admin enters:

Event Name
Description
Date
Time
Image
Priest
Registration
Location

Then clicks:

“Publish”

The public website and mobile application should automatically display the new event.

Similarly:

Admin → Priests → Add Priest

Admin → Services → Add Pooja

Admin → Temple Settings → Change Location

Admin → Pages → Edit Content

No code changes should be required.

33. Booking Example

Build this workflow completely:

A devotee logs in.

They select:

“Priest Services”

Then:

“Satyanarayana Pooja”

Then:

September 20

The system checks:

Service availability

Priest availability

Existing bookings

Temple schedule

Buffer time

Blocked dates

Then displays available slots.

User selects:

September 20
10:00 AM
Priest: Available Priest

User confirms.

System creates:

Booking #12345

Admin sees the booking.

Priest sees the booking in their mobile app.

User receives email/push confirmation.

Before the appointment, the system sends a reminder.

After the appointment, priest/admin can mark it completed.

34. Calendar Example

The temple administrator configures:

Temple Location:
Huntsville, Alabama

Latitude:
…

Longitude:
…

Timezone:
America/Chicago

The Hindu calendar should calculate/display the appropriate local tithi and sunrise/sunset information.

If the same software is deployed to another temple:

Temple Location:
Dallas, Texas

The admin changes the location and the calendar automatically uses the new location.

Do not hard-code calendar calculations for Alabama.

35. Reusable Temple Setup Wizard

Create an onboarding/setup wizard for a new temple.

Step 1:
Temple Name

Step 2:
Logo

Step 3:
Address

Step 4:
Latitude/Longitude

Step 5:
Timezone

Step 6:
Temple timings

Step 7:
Deities

Step 8:
Priests

Step 9:
Services

Step 10:
Brand colors

Step 11:
Contact information

Step 12:
Social media

Step 13:
Admin account

After setup, the temple should have a working website automatically.

36. Branding

Allow each temple to configure:

Logo

Favicon

Primary color

Secondary color

Fonts where appropriate

Hero image

Temple name

Footer

Social links

The core application remains unchanged.

37. What I Expect You to Produce

Do not only provide a UI mockup.

Produce the actual working full-stack architecture.

Deliver:

Complete project structure

Database schema

Authentication

Authorization

Public website

Admin portal

Priest portal

User portal

Booking engine

Event management

Hindu calendar

CMS

Media management

Notifications

Mobile application

API layer

Validation

Testing

Deployment configuration

Environment variable documentation

Database migration/seed scripts

README with setup instructions

38. Seed Data

Create realistic seed data based on the reference temple website structure.

Use clearly identifiable seed/demo data where exact production information cannot be reliably obtained.

Do not fabricate sensitive or official information and present it as real.

The architecture should make it easy to replace seed data with actual temple information.

39. Important UX Requirement

The system should always make it obvious what is:

PUBLIC CONTENT

versus

PRIVATE USER DATA

versus

ADMIN DATA

versus

PRIEST DATA.

Keep the user experience simple for elderly devotees and users who may not be highly technical.

The website should be usable on:

Desktop

Laptop

Tablet

Mobile phone

40. Development Approach

Build this in phases.

Phase 1 — Architecture

Create:

Project structure

Database schema

Authentication

Roles

Multi-tenant architecture

API foundation

Design system

Phase 2 — Public Website

Build:

Home

About

Temple

Priests

Services

Events

Calendar

Books

Contact

Phase 3 — Admin CMS

Build:

Dashboard

Content editor

Media library

Priest management

Service management

Event management

Temple settings

Calendar configuration

Phase 4 — Booking System

Build:

Availability

Booking

Priest assignment

Calendar

Conflict prevention

Notifications

Phase 5 — Mobile App

Build:

Authentication

User dashboard

Events

Services

Booking

Calendar

Notifications

Profile

Phase 6 — Priest App

Build:

Schedule

Booking details

Service information

Status updates

Notifications

Phase 7 — Production Hardening

Implement:

Security

Testing

Logging

Error handling

Performance optimization

SEO

Accessibility

Deployment

41. Critical Instruction

Before writing large amounts of code:

Analyze the reference website.

Identify its major sections and services.

Propose the information architecture.

Propose the database schema.

Propose the API architecture.

Propose the user roles and permissions.

Propose the booking workflow.

Propose the Hindu calendar architecture.

Propose the multi-temple architecture.

Propose the folder/project structure.

Then begin implementation.

Do not create a superficial frontend prototype.

Build the application as a real, scalable product that can eventually support multiple Hindu temples using the same codebase.

The final result should feel like a professional SaaS-style temple management platform combined with a modern temple website and mobile application.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/05e3e4dc-d289-4af8-9108-85541bb50832).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

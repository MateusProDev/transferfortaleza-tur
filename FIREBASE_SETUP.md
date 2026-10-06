# Firebase / Firestore setup

This repository is configured for Firebase project `maiatur` in `.firebaserc`.
The app reads:

- `pacotes` for tours and transfers
- `banners`
- `avaliacoes`
- `blogPosts`
- `content` for homepage SEO, header, footer, sections, FAQ, and reviews
- `settings` for the WhatsApp number and site settings
- `activityLogs`, written as the admin site is used

Lead tracking is currently disabled. Its existing admin pages and API
implementations are retained, but `/admin/leads` is redirected and the lead
API endpoints are blocked before accessing Firestore, Google Sheets, or Ads.
The website no longer sends lead-tracking or lead-conversion events.

Firestore creates a collection when its first document is written; it does not
store empty collections. The catalog collections (`pacotes`, `banners`,
`avaliacoes`, and `blogPosts`) should receive real records through the admin
site or a data migration, rather than placeholder documents.

## Deploy the Firestore indexes

The composite indexes in `firestore.indexes.json` support the published blog
query (`published == true`, ordered by `views` and `publishedAt`) and the
published-date/category blog query shapes. Deploy only these indexes with the
Firebase CLI:

```bash
firebase login
npm run firebase:deploy-indexes
```

The deploy command targets `maiatur` and `firestore:indexes` only; it does not
deploy Firestore security rules or modify collection documents. The Firebase
CLI may need to be installed first (`npm install --global firebase-tools`).

## Local Firebase Admin SDK

The admin panel uses Firebase Google sign-in and a server-verified session.
Enable the Google provider in Firebase Authentication and configure the
authorized administrator email addresses in `ADMIN_EMAILS` as a comma-separated
server-side environment variable. The server checks this allowlist when creating
sessions and authorizing content writes.

Admin routes also require Firebase Admin SDK credentials. Create a service
account key in Google Cloud and save the downloaded JSON in the project root as
`firebase-adminsdk.json`. `.gitignore` and `.vercelignore` exclude this file.
Never paste service-account keys into chat or commit them. Revoke any key that
has been exposed.

The local `.env.local` already sets `FIREBASE_ADMIN_SDK_PATH=./firebase-adminsdk.json`.
For hosted environments, configure the service-account credentials through the
hosting provider's encrypted environment settings instead of uploading a key
file.

The admin panel's **Conteúdo do site** page edits existing documents in the
Firestore `content` collection. It preserves unknown fields and document IDs;
catalog records, banners, blog posts, FAQs, testimonials, and general settings
remain available in their existing dedicated admin screens.

Public Firestore data is cached by the Next.js server for up to one hour;
changes made through this app's admin APIs invalidate the related cache
immediately. Changes made directly in the Firebase console or by another app
may take up to one hour to appear. Firestore quotas are shared by every app
connected to this Firebase project, including any older React site. Check
Firestore usage by day and Query Insights in Google Cloud when investigating
quota exhaustion; the site's cache cannot limit reads made by other clients.

## Initialize starter site content

After configuring a valid local Admin SDK credential, run
`npm run init-site-content` only when you intend to write/update the starter
site content. This operation changes Firestore documents; it is not required to
deploy the indexes.

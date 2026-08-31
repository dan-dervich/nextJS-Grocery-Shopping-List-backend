dateTimeHowIWantIt:
var date = new Date();
date.toLocaleDateString()

## PocketBase setup (pockethost.io)

1. Create an instance on [pockethost.io](https://pockethost.io) and note its URL
   (`https://<your-app>.pockethost.io`) and the superuser email/password you
   set up for it.
2. In the instance's Admin UI, go to **Settings → Import collections** and
   upload [`pb_schema.json`](pb_schema.json) to create both collections in one
   shot (merge, don't overwrite, if you already have other collections). Or
   create them by hand — same shape either way:

   **`families`** (type: Base)
   | field           | type       | notes                          |
   |-----------------|------------|---------------------------------|
   | familyEmail     | text       | required, unique                |
   | familyPassword  | text       | required (bcrypt hash)          |
   | familyUsers     | json       | array of family member names    |

   **`groceries`** (type: Base)
   | field              | type     | notes                                  |
   |--------------------|----------|-----------------------------------------|
   | family             | relation | required, single, links to `families`  |
   | grocery_item_name  | text     |                                          |
   | cuantity           | text     |                                          |
   | appendedBy         | text     |                                          |
   | createdOn          | text     |                                          |

   Leave the API rules on both collections empty/locked (no public access) —
   this API talks to PocketBase as an authenticated superuser, so the
   collections don't need to be reachable directly by clients.
3. Copy `.env.example` to `.env` and fill in `POCKETBASE_URL`,
   `POCKETBASE_ADMIN_EMAIL`, and `POCKETBASE_ADMIN_PASSWORD` with the values
   from step 1.

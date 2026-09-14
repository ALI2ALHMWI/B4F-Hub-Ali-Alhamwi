# B4F Hub

## Overview

**B4F Hub** is a single-page community and opportunities platform for the B4F training program. It brings trainees, alumni, trainers, and program coordinators together in one professional workspace.

The application combines two core areas:

- **Community:** A feed for updates, questions, announcements, resources, events, likes, search, and category filtering.
- **Opportunities:** A list of jobs, internships, scholarships, and volunteer roles with search, filters, details, saving, and applying.

The project is built with React, TypeScript, Vite, CSS, and a local Express API. It does not use routing because all functionality belongs to one page.

---

## Main Features

### Community

- Fetch community posts from the API.
- Display loading, error, retry, and empty states.
- Create a new post without reloading the page.
- Validate post content before submitting it.
- Select one of the supported post categories.
- Add a newly created post to the top of the feed.
- Like and unlike posts through the API.
- Prevent repeated like requests while a request is in progress.
- Search by author name and post content.
- Filter posts by category.
- Display a clear message when no posts match the current filters.

### Opportunities

- Fetch opportunities from the API.
- Display loading, error, retry, and empty states.
- Search by title, company, and required skills.
- Filter by opportunity type.
- Filter by work mode.
- Combine search and filters.
- Expand opportunity details inside the same card.
- Apply through the API using `PATCH`.
- Change the action from `Apply` to disabled `Applied` after success.
- Prevent duplicate application requests.
- Save and unsave opportunities locally.
- Track opened opportunity history with a Stack.
- Navigate back through opportunity history in LIFO order.
- Look up opportunities by ID through a Hash Table.

### Notifications

- Show success notifications for completed actions.
- Show error notifications when API requests fail.
- Show information notifications for actions such as unsaving an opportunity.
- Display only one notification at a time.
- Preserve notification order using a Queue.
- Reveal the next notification after the current one is dismissed.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| React 18 | Building the user interface and reusable components |
| TypeScript | Static typing and safer component contracts |
| Vite | Frontend development server and production build |
| Express | Local API server |
| CSS | Layout, styling, responsive behavior, and UI states |
| Fetch API | Communicating with the local API |
| React Hooks | State management, effects, and reusable data-fetching logic |

---

## Requirements

The project requires:

- Node.js.
- npm.
- A modern browser with React and ES Module support.

Check the installed versions with:

```powershell
node --version
npm --version
```

---

## Getting Started

### Install dependencies

Run the following command from the project directory:

```powershell
npm install
```

### Start the application

```powershell
npm run dev
```

This starts both services:

- Vite frontend server.
- Express local API server.

The frontend is normally available at:

```text
http://localhost:5173
```

The API normally runs at:

```text
http://localhost:3001
```

The frontend uses relative API paths such as:

```ts
fetch("/api/posts")
```

The Vite configuration proxies `/api` requests to the local Express server.

### Build the production version

```powershell
npm run build
```

This runs the TypeScript build and creates the production bundle with Vite.

### Run ESLint

```powershell
npm run lint
```

### Preview the production build

```powershell
npm run preview
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm install` | Install project dependencies |
| `npm run dev` | Start the frontend and API server together |
| `npm run dev:client` | Start Vite only |
| `npm run dev:server` | Start Express only |
| `npm run build` | Run TypeScript checks and build the application |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build |

---

## Project Structure

```text
starter/
├── server/
│   ├── data.js
│   └── index.js
├── src/
│   ├── components/
│   │   ├── community/
│   │   │   ├── CommunityFilters.tsx
│   │   │   ├── CommunityHeader.tsx
│   │   │   ├── CommunitySection.tsx
│   │   │   ├── CreatePostForm.tsx
│   │   │   ├── PostCard.tsx
│   │   │   └── PostList.tsx
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   ├── notifications/
│   │   │   └── NotificationCenter.tsx
│   │   └── opportunities/
│   │       ├── OpportunitiesHeader.tsx
│   │       ├── OpportunitiesSection.tsx
│   │       ├── OpportunityCard.tsx
│   │       ├── OpportunityFilters.tsx
│   │       └── OpportunityList.tsx
│   ├── data-structures/
│   │   ├── HashSet.ts
│   │   ├── HashTable.ts
│   │   ├── Queue.ts
│   │   └── Stack.ts
│   ├── hooks/
│   │   └── useFetch.ts
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Architecture

The application is organized around small components with clear responsibilities.

### `App.tsx`

The root component assembles the Navbar, Community section, Opportunities section, and Footer. It also wraps the application with `NotificationProvider` so that all feature sections can send notifications.

### `CommunitySection.tsx`

This component manages post data, filtering, searching, creating posts, liking, unliking, loading, and error states.

### `OpportunitiesSection.tsx`

This component manages opportunity data, filters, the currently expanded opportunity, opportunity history, saved IDs, applying state, and request errors.

### Presentation components

`PostCard` and `OpportunityCard` render individual items. `PostList` and `OpportunityList` handle list rendering and loading, error, empty, and filtered-empty states.

### `services/api.ts`

This file contains the API functions. Keeping HTTP calls in one service layer prevents networking logic from being duplicated inside components.

### `types/index.ts`

This file contains TypeScript types for posts, opportunities, filters, and API inputs.

---

## API Contract

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/posts` | Load community posts |
| `POST` | `/api/posts` | Create a post |
| `PATCH` | `/api/posts/:id` | Like or unlike a post |
| `GET` | `/api/opportunities` | Load opportunities |
| `PATCH` | `/api/opportunities/:id` | Apply to an opportunity |

### Save behavior

The API does not provide a Save endpoint. Therefore, Save and Unsave are frontend-only behaviors backed by a Hash Set. The saved state remains available while the page is open, but it is not persisted after a full reload unless browser storage or a backend endpoint is added later.

---

## Community Workflow

### Creating a post

1. The user enters post content.
2. The user selects a category.
3. The form validates that the content is not empty.
4. The form validates the minimum and maximum length.
5. The application sends `POST /api/posts`.
6. The returned post is inserted at the beginning of the list.
7. The form is reset without reloading the page.
8. A success notification is queued.
9. If the request fails, the existing list remains unchanged and the error is shown.

### Like and Unlike

When the user clicks Like or Unlike:

1. The application calculates the new `liked` value.
2. The button is disabled while the request is pending.
3. The application sends `PATCH /api/posts/:id`.
4. The UI is updated only after a successful response.
5. The like count and visual state are updated.
6. If the request fails, the previous state is preserved.
7. An error message and notification are shown.

---

## Opportunities Workflow

### Apply

The action starts as:

```text
Apply
```

While the request is running:

```text
Applying...
```

After a successful API response:

```text
Applied
```

The button is disabled after success to prevent another application for the same opportunity. If the request fails, the original opportunity state is preserved.

### Save

Save is independent from Apply. When the user saves an opportunity, its ID is added to the Hash Set. When the user clicks the same action again, the ID is removed. The card changes between `Save` and `Saved` without a backend request.

### Opportunity details

Details are expanded inside the card. No route or separate details page is used. When a different opportunity is opened, the previously opened opportunity is pushed into the detail-history Stack.

---

## Data Structures

### Stack: opportunity detail history

File:

```text
src/data-structures/Stack.ts
```

The Stack stores opportunity IDs that the user has left while opening another opportunity.

If the user opens opportunities in this order:

```text
A → B → C
```

The history contains the previous opportunities:

```text
[A, B]
```

Pressing Back uses `pop()` and returns to `B`, then to `A`. This is genuine **LIFO** behavior: the last opportunity pushed into the Stack is the first one returned.

Main operations:

| Method | Purpose |
|---|---|
| `push(item)` | Add an item to the top |
| `pop()` | Remove and return the latest item |
| `peek()` | Read the latest item without removing it |
| `isEmpty()` | Check whether the Stack has no items |
| `size()` | Return the number of items |
| `clear()` | Remove all items |

### Hash Table: opportunity lookup by ID

File:

```text
src/data-structures/HashTable.ts
```

The Hash Table maps an opportunity ID to its complete object:

```ts
opportunityTable.current.set(opportunity.id, opportunity);
```

When the user navigates back through the Stack, the application retrieves the object by ID:

```ts
opportunityTable.current.get(previousOpportunityId);
```

This provides direct key-based lookup instead of searching the whole array with `find()` every time. The table is also updated after a successful Apply operation so that the stored opportunity remains current.

Main operations:

| Method | Purpose |
|---|---|
| `set(key, value)` | Store a value under a key |
| `get(key)` | Retrieve a value by key |
| `has(key)` | Check whether a key exists |
| `clear()` | Remove all stored entries |

### Hash Set: saved opportunities

File:

```text
src/data-structures/HashSet.ts
```

The Hash Set stores only the IDs of saved opportunities:

```ts
savedOpportunityIds.current.add(opportunityId);
```

Before adding or removing an ID, the application checks membership with `has()`. Since a set cannot contain duplicate values, repeated Save actions cannot create duplicate saved IDs.

Main operations:

| Method | Purpose |
|---|---|
| `add(value)` | Add a value without duplication |
| `delete(value)` | Remove a value |
| `has(value)` | Check membership |
| `clear()` | Remove all values |
| `size` | Return the number of values |

### Queue: sequential notifications

File:

```text
src/data-structures/Queue.ts
```

The Queue stores notifications that cannot be displayed immediately because another notification is already visible.

For example, if Save, Apply, and Publish happen close together, the user sees:

```text
Save notification
Apply notification
Publish notification
```

The Queue uses **FIFO** behavior: the first notification added is the first notification displayed after the current notification is dismissed.

Main operations:

| Method | Purpose |
|---|---|
| `enqueue(item)` | Add an item to the end |
| `dequeue()` | Remove and return the oldest item |
| `peek()` | Read the oldest item without removing it |
| `isEmpty()` | Check whether the Queue is empty |
| `size()` | Return the number of items |
| `clear()` | Remove all items |

---

## Custom Hook: `useFetch`

File:

```text
src/hooks/useFetch.ts
```

`useFetch` extracts the repeated loading, error, retry, and data-update logic shared by Community and Opportunities.

Without a shared Hook, both sections would need to repeat the same pattern:

```tsx
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

The shared Hook is used with a Generic Type so that it works with both posts and opportunities:

```tsx
useFetch<Post[]>(getPosts)
```

```tsx
useFetch<Opportunity[]>(getOpportunities)
```

The Hook provides:

| Value | Purpose |
|---|---|
| `data` | Loaded data or `null` before the request finishes |
| `loading` | Indicates whether a request is in progress |
| `error` | Error message or `null` |
| `refetch` | Retry the request |
| `updateData` | Update the current data after POST or PATCH |

`useCallback` keeps the `refetch` function stable so that the loading `useEffect` does not create an unintended request loop.

---

## Responsive Design

### Desktop layout

Desktop uses a two-column Grid layout:

```css
grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
```

Community and Opportunities appear side by side. Each section has its own feed scroll area, while the Navbar and Footer remain visually separate.

### Tablet layout

On medium screens, both sections remain side by side, but gaps, padding, and card spacing are reduced to preserve usable content width.

### Mobile layout

At widths below `800px`, the layout changes to one column:

```text
Navbar
Community
Opportunities
Footer
```

The internal feed scrolling is removed on mobile so that the entire page scrolls naturally. Buttons such as Save, Apply, View details, and Back become full-width when necessary.

### Preventing horizontal overflow

The responsive CSS uses the following rules together:

```css
overflow-x: hidden;
min-width: 0;
overflow-wrap: anywhere;
word-break: break-word;
```

These rules prevent long content, skill labels, opportunity names, and links from expanding the page beyond the viewport.

---

## CSS Challenge: Scrolling Only the Feeds

One of the main layout challenges was making only the post feed and opportunity feed scroll on Desktop while keeping the rest of the page stable.

The required behavior was:

```text
Navbar stays visible
Community header stays visible
Community filters stay visible
Only the post feed scrolls

Opportunities header stays visible
Opportunity filters stay visible
Only the opportunity feed scrolls

Footer stays outside the feed scroll areas
```

### The solution

The page uses a vertical Flex layout at the application level:

```css
.app-shell {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}
```

The main area uses two Grid columns:

```css
.main-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}
```

Each panel is also a vertical Flex container:

```css
.hub-panel {
  display: flex;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
}
```

The content wrapper reserves the available panel height:

```css
.community-content,
.opportunities-content {
  display: flex;
  flex: 1 1 0;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
}
```

The header, form, and filters are normal flex children and do not scroll. The feed receives the remaining space and becomes the only scrollable element:

```css
.post-feed,
.opportunity-feed {
  display: flex;
  flex: 1 1 0;
  min-height: 0;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
}
```

### Why `flex: 1 1 0` matters

`flex: 1 1 0` tells the feed to occupy the remaining space inside its panel. The feed can then grow or shrink according to the panel height instead of pushing the whole page outward.

### Why `min-height: 0` matters

Flex children often use their content's natural minimum height. If `min-height: 0` is omitted, a long feed may force the panel to expand instead of scrolling internally. Setting `min-height: 0` allows the feed to shrink within the panel and activate `overflow-y: auto`.

### Why `overflow: hidden` is used on the wrappers

The wrapper hides overflow so that only the child feed creates a scrollbar. Without this, both the wrapper and the feed may compete to scroll, which produces an inconsistent layout.

### Mobile override

Internal scrolling is appropriate for the desktop two-panel layout, but it is not comfortable on small screens. The mobile media query removes internal scrolling:

```css
@media (max-width: 800px) {
  .community-content,
  .opportunities-content,
  .post-feed,
  .opportunity-feed {
    min-height: auto;
    overflow: visible;
  }
}
```

This restores normal document flow so the whole mobile page scrolls from Navbar to Footer.

### Important implementation lessons

- Keep `Navbar` and `Footer` outside the feed scroll containers.
- Apply `overflow-y: auto` only to `.post-feed` and `.opportunity-feed` on Desktop.
- Use `min-height: 0` on nested Flex containers.
- Use `min-width: 0` to prevent long content from expanding Grid columns.
- Override internal scrolling on mobile with `overflow: visible`.

---

## UI States

### Community states

| State | Expected behavior |
|---|---|
| Loading | Spinner and loading message |
| Error | Error message and Retry button |
| Empty | Message when no posts exist |
| Filtered empty | Message when filters return no posts |
| Invalid form | Validation message inside the compose form |
| Liked | Distinct liked styling and updated count |
| Unliked | Default post styling |

### Opportunity states

| State | Expected behavior |
|---|---|
| Loading | Spinner and loading message |
| Error | Error message and Retry button |
| Empty | Message when no opportunities exist |
| Filtered empty | Message when filters return no opportunities |
| Apply | Action before submission |
| Applying | Disabled action while the request is pending |
| Applied | Disabled success state after submission |
| Saved | Visible local saved state |
| Expanded | In-place opportunity details |

---

## Manual Testing Checklist

### Community

1. Open the application and confirm the loading state.
2. Confirm that posts appear after a successful request.
3. Submit an empty post and confirm the validation message.
4. Submit a valid post and confirm that it appears at the top.
5. Confirm that the form resets after success.
6. Like a post and then unlike it.
7. Search by author or content.
8. Filter by category.
9. Search for a value that produces no results.
10. Confirm that the filtered-empty message appears.

### Opportunities

1. Confirm the opportunities loading state.
2. Confirm that opportunities appear after loading.
3. Search by title, company, or skill.
4. Filter by opportunity type.
5. Filter by work mode.
6. Combine search and filters.
7. Confirm the no-results message.
8. Expand an opportunity.
9. Open a different opportunity and confirm that Back appears.
10. Use Back and verify LIFO history behavior.
11. Save and unsave an opportunity.
12. Apply and confirm the `Applied` state.
13. Confirm that the Applied action cannot be submitted again.

### Notifications

1. Save an opportunity.
2. Apply to another opportunity or publish a post quickly.
3. Confirm that only one notification is visible.
4. Dismiss the current notification.
5. Confirm that the next notification appears in the original order.
6. Test an error notification by triggering a failed request.

### Responsive layout

Test at least these viewport widths:

| Device category | Suggested width |
|---|---:|
| Desktop | `1440px` |
| Tablet | `900px` |
| Mobile | `390px` |
| Small mobile | `320px` |

Confirm that there is no horizontal scrollbar, no overlapping cards, and no buttons outside their containers.

---

## Validation Commands

Run the following before delivery:

```powershell
npm run build
npm run lint
```

Then perform the final manual test with:

```powershell
npm run dev
```

---

## Troubleshooting

### The API does not respond

Run the project from its root directory:

```powershell
npm run dev
```

Confirm that port `3001` is not already occupied by another process.

### No data appears

Open the browser Developer Tools and inspect the Network tab. The expected requests are:

```text
/api/posts
/api/opportunities
```

### Seed data appears to be changed

The local API stores its data in memory. Restarting the development process resets the server data to the original seed state.

### Retry does not work

Confirm that the component passes the `refetch` function returned by `useFetch` to the Retry button.

### Save does not visually update

A mutation inside a `useRef` does not automatically trigger a React render. Confirm that the Save handler also updates a small React state value used as a render signal.

### Desktop scrolling is not independent

Check the following:

- `.main-content` uses two columns.
- `.hub-panel` has `min-height: 0` and `overflow: hidden`.
- `.community-content` and `.opportunities-content` use Flex column layout.
- `.post-feed` and `.opportunity-feed` have `flex: 1 1 0` and `overflow-y: auto`.
- The mobile media query changes the feed overflow to `visible`.

---

## Challenges and Solutions

### Keeping the UI synchronized with the API

The application updates posts and opportunities only after successful POST or PATCH responses. This prevents the UI from displaying a successful state before the server confirms the operation.

### Reusing loading and error logic

Community and Opportunities both need loading, error, retry, and data-update behavior. The `useFetch` Custom Hook centralizes that repeated logic and keeps both sections consistent.

### Managing detail history

The Stack is used because the required Back behavior is naturally LIFO. The most recently abandoned opportunity is always the first opportunity returned.

### Keeping notifications ordered

The current notification is separated from the Queue. Only the current item is rendered, while later notifications wait until the current one is dismissed.

### Building independent Desktop scroll areas

The most important CSS challenge was preventing a long Community feed from moving Opportunities and preventing a long Opportunities feed from moving Community. This was solved with nested Flex containers, `min-height: 0`, `flex: 1 1 0`, and `overflow-y: auto` applied only to the two feed elements.

### Designing mobile behavior separately

The desktop layout needs independent feed scrolling, but a mobile layout should normally use full-page scrolling. The media query switches the sections to normal document flow and removes their internal scrollbars.

---

## Future Improvements

Potential future improvements include:

- Persist saved opportunities in `localStorage` or a database.
- Add unit tests for Stack, Hash Table, Hash Set, and Queue.
- Add component tests with React Testing Library.
- Add optional automatic notification dismissal.
- Add pagination or infinite scrolling for larger datasets.
- Add user authentication and permissions.
- Add image uploads for community posts.
- Improve keyboard navigation and focus states.
- Add localized date and time formatting.
- Extract loading and error presentation into reusable components.

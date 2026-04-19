

The user wants three things on the chat surface:
1. **Static sidebar** with its own scroll and accordion sections for certain aspects (conversation groupings).
2. **Price comparison feature** — for listings being discussed in chat.
3. **Listing must also have a scroll** — the message thread / listing context panel needs proper scroll behavior.

Let me look at the current chat layout and the listing detail to understand scope.

The current `chat.tsx` already has a 2-pane layout. I'll restructure into a 3-pane desktop layout:
- **Left (static sidebar, 280px)** — conversations grouped via accordion: "Buying" / "Selling" / "Archived", each scrollable internally; sidebar itself does not scroll the page.
- **Middle (message thread, fluid)** — its own scroll container (sticky composer at bottom, sticky context header at top).
- **Right (context/comparison panel, 340px, desktop only)** — when conversation has a `listing_id`, shows the listing summary + a **Price Comparison** widget showing similar listings (same `category_id`, near same `price`) ranked cheapest-first with delta vs. current listing. Its own scroll.

Mobile: collapses back to single-pane stack with a "Compare prices" sheet trigger in the thread header.

## Architecture

**Sidebar accordion grouping** — derived client-side from existing `conversations` rows:
- "Buying" = conversations where `customer_id == user.id`
- "Selling" = conversations where `vendor_id == user.id`
- "Unread" = computed from existing unread map (top accordion, default open)

No DB changes needed. Use shadcn `Accordion` and `ScrollArea`.

**Price comparison widget** — query `listings` filtered by:
- same `category_id` as current listing
- `status = 'active'`
- exclude current listing
- order by `price asc`, limit 8

Show: thumbnail, title, kiosk name, price, delta badge (e.g. `−12% cheaper` in green, `+8% pricier` in amber). Each row links to that listing. Add an "Open in chat" quick action that creates/opens a conversation with that vendor (uses existing `getOrCreateConversation`).

**Scroll regions** (the user's "listing must also have a scroll" point):
- Sidebar: `h-[calc(100vh-4rem)]` with internal `ScrollArea` per accordion section.
- Thread: sticky header + sticky composer + middle scroll region — already partly there; tighten it.
- Right panel: full-height with `ScrollArea`; listing summary sticky at top, comparison list scrolls.

## Files

**New:**
- `src/components/chat/ConversationSidebar.tsx` — static sidebar with accordion + scroll
- `src/components/chat/ListingContextPanel.tsx` — right panel: listing summary + price comparison
- `src/components/chat/PriceComparison.tsx` — comparison list widget
- `src/components/chat/PriceComparisonSheet.tsx` — mobile sheet wrapper

**Edit:**
- `src/routes/chat.tsx` — switch to 3-pane grid `[280px_1fr_340px]`, extract sidebar
- `src/routes/chat.$conversationId.tsx` — add right panel on desktop, sheet trigger on mobile, ensure thread scroll container is properly bounded

**No DB migration. No new dependencies** (Accordion + ScrollArea already in `src/components/ui/`).

## Layout sketch

```text
+--------+----------------------+----------+
| Side   | Thread               | Context  |
| bar    | (sticky header)      | Listing  |
| (280)  |                      | summary  |
| Accord | scroll messages      | (sticky) |
| -ion   |                      |          |
| scroll |                      | Compare  |
|        | (sticky composer)    | scroll   |
+--------+----------------------+----------+
```

## Edge cases handled

- Conversation has no `listing_id` (kiosk-level chat) → right panel shows kiosk summary + "Other listings from this kiosk" instead of category-wide comparison.
- No similar listings → empty state in comparison.
- Mobile: right panel becomes a sheet triggered by a "Compare" button in thread header.
- Sidebar empty state per accordion section.

## Best practices

- Single source of truth for conversations (loaded in `chat.tsx`, passed to sidebar).
- Comparison query memoized + cached per `listing_id` to avoid re-fetching on message updates.
- Realtime subscription stays in `chat.tsx` (no duplication).
- All scroll regions use `ScrollArea` for consistent styling and accessible scrollbars.
- Sticky elements use `position: sticky` with proper `top`/`bottom` offsets accounting for navbar height.


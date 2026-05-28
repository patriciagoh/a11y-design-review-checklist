# a11y-design-review-checklist

> Generated from `checklist.json`. Do not edit by hand.
> Version 1.0.0 · WCAG 2.2 AA · Released 2026-05-28T00:00:00Z

Total items: 35

## Perceivable

### Annotation marker icons expose accessible names that describe purpose, not shape

- **ID:** `1.1.1-annotation-icon-labels`
- **WCAG 1.1.1** Non-text Content (Level A)
- **Tags:** `annotations`, `name-role-value`

Annotation markers (pins, region boxes, arrows, callouts) are the navigational landmarks of a design review — they are how a screen-reader user finds and enters each conversation. If the marker's accessible name describes its shape or color ('red circle', 'pin icon') rather than its purpose and target ('annotation 3 by Patricia on the header logo'), the user cannot orient themselves on the canvas or distinguish one thread from another in a list of markers.

**How to test:**
- Place several annotation markers of different types (pin, region, arrow) on an artifact, authored by different users.
- Tab through the markers with a keyboard and listen with a screen reader; confirm each one announces who authored it, a position or target reference, and (where relevant) a short summary or thread status.
- Open the annotation list / sidebar view and verify each marker entry has the same descriptive name, not a generic 'button' or 'pin icon'.
- Inspect each marker in DevTools: SVG/icon-only markers must use aria-label, aria-labelledby, or visually hidden text — not just title attributes or decorative alt="".

**Pass criteria:**
- Every annotation marker has an accessible name that identifies it uniquely and describes its purpose (e.g. 'Annotation 3 by Patricia on header logo, 2 replies, unresolved').
- Decorative shape descriptions ('red circle', 'pin', 'arrow icon') do not appear in the accessible name.
- The same descriptive name is used in both the on-canvas marker and any list/sidebar representation of the same annotation.

**Fail examples:**
- Pin renders as <button aria-label="pin"> for every annotation, so a screen-reader user hears 'pin, pin, pin, pin' while tabbing through ten threads.
- Marker SVG has <title>Red circle</title> and no other accessible name.
- Region annotations announce only 'button' because the icon is a background-image with no text alternative.
- Marker accessible name is the raw annotation ID ('annotation_a8f3b2') instead of author, target, and status.

**References:**
- [WCAG 1.1.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content)

### Uploaded artifacts expose human-authored alt text in the viewer header

- **ID:** `1.1.1-artifact-alt-text`
- **WCAG 1.1.1** Non-text Content (Level A)
- **Tags:** `name-role-value`, `media`

In a design-review tool, the artifact under review is the entire subject of the conversation — a screen-reader user who cannot perceive it has no way to participate in the thread. File names like 'Frame 47 copy 3.png' or 'final_v2_FINAL.fig' describe nothing. The uploader must supply meaningful alt text, and the viewer must surface it as the accessible name of the artifact region so assistive tech users know what is being reviewed before they engage with annotations.

**How to test:**
- Upload an artifact via the review tool's upload flow and confirm the form requires (or strongly prompts for) an alt text field separate from the file name.
- Open the resulting review with a screen reader (VoiceOver, NVDA, or JAWS) and navigate to the artifact viewer header.
- Confirm the announced name is the human-authored description, not the file name, file extension, or auto-generated string.
- Inspect the artifact element in DevTools and verify the accessible name (via aria-label, aria-labelledby, or alt) matches the authored text.

**Pass criteria:**
- The upload flow captures a dedicated alt text field that is distinct from the file name.
- The artifact viewer header (or the artifact element itself) exposes that authored text as its accessible name to assistive technology.
- If the uploader skips alt text, the UI either blocks publishing or clearly flags the artifact as missing a description rather than silently falling back to the file name.

**Fail examples:**
- Artifact viewer renders <img alt="Frame 47 copy 3.png"> using the raw upload filename.
- Upload modal has no alt text field at all; screen reader announces only 'image'.
- Alt text field exists but is optional with no warning, and the published review uses an empty alt attribute on a critical artifact.
- Alt text is stored but only shown in a tooltip on hover, never wired to the artifact's accessible name.

**References:**
- [WCAG 1.1.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content)

### Embedded screen recordings in threads ship with a text alternative that conveys the review content

- **ID:** `1.2.1-embedded-recording-alternative`
- **WCAG 1.2.1** Audio-only and Video-only (Prerecorded) (Level A)
- **Tags:** `media`, `threads`

Reviewers frequently attach short screen-recorded walkthroughs to a thread comment — 'here's what I changed on the nav, watch this 30-second clip' — and these recordings are typically silent video-only artifacts. A blind reviewer, a low-bandwidth user, or anyone who cannot play the embed needs the same information in text. The thread must surface a transcript, written summary, or detailed description alongside the embed so the review content lives in text, not only in pixels.

**How to test:**
- Attach a video-only screen recording (e.g. a Loom or .mp4 walkthrough with no audio track) to a thread comment.
- Confirm the comment composer prompts for, requires, or strongly nudges the author to add a written summary or transcript before publishing.
- Open the published thread card with a screen reader and verify the text alternative is read as part of the comment, not hidden behind a 'show transcript' toggle that lacks an accessible name.
- Inspect DOM: the alternative text must be programmatically associated with the embed (aria-describedby, adjacent text in the same comment, or a visible transcript region) — not stored only in a tooltip or metadata field.

**Pass criteria:**
- Every video-only embed in a thread is accompanied by a written transcript, summary, or step-by-step description in the same comment.
- The text alternative conveys the same review content (what changed, where, why) — not just 'video walkthrough attached'.
- The alternative is exposed to assistive technology by default, without requiring the user to discover and toggle a 'transcript' control.

**Fail examples:**
- Reviewer pastes a Loom embed showing edits to the checkout flow with the comment body 'see video'; no transcript or summary exists.
- Embed has a 'CC' button that only toggles auto-generated captions on the video player, with no separate text transcript in the thread.
- Transcript exists but is collapsed under an unlabeled chevron <button> with no accessible name, so screen readers skip past it.
- A 45-second silent walkthrough of color changes is captioned only as 'video.mp4 — 0:45'.

**References:**
- [WCAG 1.2.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/audio-only-and-video-only-prerecorded)

### Prerecorded video walkthroughs in threads include synchronized captions

- **ID:** `1.2.2-embedded-recording-captions`
- **WCAG 1.2.2** Captions (Prerecorded) (Level A)
- **Tags:** `media`, `threads`

Loom-style walkthroughs are now a default review medium — reviewers narrate decisions, point at regions, and explain rationale on top of a screen recording. For deaf and hard-of-hearing reviewers, that audio narration is the review. The embedded player must offer synchronized captions: either author-supplied caption tracks, or auto-generated captions that the author has reviewed and corrected before publishing. Captions that drift, mistranscribe component names, or are simply absent break participation for an entire class of reviewers.

**How to test:**
- Record a short walkthrough with spoken narration ('I moved the CTA from the right rail into the hero') and attach it to a thread comment.
- Open the published thread and confirm the embedded player exposes a captions control (CC button) with an accessible name and a visible state (on/off).
- Play the video with captions on and verify the captions appear synchronized with the spoken audio, including speaker changes if multiple voices are present.
- If captions are auto-generated, confirm the comment authoring flow surfaces a 'review captions' step before publish, and that corrected captions persist on the embed.
- Inspect the player: the caption track should be a real <track kind="captions"> or equivalent ARIA-exposed region, not burned-in pixels that cannot be styled or resized by the user.

**Pass criteria:**
- Every prerecorded video embed with audio content has a synchronized caption track available by default.
- The captions control is keyboard reachable, has an accessible name, and exposes its on/off state to assistive technology.
- If captions are auto-generated, the authoring flow requires or prompts the reviewer to verify them before the comment publishes.
- Captions are real text (selectable, resizable, restyleable) rather than burned into the video frame.

**Fail examples:**
- Loom embed has no CC button at all; deaf reviewer hears nothing and sees a silent screen recording with no transcript.
- Captions exist only as the platform's raw auto-transcript, with 'design system' transcribed as 'design sister' and no author review step.
- CC button is an unlabeled icon <button> with no accessible name; screen reader announces only 'button'.
- Captions are baked into the video as 12px white text on a light-grey UI screenshot, with no way to enlarge or restyle them.

**References:**
- [WCAG 1.2.2 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded)

### Live presentation and screen-share modes provide real-time captions for spoken narration

- **ID:** `1.2.4-live-presentation-captions`
- **WCAG 1.2.4** Captions (Live) (Level AA)
- **Tags:** `media`, `realtime`

When a design-review tool supports a live 'walkthrough' or presentation mode — one user shares their screen, navigates the artifact, and narrates rationale to other reviewers in the session — a deaf reviewer in that same session has no path into the conversation without live captions. Synchronous review is now a core collaboration pattern, and captioning it is a non-negotiable AA requirement, not a deferred 'nice to have' for prerecorded archives.

**How to test:**
- Start a live walkthrough / presentation session with at least one presenter narrating and one reviewer attendee.
- From the attendee view, confirm a 'live captions' control is present in the session toolbar, has an accessible name, and can be toggled on with the keyboard.
- Enable captions and verify spoken narration appears as text in near real time (typical latency under a few seconds), with speaker attribution when multiple presenters talk.
- Confirm captions are anchored to a stable on-screen region, are resizable or restyleable by the viewer, and do not obscure the artifact under review.
- Verify the captions region is exposed as a live region (aria-live="polite" or equivalent) so screen-reader users who also need captions get programmatic updates — and confirm the feature is documented in the tool's accessibility settings.

**Pass criteria:**
- Live presentation / screen-share modes offer live captions that can be enabled by any session participant.
- Captions render synchronously with spoken audio, attribute speakers when more than one person presents, and persist for the full duration of the session.
- The captions control is keyboard reachable and exposes its state to assistive technology.
- Caption display is positioned and styled so it does not occlude the artifact, and viewers can adjust size or contrast.

**Fail examples:**
- Presenter shares their screen narrating 'I'm collapsing the filter panel here because it crowds the canvas' and a deaf reviewer in the session sees only the cursor moving — no captions are available.
- Live captions exist but only the host can enable them, and they are off by default for attendees.
- Captions render as 11px white text overlaid on the shared artifact, obscuring the very region being discussed with no way to resize or reposition.
- Captions appear 20+ seconds behind the narration, so reviewers lose the connection between the presenter's words and what is being pointed at.
- The captions toggle is an unlabeled icon button in the session toolbar; keyboard users tab past it with no announcement of its purpose.

**References:**
- [WCAG 1.2.4 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/captions-live)

### Annotation pins programmatically associate with the region of the artifact they anchor to

- **ID:** `1.3.1-annotation-spatial-relationship-programmatic`
- **WCAG 1.3.1** Info and Relationships (Level A)
- **Tags:** `annotations`, `name-role-value`

An annotation pin's meaning depends entirely on what part of the artifact it points at. Sighted reviewers get that relationship for free — the pin sits visually on top of the button, the header, the broken state. A screen-reader user reading a comment in isolation has no idea which region it refers to unless the relationship is exposed in the DOM. The pin (or its associated thread card) must use aria-describedby, aria-labelledby, or an equivalent programmatic association pointing at the anchored region — not rely on x/y positioning alone.

**How to test:**
- Open a review with several annotations anchored to distinct regions (header logo, primary CTA, error state in a form).
- Inspect the pin element and the thread card in DevTools: confirm there is an aria-describedby, aria-labelledby, aria-controls, or equivalent attribute that resolves to an element identifying the anchored region by name (e.g. 'header logo region').
- Navigate with a screen reader to a thread card without first focusing the pin, and confirm the announcement still conveys which artifact region the thread refers to.
- Confirm the relationship survives when the pin is off-screen or the user opens the thread from the sidebar list (not by clicking the pin on canvas).

**Pass criteria:**
- Every annotation pin has a programmatic association — via aria-describedby, aria-labelledby, or an analogous mechanism — to a labeled element representing the anchored region.
- The thread card opened from the sidebar conveys the anchored region's name to assistive technology without requiring the user to first focus the on-canvas pin.
- The association uses semantic attributes, not visual positioning (absolute top/left coordinates) as the only signal of relationship.

**Fail examples:**
- Pin is an absolutely-positioned <div> at top:240px left:512px with no aria attribute tying it to any labeled region; screen-reader user hears 'Annotation 3, Patricia, looks broken' with no spatial context.
- Thread card sidebar entry reads 'Annotation on (240, 512)' — exposing raw pixel coordinates as the only relationship hint.
- The anchored region is implied only by which part of the artifact the pin visually overlaps; toggling the pins off in DevTools makes the relationship disappear entirely.
- Pin uses a title="header logo" attribute that screen readers do not consistently announce, with no aria-describedby fallback.

**References:**
- [WCAG 1.3.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships)

### Annotation threads use list semantics so replies are conveyed as a structured conversation

- **ID:** `1.3.1-thread-structure-semantics`
- **WCAG 1.3.1** Info and Relationships (Level A)
- **Tags:** `threads`, `name-role-value`

A thread is a conversation — a parent comment followed by ordered replies, sometimes with nested sub-replies. Sighted users see that structure through indentation and connecting lines. Screen-reader users need the same structure exposed via list semantics: <ul>/<ol> or role=list, with each reply as an <li>/role=listitem, and nested replies as nested lists. Without it, a screen reader reads twelve unrelated text blocks and the user cannot tell whether a comment is a top-level reply, a reply-to-a-reply, or part of a different thread entirely.

**How to test:**
- Open a thread with at least one parent comment, two top-level replies, and one nested reply (a reply to one of those replies).
- Inspect the DOM: the thread container should be a <ul>, <ol>, or role=list, with each reply as a direct list item child.
- Confirm the nested reply is inside a list nested within its parent reply's <li>, not flattened into the same top-level list.
- Navigate the thread with a screen reader and verify it announces list membership ('list with 3 items', 'item 2 of 3') and conveys nesting when entering sub-replies.
- Confirm replies are not implemented as a series of sibling <div> elements with no semantic grouping.

**Pass criteria:**
- Thread reply collections use list semantics (<ul>/<ol> or role=list) with each reply as a list item.
- Nested replies are nested lists inside their parent reply's list item — not flattened into a single top-level list.
- Screen readers announce list membership and item position when navigating through replies.

**Fail examples:**
- Thread renders as a stack of <div class="reply"> elements with no list role; screen reader reads them as isolated text blocks with no membership context.
- All replies — including replies-to-replies — are flat <li> elements in a single <ul>, so nesting is conveyed only by left-margin indentation.
- Reply container uses role="group" instead of list semantics, so screen readers do not announce item count or position.
- Each reply is a separate <ul> containing one <li>, producing fifteen one-item lists in a fifteen-reply thread.

**References:**
- [WCAG 1.3.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships)

### Version history exposes versions as a structured list with author and timestamp as programmatic fields

- **ID:** `1.3.1-version-list-semantics`
- **WCAG 1.3.1** Info and Relationships (Level A)
- **Tags:** `versioning`, `name-role-value`

The version history panel is how reviewers find 'the version Patricia approved last Tuesday' or 'the one before the navigation rework'. Sighted users skim a column of cards with version number, author avatar, and timestamp. Screen-reader users need that same structure exposed semantically: a list of versions, each as a grouped item with version label, author, and timestamp as programmatically associated fields — not three loose strings in a styled <div> that announces as 'V3 Patricia 2:14pm' with no relationship between the values.

**How to test:**
- Open the version history panel for an artifact with at least four versions authored by two different users on different days.
- Inspect the DOM: the version list should use <ul>/<ol> or role=list, and each version entry should be a list item containing semantically labeled fields (e.g. <dl> with version/author/date terms, or aria-label combining all three).
- Navigate with a screen reader and confirm each version announces as a single grouped item with version number, author, and timestamp in a coherent order — not as three orphan strings.
- Confirm the relationship between author and version is programmatic, not just visual proximity: removing CSS should not destroy the meaning.
- Verify the 'current' or 'latest' version is exposed (aria-current="true" or equivalent), not signaled only by a colored dot.

**Pass criteria:**
- Version history uses list semantics with each version as a list item.
- Each entry exposes version identifier, author, and timestamp as programmatically associated fields (via aria-label, <dl>, or labeled child elements).
- The current or active version is identified programmatically (aria-current or an equivalent attribute).
- Screen-reader announcement conveys all three pieces of information together as belonging to one version.

**Fail examples:**
- Version panel is a stack of <div class="version-row"> elements with no list role; screen reader reads 'V4 Patricia May 27' as three loose strings with no grouping.
- Author name is rendered only as an <img alt="Patricia"> avatar with no text equivalent in the version row's accessible name.
- Timestamp is rendered as '2h ago' with no programmatic datetime attribute, so screen readers cannot disambiguate which '2h ago' is which after a refresh.
- Current version is marked only with a green dot and the word 'current' in CSS ::before content — invisible to assistive tech.

**References:**
- [WCAG 1.3.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships)

### Artifact workflow state (draft, in review, approved, requires changes) is exposed programmatically, not by color or icon alone

- **ID:** `1.3.1-workflow-state-programmatic`
- **WCAG 1.3.1** Info and Relationships (Level A)
- **Tags:** `workflow-state`, `name-role-value`

Workflow state — is this design a draft, in review, approved, or sent back for changes — drives almost every reviewer decision: whether to comment, whether to approve, whether to ship. Designers commonly signal state with a colored chip ('blue = in review, green = approved, red = requires changes') and an icon. A blind reviewer or a colorblind reviewer needs the state exposed as text via aria-label, a labeled status region, or aria-current — not communicated only by a color or icon they cannot perceive.

**How to test:**
- Load artifacts in each available workflow state (draft, in review, approved, requires changes) and inspect the state indicator in DevTools.
- Confirm each state is exposed as text — either a visible label, an aria-label on the chip, or a labeled status region (role="status" or aria-live region for state changes).
- Navigate to the artifact header with a screen reader and confirm the current workflow state is announced as part of the artifact's context, without relying on the icon or chip color.
- Disable CSS in DevTools (or use a high-contrast / forced-colors mode) and verify the workflow state remains identifiable.
- Confirm color is not the sole signal — even with color stripped, the user must be able to tell draft from approved.

**Pass criteria:**
- Workflow state is exposed as text content or an accessible name on the state indicator (chip, badge, or header region).
- State changes are announced to assistive technology via a live region or a focusable confirmation, not silently re-colored.
- The current state is identifiable without relying on color or icon shape alone — text or accessible name carries the meaning.
- Forced-colors / high-contrast modes preserve a way to identify state.

**Fail examples:**
- State chip is a colored circle (blue/green/red) with no text label and no aria-label; screen-reader user hears nothing about the state.
- Workflow state is conveyed only by the chip's background color, with the text label hidden visually and not exposed to assistive tech.
- State transitions ('approved by Patricia') update the chip color silently with no aria-live announcement, so the reviewer who just requested changes never hears that an approval landed.
- Icon font is the only signal — a checkmark glyph means 'approved' — and screen readers announce only 'image' or the unicode codepoint.

**References:**
- [WCAG 1.3.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships)

### DOM reading order through annotation threads matches the visible reply order, including nested replies

- **ID:** `1.3.2-thread-reading-order`
- **WCAG 1.3.2** Meaningful Sequence (Level A)
- **Tags:** `threads`, `keyboard`

Threaded conversations only make sense in order — reply two answers reply one, reply three reacts to reply two, and a nested reply hangs off whichever parent it answers. Sighted reviewers follow the order top-to-bottom, indented for nesting. If the DOM order doesn't match (replies rendered in reverse-chronological order with CSS, or absolutely-positioned out of source order, or with nested replies hoisted to the bottom), screen-reader and keyboard users encounter the conversation as a scrambled transcript and cannot reconstruct who said what to whom.

**How to test:**
- Open a thread with at least five replies including one nested reply, and observe the visible top-to-bottom order.
- Disable CSS in DevTools (or view the page source) and confirm the DOM order of reply elements matches the visible order — including the nested reply appearing in source after its parent.
- Tab through the thread with a keyboard and confirm focus moves through replies in the same order as the visible sequence.
- Navigate the thread with a screen reader using arrow keys / browse mode and confirm replies are announced in the same order a sighted user reads them.
- If the UI offers a 'newest first' sort, confirm that toggling sort updates the DOM order — not just CSS flex-direction or order property.

**Pass criteria:**
- DOM source order of reply elements matches the visible top-to-bottom reading order under default styling.
- Nested replies appear in source immediately after their parent reply, not relocated via CSS to a different visual position.
- Sort changes (oldest/newest) reorder the DOM, not just the visual rendering via flex-direction:reverse or CSS order.
- Keyboard tab order and screen-reader browse order both follow the visible sequence.

**Fail examples:**
- Thread visually shows replies oldest-first but the DOM is newest-first with CSS flex-direction:column-reverse; screen-reader user reads the conversation backwards.
- Nested replies are rendered in a separate container at the bottom of the thread and visually positioned under their parent with absolute positioning — DOM order separates parent from child.
- Tab order through reply action buttons (reply / resolve / edit) jumps across the thread in source order rather than visible order, landing on the wrong reply's button.
- Sorting newest-first only flips CSS order; screen-reader users still hear oldest-first regardless of the visible sort.

**References:**
- [WCAG 1.3.2 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence)

### Instructions for creating and managing annotations do not rely on shape, color, or position alone

- **ID:** `1.3.3-annotation-instructions-not-sensory`
- **WCAG 1.3.3** Sensory Characteristics (Level A)
- **Tags:** `annotations`

Onboarding tooltips, empty-state hints, and help text in a review tool routinely point at controls using sensory cues alone — 'click the red pin icon on the right' or 'use the circle button at the top to add an annotation'. A blind reviewer cannot see red, a colorblind reviewer may not distinguish the color, and a screen-reader user on a small viewport may not perceive 'on the right'. Instructions must identify controls by their text label or accessible name as the primary reference — sensory cues can supplement, never replace.

**How to test:**
- Open the tool's first-run onboarding, empty-state hints, help panel, and any inline tooltips that explain how to create or manage annotations.
- Confirm each instruction names the target control by its visible text label or accessible name (e.g. 'use the Add annotation button') rather than by shape, color, or position alone.
- Confirm that when sensory descriptors do appear, they are supplements ('use the Add annotation button in the top toolbar') and not the only identifier.
- Audit any in-product tutorials, modal walkthroughs, and 'Did you know?' tips for phrasings like 'the red button', 'the icon on the right', 'the round control'.
- Verify localized strings preserve the text-label reference, not just the color or position language.

**Pass criteria:**
- Instructions identify controls by their visible text label or accessible name as the primary identifier.
- Sensory descriptors (color, shape, position) only ever supplement the text-label reference.
- No instruction relies exclusively on color ('the red icon'), shape ('the round button'), or position ('on the right') to identify a control.
- Localized variants of instructions preserve the same text-label-first pattern.

**Fail examples:**
- Empty-state hint reads 'Click the red pin icon on the right to add your first annotation' — no button name, only color and position.
- Tooltip says 'Use the circular button to reply' with no reference to the button's accessible name (Reply).
- Onboarding overlay highlights a control with an arrow and the caption 'Tap here' — no text label, just visual position.
- Help article instructs 'click the green checkmark to approve' — color and shape, no mention of an Approve button.

**References:**
- [WCAG 1.3.3 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics)

### The review tool functions in both portrait and landscape; thread and canvas panels reflow rather than locking orientation

- **ID:** `1.3.4-tool-orientation-flexibility`
- **WCAG 1.3.4** Orientation (Level AA)
- **Tags:** `navigation`

Reviewers on tablets, mounted displays, or devices fixed to a wheelchair often cannot rotate their screen. A design-review tool that forces landscape — common because designers want a wide canvas — locks out anyone whose device is held or mounted in portrait. The canvas, the thread panel, the version sidebar, and the toolbar must all reflow to the current orientation. Locking orientation is acceptable only where it is genuinely essential (a presentation mode mirroring a specific aspect ratio), and even then an unlock option should exist.

**How to test:**
- Open the review tool on a tablet (or in a mobile emulator) and rotate the device between portrait and landscape.
- Confirm the canvas, thread panel, version history, and toolbar all remain usable in both orientations — no 'please rotate your device' overlay, no clipped controls, no horizontal scroll required to reach core actions.
- Verify thread panels collapse, stack, or reflow appropriately in portrait rather than disappearing or being pushed off-screen.
- Confirm the user is not forced into a single orientation via meta viewport, CSS orientation media queries that hide content, or JS that blocks input until rotation.
- If any mode (e.g. presentation) does lock orientation, confirm that lock is genuinely essential and that the user is informed and given a way out.

**Pass criteria:**
- All primary review functions (view artifact, read threads, post replies, change version, change workflow state) work in both portrait and landscape.
- Layout reflows to fit the active orientation; no content is clipped, hidden, or made unreachable.
- No 'rotate your device' blocker is shown unless the orientation is genuinely essential to the task.
- Where orientation lock is essential, the user is given an explicit notice and an option to continue in a degraded mode.

**Fail examples:**
- Opening the review tool on an iPad in portrait shows a full-screen overlay 'Please rotate to landscape to continue' with no dismiss option.
- In portrait, the thread sidebar occupies the full width and the artifact canvas is reduced to a 60px-tall strip with no scroll or zoom recovery.
- CSS @media (orientation: portrait) hides the toolbar entirely, so reviewers cannot post a reply in portrait.
- Tablet reviewer mounted in portrait on a wheelchair tray cannot complete a review because the approve button is below a viewport that does not scroll.

**References:**
- [WCAG 1.3.4 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/orientation)

### External reviewer name and email fields declare appropriate autocomplete tokens

- **ID:** `1.3.5-comment-input-autocomplete`
- **WCAG 1.3.5** Identify Input Purpose (Level AA)
- **Tags:** `forms`

Design-review tools often invite external reviewers (clients, contractors, stakeholders) via a share link that asks for a name and email before posting a comment. These inputs collect the user's own identity information and must declare the WCAG-defined autocomplete tokens (autocomplete="name", autocomplete="email") so password managers, browser autofill, and assistive tech tools that translate or pre-fill fields can recognize their purpose. Missing or wrong tokens force users with motor or cognitive disabilities to re-type identity information on every external review.

**How to test:**
- Open an external reviewer entry flow (the gate that collects name and email before letting a guest post a comment).
- Inspect each input in DevTools and confirm name uses autocomplete="name" (or the appropriate granular token like given-name/family-name) and email uses autocomplete="email".
- Confirm autocomplete is not set to "off" or omitted entirely on identity fields.
- Test in a browser with a saved profile and verify the browser offers to autofill the values.
- If the form collects other recognized identity fields (organization, role title), confirm matching autocomplete tokens are used.

**Pass criteria:**
- Name input declares autocomplete="name" or the appropriate granular variant.
- Email input declares autocomplete="email".
- Autocomplete is not disabled (autocomplete="off") on identity-collection fields without a documented essential reason.
- Browser autofill successfully prefills the fields from a saved profile.

**Fail examples:**
- Guest-review gate has <input name="email"> with no autocomplete attribute; browser autofill silently does nothing and motor-impaired users retype their email every visit.
- Email field declares autocomplete="off" to force fresh entry, blocking autofill and password-manager assistance with no essential justification.
- Name field uses autocomplete="username" instead of "name", causing browsers to offer the wrong saved value.
- Form labels are correct but autocomplete tokens are omitted, so translation-and-autofill assistive tools cannot recognize the field purpose.

**References:**
- [WCAG 1.3.5 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose)

### Annotation resolution status uses an icon and text label, not color alone

- **ID:** `1.4.1-annotation-status-not-color-only`
- **WCAG 1.4.1** Use of Color (Level A)
- **Tags:** `annotations`, `contrast`

Open vs resolved is the most-scanned annotation attribute in a review — reviewers triage threads by it, designers filter by it, leads close out reviews against it. Tools commonly show 'open' as a filled pin and 'resolved' as the same pin in a muted gray or green. Without a distinct icon (e.g. an open circle vs a checkmark) and a visible or accessible text label, colorblind and low-vision reviewers cannot tell at a glance which threads still need attention.

**How to test:**
- Open a review with a mix of open and resolved annotations visible on the canvas, in the sidebar list, and in any filter chips.
- Confirm each annotation pin / list entry shows a distinct icon for open vs resolved (e.g. hollow dot vs checkmark) and a visible or accessible text label ('Open', 'Resolved').
- Run the canvas through Chrome DevTools deuteranopia and achromatopsia simulators and confirm open vs resolved remain distinguishable.
- Toggle Windows High Contrast / forced-colors mode and verify the resolution status icon and label survive.
- Confirm screen-reader announcement of each pin and list entry includes the resolution status as text.

**Pass criteria:**
- Open and resolved annotations use distinct icon shapes (not the same shape recolored).
- Resolution status is exposed as text (visible label or accessible name) on both the on-canvas pin and the sidebar list entry.
- Open and resolved remain distinguishable under colorblindness simulations and forced-colors mode.
- Screen-reader announcement of an annotation includes its resolution status.

**Fail examples:**
- Open pins are filled #FF5A5A red and resolved pins are filled #88B988 green — same pin shape, different color only; deuteranopic reviewers cannot triage.
- Sidebar list shows resolution status as a colored left-border stripe with no icon or text.
- Resolved annotations are dimmed to 40% opacity with no change in icon or label; a low-vision reviewer cannot tell dim-because-resolved from dim-because-poor-contrast.
- Filter chip 'Open' is a red dot and 'Resolved' is a green dot with no text labels on the chips themselves.

**References:**
- [WCAG 1.4.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color)

### Version-diff regions distinguish added, removed, and changed content using texture or iconography in addition to color

- **ID:** `1.4.1-version-diff-not-color-only`
- **WCAG 1.4.1** Use of Color (Level A)
- **Tags:** `versioning`, `contrast`

Version-compare views overwhelmingly use green for added regions and red for removed regions — the same red/green pairing that is invisible to roughly 1 in 12 men with red-green color blindness. A reviewer cannot evaluate whether a removed region was the right one to delete if they cannot tell removed from added. Diff highlights must combine color with a second visual channel: hatching, stripes, plus/minus iconography, or distinct outline styles, so the diff is readable regardless of color perception.

**How to test:**
- Open a version compare view between two versions with clear additions, deletions, and modifications across different regions of the artifact.
- Confirm added regions carry a non-color signal (e.g. diagonal hatching, a + icon badge, or a solid green outline), removed regions a different signal (e.g. cross-hatching, a − icon, or a dashed red outline), and changed regions a third (e.g. dotted outline or a Δ icon).
- Run the view through Chrome DevTools 'Emulate vision deficiencies' for deuteranopia and protanopia and confirm added vs removed are still distinguishable.
- Toggle forced-colors mode and verify the secondary channel (hatch / icon / outline style) survives.
- Inspect the diff legend and confirm it teaches users both the color and the shape/texture meaning.

**Pass criteria:**
- Added, removed, and changed diff regions each use a distinct non-color signal (texture, iconography, or outline style) in addition to color.
- The three diff states remain distinguishable in deuteranopia, protanopia, tritanopia, and achromatopsia simulations.
- The diff legend documents both color and the secondary signal.
- Forced-colors mode preserves a way to distinguish add / remove / change.

**Fail examples:**
- Added regions are filled with #6BCB77 green and removed regions with #FF6B6B red, with no outline, icon, or hatch; deuteranopic reviewers cannot tell which is which.
- Diff legend reads 'Green = added, Red = removed' with no shape or texture cue described.
- Changed regions are signaled only by a yellow tint that washes out in forced-colors mode and disappears entirely.
- Added and removed regions both use a solid outline of slightly different hues with no hatch or icon — distinguishable only by hue.

**References:**
- [WCAG 1.4.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color)

### Workflow state is conveyed by label and icon shape, never by color alone

- **ID:** `1.4.1-workflow-state-not-color-only`
- **WCAG 1.4.1** Use of Color (Level A)
- **Tags:** `workflow-state`, `contrast`

Workflow state — draft, in review, approved, requires changes — is one of the most consequential signals in a review tool: it tells reviewers whether to comment, approve, or stop. Many tools encode state with a single colored chip (blue / amber / green / red). A reviewer with deuteranopia, a reviewer in forced-colors mode, or anyone on a monochrome display loses the distinction. State must carry a visible text label and a distinguishing icon shape in addition to color, so the meaning survives when color is unavailable.

**How to test:**
- Open artifacts in each workflow state and visually inspect the state chip in the artifact header and in the dashboard list view.
- Confirm each state shows a visible text label ('Draft', 'In review', 'Approved', 'Requires changes') alongside any colored indicator.
- Confirm each state uses a distinguishable icon shape (e.g. pencil for draft, eye for in review, checkmark for approved, alert triangle for requires changes), not the same icon recolored.
- Enable a colorblindness simulator (Stark, Chrome DevTools 'Emulate vision deficiencies' for protanopia, deuteranopia, tritanopia, achromatopsia) and confirm each state remains distinguishable.
- Toggle Windows High Contrast / macOS Increase Contrast / forced-colors mode and verify each state chip remains identifiable by its label and icon.

**Pass criteria:**
- Every workflow state has a visible text label rendered as part of the chip.
- Each state uses a unique icon shape, not a recolored variant of the same glyph.
- All four states remain distinguishable under deuteranopia, protanopia, tritanopia, and achromatopsia simulations.
- Forced-colors mode preserves the label and icon so state is identifiable without the brand color.

**Fail examples:**
- Workflow chip is a 12px colored dot — blue for in review, green for approved, red for requires changes — with no accompanying text or icon.
- All states use the same circle icon recolored; a deuteranopic reviewer sees 'In review' and 'Approved' as the same muted yellow circle.
- Text label exists but is rendered in the same hue as the chip background (white text on #FFD166 amber chip) and disappears in forced-colors mode.
- Dashboard list view shows state only as a colored left border on each row, with no label column.

**References:**
- [WCAG 1.4.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color)

### Thread panel reflows to a single column at 320 CSS pixels wide without loss of content or function

- **ID:** `1.4.10-thread-panel-reflow-320px`
- **WCAG 1.4.10** Reflow (Level AA)
- **Tags:** `threads`

WCAG 1.4.10 requires content to be usable at 320 CSS pixels wide without two-dimensional scrolling. In a review tool, the thread panel is the densest text region — it commonly uses a two-column layout (avatar / reply meta on the left, comment body on the right) that breaks down at narrow widths. At 320px, the thread must reflow to a single column with the avatar inline above or beside the author name, replies stacked vertically, and every action (Reply, Resolve, Edit, Delete) reachable without horizontal scroll.

**How to test:**
- Resize the viewport to exactly 320 CSS pixels wide (Chrome DevTools device toolbar, custom 320×768).
- Open a thread with a parent comment, three replies, one nested reply, and a code block.
- Confirm no horizontal scrollbar appears on the thread panel itself (vertical scroll is fine and expected).
- Confirm every reply action (Reply, Resolve, Edit, Delete, React) is reachable — collapsed into a menu is acceptable, hidden off-screen is not.
- Confirm avatar/author/timestamp metadata reflows inline rather than being clipped or hidden.
- Verify the code block and any tables in comment bodies remain readable (code may wrap or use horizontal scroll inside the code block element — that is allowed under 1.4.10's exception for content requiring two-dimensional layout).

**Pass criteria:**
- At 320 CSS pixels wide, the thread panel does not introduce horizontal page or panel scrollbars.
- Thread layout collapses to a single column with avatar, author, timestamp, and body stacked or inlined coherently.
- All reply actions remain reachable at 320px, either inline or via an accessible overflow menu.
- Code blocks and other content that legitimately need two-dimensional layout scroll only within their own container, not the whole panel.

**Fail examples:**
- At 320px the thread panel keeps a fixed 480px two-column layout, producing horizontal scroll on every reply.
- Reply action buttons (Resolve / Edit / Delete) are pushed off the right edge at 320px with no overflow menu.
- Avatar column is fixed at 64px wide, leaving 256px for the comment body, and long words break out of the comment surface causing page-level horizontal scroll.
- @mention pills wrap to a second line at 320px but their tap target is clipped to the original first-line position, becoming unreachable.

**References:**
- [WCAG 1.4.10 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/reflow)

### Annotation pin focus and selection outlines meet 3:1 against both the pin fill and the underlying artifact

- **ID:** `1.4.11-annotation-pin-outline-contrast`
- **WCAG 1.4.11** Non-text Contrast (Level AA)
- **Tags:** `contrast`, `annotations`, `focus`

When a pin is focused (via Tab) or selected (via click), the tool draws a focus ring or selection outline around it. That outline is a non-text UI indicator and must meet 3:1 contrast — but uniquely for pins, the outline sits between the pin fill and the artifact, so it must meet 3:1 against both. A common failure: a 2px white ring around a red pin on a white artifact background. The ring contrasts beautifully with the pin but disappears entirely against the artifact, leaving keyboard users with no visible focus.

**How to test:**
- Tab to an annotation pin and observe the focus ring; click another pin to select it and observe the selection outline.
- Sample the outline color against the pin fill and against the immediately surrounding artifact pixels (using Stark or the DevTools color picker), and confirm 3:1 against each independently.
- Repeat across artifact backgrounds — white, near-black, mid-gray, saturated brand color, photographic — and confirm 3:1 holds against the artifact in every case.
- Confirm the outline strategy (often a two-layer ring — inner ring matching one and outer ring contrasting with the other) works at 100% and 200% zoom without becoming visually thin.
- Verify that focus and selection outlines remain visible in forced-colors / high-contrast mode.

**Pass criteria:**
- Annotation pin focus and selection outlines meet 3:1 contrast against the pin fill.
- The same outlines meet 3:1 contrast against the underlying artifact background across white, near-black, mid-gray, saturated, and photographic backgrounds.
- The outline remains visually present at 100% and 200% zoom.
- Forced-colors mode preserves a visible focus ring on pins.

**Fail examples:**
- Focus ring is a 2px #FFFFFF white outline around a #FF5A5A red pin — contrasts 4.0:1 with the pin but 1.0:1 against a white artifact background, so the ring vanishes.
- Selection outline is a #1A1A1A near-black ring that contrasts 14:1 with a red pin but disappears against a dark photograph artifact at 1.2:1.
- Focus ring uses a thin 1px #B3B3B3 mid-gray that measures 1.4:1 against both pin and artifact in worst-case regions.
- In forced-colors mode the outline disappears entirely because it was rendered via box-shadow rather than outline / border.

**References:**
- [WCAG 1.4.11 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast)

### Version-diff highlight outlines meet 3:1 contrast against base content at all zoom levels

- **ID:** `1.4.11-version-diff-highlight-contrast`
- **WCAG 1.4.11** Non-text Contrast (Level AA)
- **Tags:** `contrast`, `versioning`

Version-diff outlines are non-text UI components — they communicate where additions, deletions, and changes are without using text. Under WCAG 1.4.11, the visual boundaries of these highlights must meet 3:1 contrast against adjacent colors. A pale green added-region outline on a white screenshot, or a thin pink deletion outline on a pastel background, falls below 3:1 and effectively hides the diff from low-vision reviewers — defeating the entire purpose of the compare view.

**How to test:**
- Open a version-compare view with added, removed, and changed regions visible on a mix of white, light-gray, and saturated backgrounds.
- Sample the outline color of each diff highlight against the immediately adjacent base content using Stark, axe DevTools, or the Chrome DevTools color picker, and confirm 3:1 minimum.
- Zoom to 100%, 200%, and 400% and re-sample — confirm the outline does not become so thin at high zoom that it visually disappears.
- Test against worst-case backgrounds: place a small added region on a near-matching background color and verify the outline still meets 3:1.
- Confirm the diff outline meets 3:1 in both light and dark themes.

**Pass criteria:**
- Added, removed, and changed diff outlines each meet 3:1 contrast against adjacent base content across all sampled backgrounds.
- Contrast holds at 100% / 200% / 400% zoom and in both light and dark themes.
- Outlines remain visually distinguishable at the minimum supported outline thickness (typically 2px).
- axe DevTools (non-text contrast rule) returns no violations on the diff outlines.

**Fail examples:**
- Added-region outline is #C8E6C9 pale green on a #FFFFFF background at 1.4:1.
- Removed-region outline is a 1px #FFB3B3 line that drops below visual perception at 200% zoom and measures 1.9:1 even at 100%.
- Changed-region outline is a yellow dotted line at 2.2:1 against a beige screenshot.
- Dark theme inverts the outline to #2E5C2E dark green on a #1A1A1A panel at 2.1:1.

**References:**
- [WCAG 1.4.11 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast)

### Thread comments tolerate user-applied text spacing without clipping, overlap, or loss of function

- **ID:** `1.4.12-thread-text-spacing-survives`
- **WCAG 1.4.12** Text Spacing (Level AA)
- **Tags:** `threads`

Users with dyslexia, low vision, or cognitive disabilities frequently apply user stylesheets or browser extensions that override text spacing — line-height 1.5x, paragraph spacing 2x font size, letter-spacing 0.12em, word-spacing 0.16em. Thread comments are dense paragraphs with embedded mentions, links, and timestamps; layouts that pin avatars to fixed heights, truncate at fixed line counts, or use fixed-height comment cards will clip or overlap content under these settings. The thread must absorb the spacing without losing words or buttons.

**How to test:**
- Open a thread with several multi-paragraph comments, then apply the WCAG text-spacing bookmarklet (or paste these styles in DevTools): line-height: 1.5; letter-spacing: 0.12em; word-spacing: 0.16em; and paragraph spacing (margin-bottom on p) at least 2x the font-size.
- Confirm no text is clipped, truncated, or hidden by overflow:hidden on comment cards or reply containers.
- Confirm avatars, author names, timestamps, and action buttons do not overlap the comment body or each other.
- Confirm @mention pills, links, and code blocks reflow gracefully and remain readable.
- Verify the same spacing applied at 320px viewport width still produces a usable thread.

**Pass criteria:**
- Thread comments accept line-height 1.5, paragraph spacing 2x font-size, letter-spacing 0.12em, word-spacing 0.16em without clipping, truncation, or overlap.
- Comment cards grow vertically to accommodate the new spacing rather than clipping at a fixed height.
- Action buttons, mention pills, links, and timestamps remain reachable and readable.
- Spacing tolerance holds at narrow viewports (320px) and standard widths.

**Fail examples:**
- Comment card has a fixed height of 96px with overflow:hidden; applying line-height 1.5 clips the second paragraph of every comment.
- Reply container uses display:grid with fixed row heights, so increased line-height causes the timestamp row to overlap the comment body.
- @mention pill is positioned absolutely relative to a fixed-height card; letter-spacing increases push the pill over the comment text.
- Action button row sits on a fixed bottom anchor; increased paragraph spacing makes the body text scroll under the buttons, hiding the last sentence behind the action bar.

**References:**
- [WCAG 1.4.12 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing)

### Mention and quick-info popovers triggered on hover or focus are dismissable, hoverable, and persistent

- **ID:** `1.4.13-comment-mention-popovers-dismissable`
- **WCAG 1.4.13** Content on Hover or Focus (Level AA)
- **Tags:** `threads`, `focus`

Hovering or focusing an @mention chip or an annotation pin in a thread commonly opens a small popover with the user's profile, the annotation's region preview, or thread metadata. Under WCAG 1.4.13, that additional content must be (a) dismissable without moving the pointer — typically via Escape, (b) hoverable so the user can move the pointer into the popover to read it without it disappearing, and (c) persistent until the user dismisses it, the trigger loses hover/focus, or the information becomes invalid. It also must not obscure the trigger that opened it.

**How to test:**
- Hover an @mention chip in a thread comment until its profile popover appears.
- Press Escape and confirm the popover dismisses without moving the pointer or focus.
- Hover the popover itself (move the pointer from the trigger into the popover content) and confirm it stays open rather than disappearing once the pointer leaves the trigger.
- Confirm the popover does not visually obscure the @mention chip or the surrounding sentence — it should anchor adjacent, not on top of.
- Repeat the test with keyboard focus instead of hover (Tab to the mention chip, confirm popover appears, press Escape to dismiss, confirm focus returns to the trigger).
- Test the same behaviors for any annotation-pin hover preview and any thread-card quick-info popover.

**Pass criteria:**
- Mention and quick-info popovers can be dismissed with Escape without moving pointer or focus.
- The popover remains visible when the pointer moves from the trigger into the popover content.
- The popover persists until the user dismisses it, the trigger loses hover/focus, or the underlying information becomes invalid.
- The popover does not obscure the trigger element that opened it.
- Keyboard focus produces equivalent popover behavior to pointer hover, including dismiss-on-Escape.

**Fail examples:**
- Hovering an @mention shows a profile popover that disappears the instant the pointer leaves the chip, so the user cannot move into it to read the bio or click a link inside.
- Annotation pin hover preview cannot be dismissed without scrolling or clicking elsewhere — pressing Escape does nothing.
- Mention popover renders directly on top of the chip itself, hiding the @mention text behind the popover until the popover closes.
- Keyboard focus on a mention chip opens the popover but Escape closes the entire thread panel instead of just the popover.
- Quick-info popover auto-dismisses after 2 seconds regardless of hover or focus state, cutting off slow readers mid-sentence.

**References:**
- [WCAG 1.4.13 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus)

### Annotation pins meet 4.5:1 contrast against the artifact at every supported zoom level

- **ID:** `1.4.3-annotation-pin-contrast`
- **WCAG 1.4.3** Contrast (Minimum) (Level AA)
- **Tags:** `contrast`, `annotations`

Annotation pins are essential meaningful content — they are how reviewers locate every conversation on the artifact. But pins sit on top of the artifact, which can be any color, gradient, photo, or screenshot. A fixed pin color (e.g. #FF5A5A red) that meets contrast against a white background will disappear against a red error-state screenshot or a dark photograph. Pins must maintain a 4.5:1 contrast ratio against whatever they overlay, at every zoom level the tool supports — typically via a high-contrast halo, an outline ring, or automatic color adaptation.

**How to test:**
- Place annotation pins on regions of the artifact with varied backgrounds: white, near-black (#1A1A1A), saturated brand colors, a photograph, and a gradient.
- Sample the pin's effective foreground color (the fill plus any halo / outline ring) and the background it overlays using axe DevTools, Stark, or the Chrome DevTools color picker, and confirm 4.5:1 minimum at each location.
- Zoom the browser to 100%, 150%, 200%, and 400% and re-sample — confirm contrast is preserved as the pin and artifact scale.
- Apply a screenshot artifact with a busy gradient background and place a pin in the worst-case region; measure with a manual contrast sampler (Stark / Colour Contrast Analyser) and confirm pass.
- Verify the pin's contrast strategy (halo / outline / adaptive fill) is applied consistently — not only on pin hover or focus.

**Pass criteria:**
- Annotation pins meet 4.5:1 contrast against the underlying artifact across all sampled background colors and at 100% / 150% / 200% / 400% zoom.
- Contrast is achieved through an inherent property of the pin (high-contrast halo, outline, or adaptive fill) — not by hovering, focusing, or selecting.
- Pin contrast is preserved when the artifact is a photo, gradient, or screenshot with multiple competing colors.
- axe DevTools and Stark return no contrast violations on the pin element across the tested backgrounds.

**Fail examples:**
- Pin fill is fixed at #FF5A5A and disappears against red regions of an error-state screenshot.
- Pin is a solid #FFFFFF white circle with no outline; it vanishes against a white background and is invisible at 200% zoom over a light-gradient photograph.
- Pin meets contrast at 100% zoom but a halo dropped at 200% zoom drops it to 2.8:1 against a mid-gray gradient.
- Pin only gains a contrasting outline ring on hover; resting state on a busy background is unreadable until the user finds the pin to hover it.

**References:**
- [WCAG 1.4.3 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)

### Presence avatar text overlays (initials, status labels) meet 4.5:1 contrast

- **ID:** `1.4.3-presence-avatar-name-contrast`
- **WCAG 1.4.3** Contrast (Minimum) (Level AA)
- **Tags:** `contrast`, `realtime`

Real-time presence in a review tool surfaces who else is on the artifact — typically a row of small circular avatars colored from a user-color palette, often with the user's initials overlaid on the avatar fill. Tooltip labels, live cursor name tags, and 'editing' status pills follow the same color logic. When the avatar background uses a saturated user color and the overlaid initials are white at small sizes (often 11–12px), contrast fails for many palette entries. Initials, name tags, and status labels all need 4.5:1 against their avatar or pill background.

**How to test:**
- Render the presence row with at least eight active users covering the full user-color palette (especially pale yellows, light greens, mid-grays).
- Inspect each avatar's initials and sample its contrast against the avatar fill using axe DevTools, Stark, or a manual contrast tool.
- Confirm 4.5:1 for every palette color, not just the most saturated ones.
- Repeat for live cursor name tags (the small flag attached to a moving cursor) and any 'Editing' / 'Viewing' status pills.
- Verify the same contrast strategy applies in dark mode and in forced-colors mode.

**Pass criteria:**
- Avatar initials meet 4.5:1 against the avatar fill for every user-color palette entry.
- Live cursor name tags meet 4.5:1 against the tag background.
- Presence status pills ('Editing', 'Viewing', 'Idle') meet 4.5:1 internally.
- Contrast holds in light theme, dark theme, and forced-colors mode.

**Fail examples:**
- Pale yellow avatar (#FFE066) with white 11px initials measures 1.4:1.
- Live cursor name tag uses the user color as the tag background with the same color as a thin outline only — name text is white at 12px on a light-coral background and reads 2.1:1.
- 'Editing' status pill is #B5EAD7 mint with white text at 1.6:1.
- Initials look fine in light mode but in dark mode the avatar gains a dark overlay that drops white initials to 3.2:1 against the resulting muddy fill.

**References:**
- [WCAG 1.4.3 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)

### Thread comment body text meets 4.5:1 contrast against the thread surface, including code blocks, quoted text, and link colors

- **ID:** `1.4.3-thread-comment-text-contrast`
- **WCAG 1.4.3** Contrast (Minimum) (Level AA)
- **Tags:** `contrast`, `threads`

Thread comments are dense text-heavy content — review feedback, code snippets, quoted prior comments, @mentions, and inline links. Designers often style secondary content (quoted text, code blocks, timestamps, link colors) with reduced contrast to create visual hierarchy, pushing them below the 4.5:1 AA threshold. Every styled variant of comment body text — including code blocks, quoted text, link colors, and @mention pills — must meet 4.5:1 against its background, not just the primary paragraph color.

**How to test:**
- Open a thread that contains primary text, a quoted previous comment, an inline code block, a fenced code block, an inline link, and an @mention pill.
- Run axe DevTools on the thread panel and resolve every contrast finding; sample each variant individually with Stark or the Chrome DevTools color picker.
- Confirm code-block text (often a monospace at reduced color) meets 4.5:1 against the code-block background, not just against the panel background.
- Confirm link color meets 4.5:1 against the comment surface in both default and visited states.
- Confirm @mention pills (pill background + pill text) meet 4.5:1 internally and that the pill outline meets 3:1 against the comment surface if the pill carries meaning by shape.

**Pass criteria:**
- Primary comment text meets 4.5:1 against the thread surface.
- Quoted text, code-block text, link text (default and visited), and @mention pill text each meet 4.5:1 against their respective immediate background.
- axe DevTools reports zero contrast violations on the thread panel.
- Contrast is preserved in both light and dark thread themes.

**Fail examples:**
- Quoted prior comment is rendered as #9AA0A6 text on a #F5F5F5 quote-block background — 2.7:1, far below AA.
- Inline code uses #C7254E pink text on a #F7F7F9 background at 4.3:1, just under threshold.
- Link color is #6FA8DC light blue on a white comment surface at 2.6:1; visited links drop further to 2.1:1.
- @mention pill renders white text on #B4D8F8 light blue at 1.9:1, illegible to low-vision reviewers.

**References:**
- [WCAG 1.4.3 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)

### Tool chrome remains usable at 200% browser zoom without horizontal scroll on sidebars, thread panel, or workflow controls

- **ID:** `1.4.4-tool-ui-resize-200`
- **WCAG 1.4.4** Resize Text (Level AA)
- **Tags:** `zoom-pan`

Review tools cram sidebars, thread panels, version history, presence rows, and workflow controls around a fixed-aspect artifact canvas. At 200% zoom, designers commonly assume the artifact area can pan/scroll within itself (which is fine — the artifact is essential preview content), but the surrounding chrome must not require horizontal page scroll to reach the Reply button, the Approve action, or the version switcher. Toolbars must wrap, sidebars must collapse, and labels must reflow — the chrome is text-and-image content that must scale.

**How to test:**
- Open a review at 1280×800, then zoom the browser to 200% (Ctrl/Cmd + several times) and confirm no horizontal scrollbar appears on the page chrome.
- Confirm the thread panel, version sidebar, workflow controls, presence row, and top toolbar all remain reachable without horizontal scrolling on the chrome.
- Confirm sidebars collapse or reflow rather than disappearing or being pushed off-screen at 200%.
- The artifact area itself may scroll/pan internally — that is acceptable, but every chrome control (Approve, Reply, Resolve, Switch version) must remain visible or reachable via collapse/menu without horizontal page scroll.
- Repeat the test at the OS-level text-size 200% (where supported) in addition to browser zoom, since some users use OS scaling rather than browser zoom.

**Pass criteria:**
- At 200% browser zoom, no horizontal scrollbar appears on the chrome of the review tool.
- All primary chrome controls (workflow actions, reply, resolve, version switch, presence) remain reachable without horizontal page scroll.
- Sidebars and panels reflow, collapse, or move into menus rather than overflowing the viewport.
- The internal scrolling of the artifact area does not count as a failure — only chrome scroll does.

**Fail examples:**
- At 200% zoom on a 1280px viewport, the Approve and Request changes buttons are pushed off the right edge of the screen and only reachable by horizontal page scroll.
- Thread panel maintains a fixed 360px width at all zoom levels, leaving only 100px for the artifact column at 200% and producing horizontal overflow.
- Version sidebar disappears entirely at 200% with no menu fallback, leaving reviewers unable to switch versions.
- Top toolbar text labels overlap at 200% because the toolbar uses a fixed-pixel grid that cannot wrap.

**References:**
- [WCAG 1.4.4 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/resize-text)

## Operable

### Users can place a new annotation pin on the artifact using the keyboard alone

- **ID:** `2.1.1-annotation-placement-keyboard`
- **WCAG 2.1.1** Keyboard (Level A)
- **Tags:** `keyboard`, `annotations`

Creating a new annotation is the foundational action in a design-review tool — without it, a user can read threads but cannot contribute. Tools overwhelmingly implement annotation placement as a pointer-only flow (click the canvas at the desired location), making the most important contributive action of the product inaccessible to keyboard-only and switch-control users. A keyboard path must exist: a discoverable command to enter placement mode (e.g. an 'Add annotation' button or shortcut), arrow keys to move a visible placement cursor across the canvas, and Enter to commit the placement and open the comment composer.

**How to test:**
- Focus the canvas using the keyboard and locate the 'Add annotation' control (a toolbar button or a documented shortcut such as 'a').
- Activate it with Enter or Space and confirm a visible placement cursor appears on the canvas with an accessible name announcing the mode ('Annotation placement mode active, use arrow keys to position').
- Use arrow keys (with optional Shift for larger steps) to move the placement cursor and confirm its position updates visibly and is announced — typically via a live region reporting coordinates or the underlying region name.
- Press Enter and confirm the pin is committed at the cursor location and the comment composer opens with focus inside the textarea.
- Press Escape during placement and confirm placement mode exits without creating a pin and focus returns to the originating control.

**Pass criteria:**
- An 'Add annotation' control is keyboard reachable and entering placement mode does not require a mouse click on the canvas.
- A visible placement cursor renders on the canvas with an accessible name announcing the active mode.
- Arrow keys move the placement cursor in granular increments and the position is announced or programmatically observable.
- Enter commits the pin and moves focus to the comment composer; Escape cancels and restores focus to the originating control.

**Fail examples:**
- Placement is bound only to canvas-click; keyboard users can read every existing annotation but cannot create one.
- 'Add annotation' button is reachable by Tab but activating it immediately requires a canvas mouse-click to set position, with no keyboard cursor.
- Arrow keys scroll the page rather than moving the placement cursor, because the canvas does not capture key events while in placement mode.
- Placement cursor appears visually but has no accessible name and emits no announcement; a screen-reader user cannot tell whether the mode is active.
- Pressing Enter commits the pin but focus stays on the toolbar button instead of moving into the comment composer, requiring the user to Tab through the entire chrome to reach the textarea.

**References:**
- [WCAG 2.1.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/keyboard)

### Every thread action — reply, resolve, edit, delete, mention — is operable from the keyboard alone

- **ID:** `2.1.1-thread-keyboard-actions`
- **WCAG 2.1.1** Keyboard (Level A)
- **Tags:** `keyboard`, `threads`

A thread is interactive content: reviewers reply, resolve, edit their own comments, delete mistaken posts, and insert @mentions to pull collaborators in. If any of these actions is gated behind a hover-only menu, a right-click context menu without a keyboard equivalent, or a typeahead that requires pointer selection, keyboard-only users are reduced to read-only participants — they can see the conversation but cannot take part. Every action must reach via Tab, activate via Enter or Space, and the mention typeahead must support arrow keys + Enter to select a candidate.

**How to test:**
- Open a thread containing a comment the current user authored and one authored by someone else.
- Tab through the thread and confirm Reply, Resolve, Edit (on own comment), Delete (on own comment), and a React/Emoji action are each reachable with a visible focus indicator and an accessible name.
- Activate Reply with Enter; confirm focus moves into the reply textarea. In the textarea, type '@' and a partial name, and confirm the mention typeahead opens.
- Use arrow keys to move through the typeahead candidates and Enter to select one; confirm a mention chip is inserted at the cursor.
- Confirm Resolve toggles state, that Edit places the cursor in an editable comment body, and that Delete prompts a keyboard-accessible confirmation rather than firing silently.

**Pass criteria:**
- Reply, Resolve, Edit, Delete, and Mention-insertion are each reachable and activatable using only the keyboard.
- Each action exposes a visible focus indicator and an accessible name.
- The @mention typeahead supports arrow keys to move through candidates and Enter to select.
- Destructive actions (Delete) trigger a keyboard-operable confirmation, not a silent removal.

**Fail examples:**
- Edit and Delete only appear in a hover-only kebab menu that never opens on keyboard focus; keyboard users can never edit or delete their own comments.
- Resolve action is implemented as a right-click context-menu item with no keyboard equivalent in the thread toolbar.
- Typing '@' opens the mention typeahead visually but arrow keys move the textarea caret instead of the typeahead selection, and Enter inserts a newline instead of selecting a candidate.
- Reply button has tabindex='-1' so it never receives focus; keyboard users can read replies but never post one.
- Delete fires immediately on Enter with no confirmation, deleting a comment by accident when the user meant to activate Reply on the adjacent button.

**References:**
- [WCAG 2.1.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/keyboard)

### Workflow state transitions (Submit for review, Approve, Request changes) are operable from the keyboard alone

- **ID:** `2.1.1-workflow-transition-keyboard`
- **WCAG 2.1.1** Keyboard (Level A)
- **Tags:** `keyboard`, `workflow-state`

Workflow transitions are the highest-stakes actions in the tool — approving an artifact, sending it back for changes, or moving it from draft to review changes downstream behavior across the whole team. These actions are commonly clustered in a workflow toolbar with custom-styled buttons or split-button menus that look right but bypass native button semantics. Every workflow transition must be reachable by Tab, activatable by Enter or Space, and any confirmation modal that gates a destructive transition must itself be keyboard operable (focus moves to the modal, Escape cancels, Enter confirms the primary action).

**How to test:**
- Load an artifact in 'In review' state where the current user has permission to approve or request changes.
- Tab to the workflow toolbar and confirm Submit for review (where applicable), Approve, and Request changes are each reachable with a visible focus indicator.
- Activate each transition with Enter and confirm the action fires — including the case where the control is a split-button (primary + caret) where both the primary action and the dropdown are keyboard reachable.
- If the transition opens a confirmation modal ('Are you sure you want to request changes?'), confirm focus moves into the modal, Escape cancels, and Enter confirms the primary action.
- Confirm the resulting state change is announced via a live region or by moving focus to a confirmation message — not signaled only by a silent chip-color change.

**Pass criteria:**
- Submit for review, Approve, and Request changes are reachable by Tab and activatable by Enter or Space.
- Split-button workflow controls expose both the primary action and the dropdown menu to keyboard users.
- Confirmation modals gating destructive transitions move focus into the modal, support Escape to cancel, and Enter to confirm.
- State transitions are announced to assistive technology, not signaled only by a silent visual change.

**Fail examples:**
- Approve button is rendered as a styled <div onClick=...> with no tabindex; keyboard users cannot reach the highest-stakes action in the product.
- Request changes opens a confirmation modal but focus stays on the trigger button behind the modal, so keyboard users cannot reach the Confirm button without manually tabbing through the entire underlying page first.
- Workflow split-button exposes the primary Approve but the caret dropdown (which contains 'Approve with comment' and 'Approve and notify team') is pointer-only.
- Pressing Enter on the focused Approve button does nothing because the handler is bound to click only, not to keydown.
- Modal traps focus correctly but Escape does not close it, so a user who tabbed in by mistake cannot back out.

**References:**
- [WCAG 2.1.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/keyboard)

### Artifact zoom and pan are fully operable from the keyboard alone

- **ID:** `2.1.1-zoom-pan-keyboard`
- **WCAG 2.1.1** Keyboard (Level A)
- **Tags:** `keyboard`, `zoom-pan`

Zooming into a button hit-state, panning to the corner of an artboard, and resetting back to fit-to-screen are core review actions — they are how a reviewer inspects whether the spec is right. Tools commonly ship zoom and pan as pointer-only gestures (scroll-wheel zoom, click-drag pan, pinch on trackpad), leaving keyboard-only and switch-control users locked out of every part of the artifact that is not visible in the default viewport. Zoom in, zoom out, fit-to-screen, and pan in four directions must each have a discoverable keyboard equivalent — either standard shortcuts (+/−, 0 to reset, arrow keys to pan) or documented bindings surfaced in the keyboard-shortcuts help dialog.

**How to test:**
- Open an artifact larger than the canvas viewport so panning and zooming are necessary to inspect every region.
- Use only the keyboard to zoom in (try + and =), zoom out (try -), reset to fit-to-screen (try 0), and pan in all four directions (try arrow keys after focusing the canvas).
- Confirm each action produces the same outcome as its pointer equivalent — and that the canvas exposes a discoverable focus state so the user knows the keyboard is targeting it.
- Open the tool's keyboard-shortcuts help dialog and confirm zoom/pan bindings are documented, including any non-standard keys.
- Test with a screen reader running to confirm announcements (e.g. 'zoom 150%') update via a live region as the level changes.

**Pass criteria:**
- Zoom in, zoom out, reset zoom, and pan in four directions are each achievable using the keyboard alone.
- The artifact canvas exposes a focused state so the user can tell the keyboard input is targeting it.
- Keyboard bindings for zoom and pan are documented in an in-product shortcuts dialog or help page.
- Zoom level changes are announced (live region or focusable status) so non-sighted users know the current state.

**Fail examples:**
- Zoom is bound only to Ctrl+scroll-wheel and pinch gestures; keyboard users have no way to zoom past the default 100%.
- Pan is implemented exclusively as click-and-drag on the canvas; arrow keys do nothing when the canvas has focus.
- Pressing + zooms in but there is no zoom-out keybinding, only the on-screen '−' button — which is unreachable by Tab because the canvas viewport intercepts focus.
- Zoom shortcuts exist but are not documented anywhere in the product, so keyboard users have no way to discover them.
- Canvas accepts focus but has no visible focus indicator, so keyboard users cannot tell whether arrow keys will pan or scroll the page.

**References:**
- [WCAG 2.1.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/keyboard)

### Annotation placement mode does not trap keyboard focus — Escape exits and restores prior focus

- **ID:** `2.1.2-annotation-mode-no-trap`
- **WCAG 2.1.2** No Keyboard Trap (Level A)
- **Tags:** `keyboard`, `focus`, `annotations`

Annotation placement is a modal-ish state: arrow keys are repurposed to move a placement cursor, Enter commits the pin, and ordinary Tab behavior is often suppressed so focus does not wander off the canvas mid-placement. That repurposing is fine, but it must include a documented escape route. Users who enter placement mode by accident, change their mind, or cannot complete the placement (because the target is off-screen, or because they activated the mode while intending to do something else) need a way out. Escape must exit placement mode without committing a pin and must restore focus to the control that opened the mode.

**How to test:**
- Activate 'Add annotation' from the toolbar so placement mode begins and a placement cursor appears on the canvas.
- Press Escape and confirm placement mode exits, no pin is created, and focus returns to the 'Add annotation' toolbar button that opened the mode.
- Re-enter placement mode and try alternate exits: pressing Tab should not be silently swallowed forever — at minimum, Tab inside placement mode should either advance to a documented next stop or be explicitly intercepted with a visible indicator that Escape is the exit.
- Confirm a screen reader announces the placement-mode entry and the Escape behavior (e.g. 'Placement mode active, press Escape to cancel').
- Open the keyboard-shortcuts help and confirm Escape-to-exit is documented for placement mode.

**Pass criteria:**
- Escape exits annotation placement mode without committing a pin.
- Focus is restored to the control that opened placement mode (typically the 'Add annotation' button).
- Placement mode is documented in the keyboard-shortcuts help, including the Escape exit.
- The mode entry and exit are announced to assistive technology, not signaled only by visual cursor changes.

**Fail examples:**
- Pressing Escape inside placement mode does nothing; the user must press Enter to commit an unwanted pin, then delete it.
- Escape exits placement mode but focus is dumped onto document.body, forcing the keyboard user to Tab from the top of the page back to where they were.
- Tab is silently swallowed during placement mode with no visible indicator and no documented exit; switch-control users assume the tool has frozen.
- Placement mode entry is announced but the Escape behavior is not, so screen-reader users have no way to learn how to leave.
- Escape closes the entire review panel instead of just the placement mode, destroying the user's context.

**References:**
- [WCAG 2.1.2 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap)

### Expanded thread modals do not trap focus — Escape closes them and restores focus to the originating marker

- **ID:** `2.1.2-modal-thread-no-trap`
- **WCAG 2.1.2** No Keyboard Trap (Level A)
- **Tags:** `keyboard`, `focus`, `threads`

Some review tools open the full thread for an annotation in a modal overlay — typically when the side panel would be too narrow or when the user clicks a pin directly on the canvas. The modal correctly traps focus while open (keeping Tab inside its replies, action buttons, and composer), but the failure mode is forgetting an exit: Escape does nothing, the close button is pointer-only, or focus on close lands somewhere arbitrary instead of returning to the pin that opened the modal. Keyboard users are then either stuck inside the modal or dropped at the top of the document, losing their place in the review.

**How to test:**
- Tab to an annotation pin on the canvas and press Enter to open its expanded thread modal.
- Confirm focus moves into the modal (typically to the first reply or to the composer), that the modal traps focus while open (Tab cycles through the modal's controls and back), and that the rest of the page is inert.
- Press Escape and confirm the modal closes immediately and focus returns to the pin that opened it — not to document.body, the toolbar, or a different pin.
- Confirm a visible close (X) button exists, is keyboard reachable inside the modal, has an accessible name ('Close thread'), and produces the same focus-restoration behavior when activated.
- Verify the modal renders with role='dialog' (or 'alertdialog' for destructive flows), an aria-labelledby pointing to the thread's title, and aria-modal='true' so screen readers treat it correctly.

**Pass criteria:**
- Escape closes the expanded thread modal immediately, without committing any in-progress draft or destroying unsaved input silently.
- Focus on close returns to the annotation pin that opened the modal.
- A keyboard-reachable close button exists inside the modal with an accessible name.
- The modal uses role='dialog' (or 'alertdialog'), aria-modal='true', and an aria-labelledby that points to a meaningful thread title.

**Fail examples:**
- Escape inside the thread modal does nothing; keyboard users must Tab to the close X — which is also missing an accessible name.
- Modal closes on Escape but focus lands on document.body, forcing the user to Tab from the very top of the page back to the pin.
- Close X is rendered as a <div> with a click handler and no role='button', so screen readers do not announce it and keyboard users cannot reach it.
- Modal traps focus correctly but there is no Escape, no close button, and no other exit — the only way out is to click outside the modal, which keyboard users cannot do.
- Focus returns to the toolbar's 'Add annotation' button instead of the pin that opened the modal, destroying the user's spatial context.

**References:**
- [WCAG 2.1.2 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap)

### Single-character shortcuts can be disabled, remapped, or are scoped to the canvas so they do not fire while typing in comments

- **ID:** `2.1.4-shortcut-collisions`
- **WCAG 2.1.4** Character Key Shortcuts (Level A)
- **Tags:** `keyboard`

Design-review tools love single-character shortcuts: 'c' to comment, 'r' to reply, 'a' to add annotation, 'e' to edit, 'g' for go-to-version. Power users love them; speech-input users and users who occasionally bump a key on a stuck keyboard hate them, because typing the letter 'c' inside a comment textarea can trigger a global 'create comment' action that loses their draft. WCAG 2.1.4 requires single-character shortcuts to be disable-able, remappable, or active only when the relevant component has focus. The acceptable design-review pattern is to scope shortcuts to the canvas: 'c' fires the action only when the canvas has focus, never while a text input or contenteditable is focused.

**How to test:**
- Open the tool's keyboard-shortcuts help and list every single-character shortcut (typically a/c/r/e/g/n/v and similar).
- Confirm at least one of the following is true: the user can disable single-character shortcuts globally in settings, remap each shortcut to a multi-key combination, or the shortcuts are scoped to fire only when the canvas (not a textarea or contenteditable) has focus.
- Focus a comment composer textarea and type each single-character shortcut letter; confirm the typed letters appear in the textarea and the global action does NOT fire.
- Focus an @mention typeahead and confirm typing letters filters the typeahead rather than triggering a global shortcut.
- Verify shortcut scoping is documented in the help so users with speech-input or motor disabilities can predict behavior.

**Pass criteria:**
- Single-character shortcuts either can be disabled globally, can be remapped, or are scoped to fire only when the canvas (and not a text input, textarea, or contenteditable) has focus.
- Typing within a comment composer, an @mention typeahead, or any other text input never fires a global single-character shortcut.
- Shortcut scoping or disable/remap controls are documented in the keyboard-shortcuts help.
- Speech-input users (Dragon, Voice Control) can complete a review without accidentally firing shortcuts via dictated text.

**Fail examples:**
- Typing 'r' inside a reply composer at the start of the word 'really' fires the global Reply action, opening a new reply on a different thread and losing the in-progress draft.
- A speech-input user dictating 'create a new annotation here' triggers the 'c' (create), 'a' (add annotation), and 'n' (next) shortcuts mid-sentence.
- Shortcuts are global with no scoping, no setting to disable, and no remap UI; the help page lists eleven single-character shortcuts and offers no way to turn them off.
- Shortcuts are scoped to the canvas but the scoping check is broken on a custom contenteditable comment composer, so single-character shortcuts still fire there.
- Disable-shortcuts setting exists but is buried in an admin-only panel and is not exposed in the user's own preferences.

**References:**
- [WCAG 2.1.4 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts)

### Presence indicators and live cursors do not impose an action time limit that kicks idle viewers out of the review

- **ID:** `2.2.1-realtime-presence-not-time-limited`
- **WCAG 2.2.1** Timing Adjustable (Level A)
- **Tags:** `realtime`

Real-time presence systems sometimes piggyback an 'idle' concept onto active viewing — 'you have been idle 30 seconds, leaving the review session' or 'inactive viewers are removed from the live cursor list after 60 seconds'. For a reviewer who reads slowly, uses a screen reader and needs time to absorb a long thread, or simply pauses to think, this is a time limit on the act of viewing. WCAG 2.2.1 does not permit imposing such limits on a non-real-time activity like reading a design and its comments. Presence and cursor systems may dim or fade an idle indicator visually, but must not eject the viewer from the session, hide content, or block their ability to continue reviewing.

**How to test:**
- Open a review as a viewer (not the host) and remain on the page without interacting for 1 minute, 5 minutes, and 15 minutes.
- Confirm no banner, modal, or toast appears warning that the viewer will be removed due to inactivity, and confirm the user is not actually removed from the session.
- Confirm that thread content, annotations, and the artifact remain visible and interactable throughout — nothing is hidden or blurred due to idleness.
- If the presence system dims the user's own avatar in the presence row after inactivity, confirm that is a purely visual cue and does not block any action.
- Verify settings or documentation explicitly state that viewing is not subject to an idle timeout, distinct from session authentication timeout.

**Pass criteria:**
- Idle viewers are never removed from a live review session due to inactivity alone.
- Content (artifact, threads, annotations) remains fully visible and interactable regardless of how long the viewer has been idle.
- Any 'idle' presence cue is purely cosmetic (dimmed avatar, faded cursor) and does not block actions or hide content.
- Viewing-idle behavior is distinct from authentication-session timeout and is documented as not imposing an action time limit.

**Fail examples:**
- A modal appears after 60 seconds of inactivity reading: 'You've been idle. Click to stay in the session' — clicking is required or the user is ejected and the thread closes.
- Live cursors and presence avatars vanish after 30 seconds of no mouse movement, and a banner reads 'Rejoin to view live updates' — a screen-reader user reading a long thread is silently demoted to a stale snapshot.
- After 2 minutes of inactivity, the artifact canvas is blurred and overlaid with 'Still there?' — blocking the very content the user was trying to read slowly.
- Presence system kicks idle viewers to the dashboard after 5 minutes; cognitively disabled reviewer loses scroll position, draft, and context.

**References:**
- [WCAG 2.2.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable)

### Authenticated review sessions warn before timeout and let the reviewer extend without losing an in-progress comment draft

- **ID:** `2.2.1-session-timeout-warning`
- **WCAG 2.2.1** Timing Adjustable (Level A)
- **Tags:** `workflow-state`

Design-review sessions are long: a reviewer can spend twenty minutes drafting a careful comment that explains a missed edge case, only to have an idle-timeout kick them out mid-paragraph and discard the draft. Users with cognitive disabilities, motor disabilities, or anyone who reads slowly are disproportionately punished by silent timeouts. WCAG 2.2.1 requires that any time limit either be adjustable, extendable, or removable. The acceptable pattern: warn the user before the session expires, give them at least 20 seconds (preferably more) to extend, and guarantee that in-progress drafts in the comment composer survive a session refresh.

**How to test:**
- Sign into the review tool, open a thread, and begin typing a multi-paragraph comment in the composer without submitting it.
- Let the session sit idle until it approaches its configured timeout (or shorten the timeout in a staging environment to make the test tractable).
- Confirm a visible, focusable warning dialog appears at least 20 seconds before the session would terminate, announcing the remaining time and offering an 'Extend session' action.
- Verify the warning is announced to a screen reader via role='alertdialog' or a live region, not only visually rendered.
- Activate 'Extend session' with the keyboard and confirm the session continues and the in-progress draft is intact, character-for-character.
- If the user ignores the warning and the session does expire, confirm the draft is preserved (in local storage or a server-side draft record) and restored on the next sign-in, not silently discarded.

**Pass criteria:**
- Idle session timeouts surface a warning dialog at least 20 seconds before termination, with a clear 'Extend session' action.
- The warning is exposed to assistive technology (role='alertdialog' or a live region) and is keyboard reachable.
- Extending the session does not destroy in-progress comment drafts, version-compare selections, or other unsaved review state.
- If a session does expire, in-progress drafts are recoverable on next sign-in rather than silently discarded.

**Fail examples:**
- Idle timeout fires after 30 minutes with no warning at all; reviewer returns to find their 400-word draft replaced by a sign-in screen and the draft is gone.
- A warning toast appears 5 seconds before timeout in a bottom corner with no role='alertdialog' and no keyboard focus — screen-reader and keyboard users miss it entirely.
- Extend-session button restores the session but resets the comment composer to empty, discarding the in-progress draft.
- Session expires mid-edit on a thread reply; the user signs back in and the composer is empty with no draft recovery banner.

**References:**
- [WCAG 2.2.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable)

### Remote cursors, typing indicators, and presence animations can be paused or hidden by the viewer

- **ID:** `2.2.2-realtime-cursor-pause`
- **WCAG 2.2.2** Pause, Stop, Hide (Level A)
- **Tags:** `realtime`, `motion`

Live remote cursors that dart across the artifact, 'Patricia is typing…' pulsing dots on every open thread, and presence avatars that bounce when a teammate joins are constant moving content that a viewer did not start and cannot stop. For users with vestibular disorders, attention disabilities, or anyone trying to focus on a single piece of feedback, this motion is disabling. WCAG 2.2.2 requires that any moving, blinking, or auto-updating content that starts automatically, lasts more than 5 seconds, and is presented alongside other content can be paused, stopped, or hidden by the user — without losing access to the underlying review.

**How to test:**
- Open a review with at least two other live participants moving cursors, typing in threads, and joining/leaving so presence animations are actively running.
- Locate a user-facing setting (in tool preferences or a session toolbar control) to pause or hide remote cursors, typing indicators, and presence animations.
- Toggle each control and confirm: remote cursors stop rendering (or freeze in place), typing indicators stop their pulsing animation, and presence-row join/leave animations are suppressed.
- Confirm the underlying information remains available in a static form — e.g. a static presence list, a static 'Patricia is replying' text label — rather than being removed entirely.
- Confirm the setting persists across sessions and is reachable by keyboard with an accessible name.
- Verify that respecting prefers-reduced-motion auto-applies the pause/hide defaults for users who have set that OS preference.

**Pass criteria:**
- The user can pause or hide remote cursors, typing indicators, and presence animations from within the review tool.
- Pausing or hiding does not destroy the underlying information — a static representation remains available.
- The preference persists across sessions and is keyboard reachable with an accessible name.
- prefers-reduced-motion is respected and auto-applies the reduced-motion defaults without requiring per-user opt-in.

**Fail examples:**
- Remote cursors stream across the canvas with no way to disable them; a reviewer with vestibular sensitivity gets motion-sick after 30 seconds and has to close the tab.
- Typing indicators pulse perpetually on every open thread (5+ at once) with no global pause control; an attention-impaired reviewer cannot focus on reading.
- Presence-row avatars bounce and slide when teammates join; the only way to stop the motion is to log out of the session entirely, losing access to the review.
- A 'reduce motion' toggle exists in settings but does not affect live cursors or typing indicators — it only dims static UI transitions.
- prefers-reduced-motion is ignored entirely; users who set the OS preference still see full cursor and presence animation by default.

**References:**
- [WCAG 2.2.2 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide)

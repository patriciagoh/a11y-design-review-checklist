# a11y-design-review-checklist

> Generated from `checklist.json`. Do not edit by hand.
> Version 1.0.0 · WCAG 2.2 AA · Released 2026-05-28T00:00:00Z

Total items: 87

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

### Presence pulses, save flashes, notification badges, and live cursors never flash more than three times per second and avoid large-area flashes entirely

- **ID:** `2.3.1-realtime-flash-threshold`
- **WCAG 2.3.1** Three Flashes or Below Threshold (Level A)
- **Tags:** `realtime`, `motion`

Real-time collaboration UI is full of attention-grabbing flashes: a green pulse when a comment saves, a red badge that strobes when an @mention lands, presence avatars that flash on join/leave, and the cursor halo that pings to draw attention to a teammate's pointer. Any of these can trigger photosensitive seizures if they flash more than three times in any one-second window, especially when the flashing area is large (more than ~25% of the viewport) or contains saturated red. WCAG 2.3.1 requires that no content flashes more than three times in any one-second period, and large-area flashes should be avoided altogether for collaboration indicators — a single fade-in or one-shot animation is fine, a strobing pulse is not.

**How to test:**
- Trigger each real-time indicator deliberately and record video at 60fps (browser-based screen recorder or DevTools performance recording): comment save flash, @mention badge update, presence avatar join/leave, live cursor 'ping' attention animation, and any 'reconnected' or 'new version available' banner pulse.
- Count discrete flashes per second from the recording for each indicator and confirm none exceeds three flashes in any one-second window.
- Measure the flashing area as a percentage of viewport: indicators larger than ~25% of viewport (full-screen banners, full-canvas overlays) must not flash at all — a single fade-in is allowed; a repeating pulse is not.
- Inspect CSS keyframes / JS animation drivers for any infinite-iteration animations on collaboration indicators and confirm none produce >3 flashes per second.
- If saturated red (#FF0000-range) is used in any flash, confirm the flash count stays well below the threshold and consider switching the color, since saturated red flashes are the highest-risk trigger.
- Verify prefers-reduced-motion suppresses the animation entirely on these indicators, defaulting to a static state change.

**Pass criteria:**
- No real-time collaboration indicator (save flash, @mention badge, presence join/leave, live cursor ping, reconnection banner) flashes more than three times in any one-second window.
- Large-area indicators (>25% of viewport) do not flash repeatedly — they may fade in or animate once but not strobe.
- Saturated-red flashes are avoided entirely on collaboration indicators, or kept far below the flash threshold and small in area.
- prefers-reduced-motion suppresses these animations and degrades them to a static state change.
- Designer / engineer documentation calls out the three-flash limit as a hard constraint for any new real-time indicator.

**Fail examples:**
- Comment save flash uses a green-to-white pulse that runs five times in 800ms; a photosensitive reviewer triggers a migraine on every comment submit.
- @mention badge strobes red (#FF2D2D) at 5Hz when a new mention arrives and continues until the user clicks it — strobe rate exceeds the threshold and uses high-risk saturated red.
- Presence avatar bounce-pulses six times rapidly when a teammate joins; with eight teammates joining within a minute the presence row flashes 48 times.
- Live cursor 'ping' attention animation (a teammate clicks 'point at this') triggers a full-canvas red ripple that flashes four times across roughly half the viewport — large-area, multi-flash, high-risk.
- Reconnection banner spans the full top of the viewport and flashes yellow three to four times per second until the connection restores; on a flaky network this strobes continuously.
- prefers-reduced-motion is ignored on collaboration indicators, so users who set the OS preference still get full-frequency flashes.

**References:**
- [WCAG 2.3.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold)

### A skip mechanism lets keyboard users bypass the artifact canvas and jump straight to the thread panel

- **ID:** `2.4.1-skip-to-thread-panel`
- **WCAG 2.4.1** Bypass Blocks (Level A)
- **Tags:** `keyboard`, `navigation`, `threads`

The artifact canvas in a design review tool is a heavy interactive surface — focusable pins, region handles, zoom controls, layer toggles. A keyboard or switch user who arrives on the page and just wants to read the conversation must currently tab through every pin and every canvas affordance before reaching the thread panel. A 'Skip to threads' link revealed on focus at the top of the page, or a clearly labeled <nav>/<aside> landmark, lets them jump directly into the conversation without traversing dozens of canvas controls.

**How to test:**
- Load a review with at least five annotation pins on the artifact and several open threads.
- Press Tab once from a fresh page load and confirm a 'Skip to threads' (or equivalent) link becomes visible and focusable before any canvas control.
- Activate the skip link with Enter and confirm focus moves into the thread panel — onto a focusable element, not just scrolled into view.
- Alternatively, confirm the thread panel is wrapped in a labeled landmark (e.g. <aside aria-label='Threads'> or <section role='region' aria-labelledby='threads-heading'>) reachable via screen-reader landmark navigation (VoiceOver rotor, NVDA D key).
- Confirm the skip target is reachable without first being forced to tab through every pin, toolbar button, or zoom control.

**Pass criteria:**
- A 'Skip to threads' link (or equivalent skip mechanism) is the first focusable element on the page after browser chrome.
- Activating the skip link moves focus into the thread panel, not just scrolls the viewport.
- The thread panel is exposed as a named landmark so assistive technology users can also jump to it via landmark navigation.
- Keyboard users can reach the thread panel without traversing the entire canvas tab order.

**Fail examples:**
- Tabbing from a fresh load lands on the first pin on the canvas; no skip link exists and the thread panel is only reachable after 30+ tab stops.
- A skip link is in the DOM but is sr-only and never becomes visible on focus, so sighted keyboard users do not know it exists.
- Activating the skip link scrolls the thread panel into view but leaves focus on the link, so the next Tab still goes back into the canvas tab order.
- Thread panel is a plain <div> with no landmark role and no skip target; screen-reader landmark navigation skips past it entirely.

**References:**
- [WCAG 2.4.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks)

### A skip mechanism exists for the version history sidebar so keyboard users can bypass the canvas to reach versions

- **ID:** `2.4.1-skip-to-version-history`
- **WCAG 2.4.1** Bypass Blocks (Level A)
- **Tags:** `keyboard`, `navigation`, `versioning`

The version history sidebar — often a vertical column of version cards on the right — is a primary navigation surface for reviewers comparing changes across drafts. A keyboard user trying to switch from 'v3' to 'v5' must currently tab through every annotation pin and canvas control to reach it. Either a 'Skip to version history' link revealed on focus, or a labeled <nav>/<aside> landmark exposing the version list, must let keyboard and assistive-tech users jump directly to versions without traversing the entire canvas.

**How to test:**
- Load a review with multiple versions in history (at least four) and several annotations on the canvas.
- Press Tab from a fresh page load and confirm a 'Skip to version history' link (alongside or in the same skip-links group as the thread skip link) becomes visible and focusable early in the tab order.
- Activate the link with Enter and confirm focus moves into the version history sidebar — onto the first or current version entry, not just scrolled into view.
- Alternatively, confirm the version sidebar is wrapped in a labeled landmark (e.g. <nav aria-label='Version history'>) and reachable via landmark navigation in screen readers.
- Confirm the version sidebar is reachable without first traversing every pin and toolbar control.

**Pass criteria:**
- A 'Skip to version history' link (or equivalent skip mechanism) appears in the skip-links group and is focusable early in the tab order.
- Activating the skip moves keyboard focus into the version sidebar onto a focusable version entry, not just scrolls the panel into view.
- The version sidebar is exposed as a named landmark (e.g. <nav aria-label='Version history'>) so screen-reader landmark navigation can also reach it.
- Reaching versions does not require tabbing through every annotation pin or canvas control first.

**Fail examples:**
- The only way to reach the version sidebar with a keyboard is to tab through 40 canvas controls; no skip link or landmark exists.
- A skip-to-versions link exists in the DOM but is hidden permanently with display:none and never becomes focusable.
- Version sidebar is a <div class='versions'> with no role; screen-reader landmark navigation passes over it with no announcement.
- Skip link scrolls the sidebar into view but leaves focus on the skip link, so the next Tab returns to the canvas.

**References:**
- [WCAG 2.4.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks)

### Focused annotation pins are not fully obscured by overlay UI such as toolbars, comment cards, or presence avatars

- **ID:** `2.4.11-pin-focus-not-obscured`
- **WCAG 2.4.11** Focus Not Obscured (Minimum) (Level AA)
- **Tags:** `focus`, `annotations`

New in WCAG 2.2, this criterion requires that when an element takes focus, the focus indicator is not entirely hidden by other content. Design-review canvases are dense with overlays: floating toolbars docked to the viewport edge, comment cards that pop up over the artifact when a thread opens, presence avatars and live cursors drifting across the surface, and sticky version-compare panels. Any of these can drift on top of a focused pin and fully cover its focus ring. A keyboard user pressing Tab who cannot see where focus landed has no way to recover — they must blindly press arrow keys or Enter and hope. The focus indicator on a focused pin must remain at least partially visible at all times.

**How to test:**
- Place several annotation pins on the artifact such that some sit near the toolbar, near the comment-card drop position, and near the edges where presence avatars typically appear.
- Tab to a pin near the bottom-right corner where a floating toolbar usually docks; confirm the focused pin's focus indicator remains at least partially visible.
- Open a thread by activating a pin, then Tab back onto the originally focused pin while the comment card is open over the artifact; confirm the focused pin's focus indicator is not fully covered by the comment card.
- Simulate other reviewers' presence avatars or live cursors drifting near focused pins; confirm focus indicators are not fully obscured.
- If overlays may obscure focused pins, confirm the page auto-scrolls or repositions overlays so the focus indicator stays visible — the indicator must be at least partially visible, not fully hidden behind static or moving overlays.

**Pass criteria:**
- When an annotation pin receives focus, its focus indicator is not fully obscured by overlay UI (toolbars, comment cards, presence avatars, version-compare panels, live cursors).
- If an overlay would otherwise cover a focused pin, the page scrolls, the overlay repositions, or the pin moves so at least part of the focus indicator remains visible.
- The focus indicator stays partially visible even when other reviewers' live presence (avatars, cursors) drifts near the focused pin.
- This applies to all overlay layers in the review tool — both static (toolbar, comment card) and dynamic (presence, cursors, real-time notifications).

**Fail examples:**
- Tabbing to a pin near the bottom-right of the canvas places focus under the docked floating toolbar; the focus ring is entirely hidden behind the toolbar and the keyboard user has no idea where focus is.
- Opening a thread renders a comment card that floats over the artifact and fully covers the focused pin's focus indicator; tabbing forward and back leaves the user lost.
- A teammate's live cursor with name-tag flag drifts over the currently focused pin and fully covers the focus ring with no auto-scroll or reposition.
- Version-compare side panel slides in from the right and covers any pin focused near the right edge of the canvas; the focus ring is fully obscured until the panel is dismissed.
- A 'new comment' real-time notification toast appears at the top-right corner and covers the focus ring on any pin focused in that region.

**References:**
- [WCAG 2.4.11 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum)

### Browser tab title identifies the artifact and current version, not just the product name

- **ID:** `2.4.2-artifact-page-title`
- **WCAG 2.4.2** Page Titled (Level A)
- **Tags:** `navigation`, `versioning`

Reviewers routinely keep multiple review tabs open simultaneously — 'Hero Banner v3', 'Hero Banner v4', 'Checkout flow v2' — and rely on the browser tab title to switch between them. A generic title like 'Design Review' or the product name is useless when five reviews are open. Screen-reader users navigating tabs and window-switching keyboard users depend on the <title> element being specific: it must include the artifact name and current version (e.g. 'Hero Banner v3 — Design Review'), and update when the user switches versions.

**How to test:**
- Open three different artifacts in three browser tabs and inspect each tab's title.
- Confirm each title includes the artifact name AND the current version (e.g. 'Hero Banner v3 — Design Review'), not just 'Design Review' or the product name.
- Switch versions within a single review and confirm the <title> updates to reflect the new version (e.g. v3 → v4).
- Navigate tabs using Cmd+1 / Ctrl+Tab with a screen reader running and confirm each tab announces with the artifact-specific title.
- Verify the title pattern is consistent across review states (draft, in review, approved) — the artifact name and version remain identifiable even when state changes.

**Pass criteria:**
- Every review page's <title> includes the artifact name and the current version label.
- The title updates dynamically when the user switches versions within the same review.
- Tab titles are distinct between concurrently open reviews — no two open reviews share the same title.
- The product name is at most a secondary component of the title, not its sole content.

**Fail examples:**
- All review tabs show 'Design Review' as the browser tab title; switching between five open reviews requires hovering each tab to see the URL.
- Tab title is the artifact name only — switching from v3 to v5 does not update the title, so two tabs of the same artifact are indistinguishable.
- Title is the raw artifact UUID ('Review · a8f3b2c1-…') with no human-readable name.
- Title is set once at initial load and never updates; a screen-reader user switching versions has no audible confirmation that the page now represents a different version.

**References:**
- [WCAG 2.4.2 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/page-titled)

### Keyboard focus through annotation threads follows the visual order of pins on the artifact, not DOM insertion order

- **ID:** `2.4.3-thread-focus-order`
- **WCAG 2.4.3** Focus Order (Level A)
- **Tags:** `keyboard`, `focus`, `threads`, `annotations`

Annotation pins are placed at meaningful visual positions on the artifact — top-of-header, mid-CTA, bottom-of-footer — and sighted reviewers read them in that spatial order. The DOM insertion order, however, typically reflects creation time: the order reviewers added pins, which can be arbitrary. If keyboard focus traverses pins in DOM insertion order instead of visual top-to-bottom / left-to-right anchor order, a keyboard user lands on the footer pin, then the header pin, then a mid-canvas pin — the conversation flow makes no sense. Tab order must be derived from anchor position so it matches what a sighted user perceives.

**How to test:**
- Create at least six annotations across an artifact in a non-sequential order: place pin A at the bottom, then pin B at the top, then pin C in the middle, etc.
- Tab through the canvas with a keyboard and record the visit order; confirm focus moves top-to-bottom, left-to-right by visual anchor position — not in creation order.
- Delete a middle pin and add a new one near the top; confirm focus order updates so the new top-positioned pin is visited early, not last.
- Inspect DOM: the order can be achieved either by sorting the DOM by anchor coordinates or via tabindex management — confirm the visible focus order matches visual spatial order regardless of approach.
- Verify the same spatial order applies when the user enters the canvas from a 'Skip to canvas' link or from the thread panel via a 'Show on canvas' action.

**Pass criteria:**
- Keyboard tab order through annotation pins matches the visual top-to-bottom, left-to-right order of pin anchors on the artifact.
- Focus order updates when pins are added, deleted, or moved so it always reflects current visual position.
- The same spatial order applies whether the user enters the canvas via Tab traversal, a skip link, or a 'Show on canvas' action from the thread panel.
- DOM insertion / creation order does not leak into keyboard focus order.

**Fail examples:**
- Reviewer created pins in this order: footer, header, CTA, sidebar. Tabbing visits them in that creation order, so keyboard users read footer → header → CTA → sidebar instead of header → CTA → sidebar → footer.
- Pins are rendered as absolutely-positioned siblings in DOM creation order with no tabindex management; focus order is creation order, not spatial order.
- When a new pin is added at the top of the artifact, it is appended at the end of the DOM and visited last in tab order despite being visually first.
- Tab order matches creation order in one direction (Tab) but reverse-creation order with Shift+Tab — neither matches visual position.

**References:**
- [WCAG 2.4.3 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/focus-order)

### Workflow toolbar focus order is predictable and stable across sessions, roles, and viewport sizes

- **ID:** `2.4.3-workflow-toolbar-focus-order`
- **WCAG 2.4.3** Focus Order (Level A)
- **Tags:** `keyboard`, `focus`, `workflow-state`

The workflow toolbar (Approve, Request changes, Comment, Reject, Resolve) is the most-used surface in a review tool. Reviewers build muscle memory: 'Approve is the third tab stop in the toolbar.' If the focus order shifts because actions reorder based on role (an admin sees different controls than an external reviewer), or because the toolbar collapses on narrow viewports into a menu, or because the user's recent-actions sort scrambles button order, keyboard users lose their place. Focus order through workflow actions must be stable and predictable across sessions, viewport changes, and role variations.

**How to test:**
- Open the workflow toolbar at a wide viewport and tab through it; record the focus visit order.
- Resize the viewport to a narrow width that collapses some actions into an overflow menu; tab through and confirm the relative order of remaining actions matches the wide-viewport order — Approve still comes before Reject, not after.
- Sign in as different roles (designer, reviewer, external guest) and confirm the actions each role can see appear in the same relative order — controls are hidden, not reordered.
- Reload the page and tab through again; confirm focus order is identical to the previous session, with no 'recent action first' reordering.
- Inspect DOM: confirm the toolbar uses a stable child order driven by a fixed action sequence, not a dynamic sort.

**Pass criteria:**
- Workflow toolbar focus order is the same across sessions for a given user.
- When actions collapse into an overflow menu on narrow viewports, the relative order of remaining actions is unchanged.
- When some actions are hidden by role, the relative order of visible actions matches their order for other roles — actions are removed, not reordered.
- No 'recent actions first' or dynamic sort scrambles toolbar order between sessions.

**Fail examples:**
- On a wide viewport the order is Approve / Request changes / Comment / Reject; on a narrow viewport the order becomes Comment / Approve / Reject (Request changes collapsed) — relative order has shifted.
- Admin sees Approve / Reject / Override; external reviewer sees Reject / Comment — the same Reject button is in a different relative position, breaking muscle memory for users switching contexts.
- Toolbar reorders so the user's most-recently-clicked action is first; keyboard users tab through a different sequence each session.
- Approve and Reject swap positions between desktop and tablet layouts, so a reviewer using both devices loses their tab-stop memory.

**References:**
- [WCAG 2.4.3 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/focus-order)

### User @mentions in comments expose the mentioned user's name as the accessible link text

- **ID:** `2.4.4-mention-link-purpose`
- **WCAG 2.4.4** Link Purpose (In Context) (Level A)
- **Tags:** `threads`, `name-role-value`

When a reviewer mentions a teammate in a comment — '@patricia can you confirm?' — the mention is typically a styled chip that links to the user's profile or filters threads by that user. If the chip's accessible name is just '@u123', the raw user ID, or only conveys a color (the teammate's avatar hue) with no name, screen-reader users hear 'link, u123' or 'link, colored chip' and have no idea who was mentioned. The accessible name of every mention link must be the mentioned user's display name, exposed via the chip's text content, aria-label, or aria-labelledby.

**How to test:**
- Post a comment containing @mentions of at least three different users with different display names and avatar colors.
- Tab to each mention chip and confirm the screen reader announces 'link, [display name]' — e.g. 'link, Patricia Goh' — not 'link, u123' or 'link, chip'.
- Inspect each mention element in DevTools: the accessible name should be the user's display name, exposed via visible text, aria-label, or aria-labelledby pointing at a labeled element.
- Confirm the same chip's accessible name does not rely solely on a colored avatar or the @ symbol — the name itself must be present.
- Verify that mentions in different surfaces (in a parent comment, in a reply, in a notification preview) consistently expose the display name.

**Pass criteria:**
- Every @mention link's accessible name is the mentioned user's display name.
- User IDs, raw handles without context, or color-only chips are never the sole accessible name.
- The display name is exposed via visible text content, aria-label, or aria-labelledby.
- Mentions in all surfaces (comments, replies, notification previews) follow the same naming pattern.

**Fail examples:**
- Mention chip renders as a colored pill containing the avatar only; the linked element's accessible name is the raw user ID 'u_a8f3b2'.
- Mention chip has visible text '@p' (first initial only) and no aria-label expanding it to the full name; screen-reader users hear 'link, at p'.
- Mention is conveyed only by the user's avatar color and an @ glyph; the linked element has no text and no aria-label.
- Mention chips in the comment body show display names, but in notification previews they collapse to '@user' with no name — accessible name varies by surface.

**References:**
- [WCAG 2.4.4 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context)

### Links to specific versions in thread comments expose the version label, author, and date — not an opaque ID

- **ID:** `2.4.4-version-link-purpose`
- **WCAG 2.4.4** Link Purpose (In Context) (Level A)
- **Tags:** `versioning`, `name-role-value`

Reviewers routinely reference previous versions in a thread — 'this was approved in v3, see [link]' — and the tool typically converts the version reference into a link chip. If that chip's accessible name is an opaque internal ID ('version_a8f3b2c1') or just 'v3' with no surrounding context, screen-reader users skimming a thread's links list have no way to tell which version is which. The link's accessible name should include the version label (v3), the author, and the date — 'v3 by Alex on May 12' — so a user reviewing a list of links knows where each one leads.

**How to test:**
- Post comments that reference multiple different versions of the artifact via the version-link picker (e.g. v2, v3, v5).
- Tab to each version link and confirm the screen reader announces 'link, v3 by Alex on May 12' (or equivalent — label, author, date), not 'link, v3' or 'link, version_a8f3b2'.
- Open the screen reader's links list (VoiceOver rotor → Links, or NVDA Insert+F7) and confirm each version link is uniquely identifiable from the list without needing surrounding sentence context.
- Inspect DevTools: the link's accessible name should include version label, author, and date — via visible text, aria-label, or aria-labelledby.
- Confirm raw version IDs or UUIDs never appear as the accessible name.

**Pass criteria:**
- Every version link's accessible name includes the version label, author, and date.
- Raw IDs or UUIDs never appear as the accessible name of a version link.
- Each version link is distinguishable in a screen reader's links list without needing surrounding sentence context.
- The naming pattern is consistent across comments, replies, and version-change activity log entries.

**Fail examples:**
- Thread comment renders '[v3]' as a link with accessible name 'v3'; if a thread mentions five different versions, the screen-reader links list reads 'v3, v3, v3, v3, v3' with no way to tell them apart.
- Version link's accessible name is the internal UUID 'version_a8f3b2c1d4e5'; screen-reader user hears a string of unintelligible characters.
- Visible link text is 'see here' with no version label; aria-label is also 'see here' or empty.
- Activity-log entries link to versions with no author or date in the accessible name — only 'Reverted to v2' — so a user cannot tell which v2 across history is meant.

**References:**
- [WCAG 2.4.4 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context)

### A specific annotation can be located by at least two of: spatial canvas click, thread list, or filter/search

- **ID:** `2.4.5-multiple-ways`
- **WCAG 2.4.5** Multiple Ways (Level AA)
- **Tags:** `navigation`, `annotations`

Annotations are the primary content of a review, and users need to find a specific one for many reasons: a teammate referenced it, they want to re-read their own comment, or they are triaging unresolved threads. Sighted mouse users click directly on the pin. But that single mechanism fails users who can't see the pin (blind), can't aim a mouse at it precisely (motor disabilities), or are looking for a thread they remember by content, not by location. The tool must offer at least two distinct ways to find a specific annotation: the spatial click, a thread list (sidebar with all threads), and/or a filter/search by content, author, status, or date.

**How to test:**
- Open a review with at least 15 annotations across the artifact and confirm at least two distinct mechanisms are available to find a specific one.
- Mechanism 1 — spatial: click directly on the pin on the canvas and confirm the corresponding thread opens.
- Mechanism 2 — thread list: open the sidebar that lists all threads, navigate to a specific entry, and confirm activating it opens the same thread.
- Mechanism 3 (where present) — filter/search: enter a search query for comment content, filter by author, or filter by resolved/unresolved status; confirm matching threads appear and can be activated.
- Confirm at least two of the three mechanisms are usable with keyboard alone and exposed to assistive technology.
- Verify the sidebar list is not just a visual representation of pins — it must be a fully usable, focusable alternative path to each annotation.

**Pass criteria:**
- At least two distinct mechanisms exist to find a specific annotation (spatial click, thread list, filter/search).
- All available mechanisms are keyboard reachable and exposed to assistive technology.
- The thread list is fully interactive — activating an entry opens the thread, not just scrolls the canvas.
- Filter/search (where present) operates on comment content, author, status, or date — not only on internal IDs.

**Fail examples:**
- The only way to open a thread is to click directly on its pin on the canvas; the sidebar shows pins as a visual minimap but entries are not activatable.
- A thread list exists but is read-only — entries display the comment text without being focusable or actionable.
- Search and filter controls exist but only filter the dashboard list of artifacts, not annotations within a single review.
- Annotation list is reachable but lacks keyboard activation — entries respond to mouse click only, blocking keyboard and switch users.

**References:**
- [WCAG 2.4.5 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/multiple-ways)

### Thread headings describe the conversation topic, not a sequential thread number

- **ID:** `2.4.6-thread-headings-descriptive`
- **WCAG 2.4.6** Headings and Labels (Level AA)
- **Tags:** `threads`, `name-role-value`

When the thread panel or sidebar uses headings to identify each thread, generic labels like 'Thread 17' or 'Annotation #4' give a screen-reader user navigating by heading no information about which conversation they are about to enter. Heading text should describe the thread's topic — typically the first comment's summary, the anchored region's name, or the annotation's title — so a user scanning headings in a screen reader can quickly find the conversation they want. 'Thread 17' is a sequential ID, not a description.

**How to test:**
- Open a review with at least eight threads covering different topics (a logo color discussion, a CTA copy debate, a broken error state, etc.).
- Inspect the heading element for each thread (h2 or h3) and confirm the text describes the topic or summarizes the first comment — e.g. 'Logo color contrast on hero — Patricia, 3 replies' — not 'Thread 17' or 'Annotation #4'.
- Use a screen reader to navigate by heading (VoiceOver rotor → Headings, NVDA H key) and confirm each heading conveys what the thread is about without requiring the user to enter it.
- Confirm the heading text does not collapse to a sequential ID when threads are sorted or filtered.
- Verify the same descriptive heading appears consistently in the thread panel and any thread summary surfaces (e.g. notifications, daily digest).

**Pass criteria:**
- Thread headings describe the conversation topic, summarize the first comment, or name the anchored region — not a sequential thread number.
- Headings remain descriptive across sort orders, filters, and view modes.
- Screen-reader heading navigation surfaces meaningful, distinguishable text for each thread.
- The same descriptive heading appears in notifications and digests, not a generic 'Thread #' fallback.

**Fail examples:**
- Thread panel renders each thread under an <h3>Thread 17</h3>; screen-reader heading list reads 'Thread 14, Thread 15, Thread 16, Thread 17' with no topic context.
- Headings are auto-generated as 'Annotation #4' from the annotation's internal index and never reflect the comment content.
- Heading is the timestamp ('May 12 at 2:14pm') with no topic; multiple threads from the same minute have indistinguishable headings.
- First-comment summary exists in the body but the visible heading is the raw author display ('@patricia') with no topic — every thread by Patricia has the same heading.

**References:**
- [WCAG 2.4.6 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels)

### The artifact canvas shows a clear focus indicator when it itself takes focus for keyboard pan and zoom

- **ID:** `2.4.7-canvas-focus-visible`
- **WCAG 2.4.7** Focus Visible (Level AA)
- **Tags:** `focus`, `zoom-pan`

Many review tools support keyboard pan and zoom of the artifact canvas — arrow keys to pan, +/- to zoom — but those interactions require the canvas region itself to take focus first. If the canvas accepts focus but shows no visible indicator that it has done so, keyboard users cannot tell that arrow keys will now pan rather than scroll the page. The canvas frame (a border, outline ring, or labeled focus halo around the canvas viewport) must show a clearly visible focus indicator whenever the canvas itself takes focus.

**How to test:**
- Tab through the page until focus lands on the artifact canvas region (typically the focusable container that handles arrow-key pan).
- Confirm a visible focus indicator appears on the canvas frame — a border or outline ring around the canvas viewport that is clearly distinguishable from the resting state.
- Press arrow keys and confirm the canvas pans (or zooms with +/-), verifying that the focus indicator correctly signals 'keyboard input now affects the canvas'.
- Tab focus away and confirm the canvas focus indicator disappears.
- Verify the canvas focus indicator meets 3:1 contrast against adjacent colors (per 1.4.11) and is preserved in forced-colors mode.

**Pass criteria:**
- When the canvas region takes focus, a clearly visible focus indicator appears on the canvas frame.
- The focus indicator is distinct from the canvas resting state and from any selected-pin or hover indicators inside the canvas.
- Focus indicator meets 3:1 contrast against adjacent colors and survives forced-colors mode.
- Focus indicator disappears when focus moves elsewhere.

**Fail examples:**
- Canvas accepts focus and arrow-key pan works, but no visible indicator appears; keyboard users press arrow keys and the page scrolls instead because they did not realize the canvas had focus.
- Canvas focus uses outline:none with no replacement; focus on the canvas is entirely invisible.
- Focus indicator is a 1px light-gray border that disappears against the tool's light-gray chrome surround.
- Canvas focus indicator looks identical to the hover state of a pin inside the canvas, confusing users about whether canvas or a pin has focus.

**References:**
- [WCAG 2.4.7 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible)

### Focused annotation pins show a focus indicator visually distinct from hover and selected states

- **ID:** `2.4.7-pin-focus-visible`
- **WCAG 2.4.7** Focus Visible (Level AA)
- **Tags:** `focus`, `annotations`

Annotation pins commonly carry three distinct visual states: hover (mouse hover preview), selected (the pin whose thread is currently open), and focus (the pin the keyboard is currently on). Tools frequently collapse focus into the hover or selected styling, leaving keyboard users unable to tell where their focus actually is — particularly when they have hovered or selected a different pin. The keyboard focus indicator must be visually distinct from both hover and selected: typically a high-contrast outline ring or halo that does not overlap with the hover or selected styling.

**How to test:**
- Tab through the canvas pins with a keyboard and observe the visual treatment of the currently focused pin.
- Mouse-hover a different pin without changing keyboard focus and confirm the hover style is visually different from the focus style.
- Click on a third pin to select its thread, then return keyboard focus to the originally focused pin via Tab and confirm focus, hover, and selected states are all visually distinguishable.
- Compare all three states side by side: focus indicator must be visually distinct in shape, color, thickness, or position from hover and selected — not just a slightly different shade.
- Confirm the focus indicator meets contrast requirements (3:1 against adjacent colors per 1.4.11) and does not vanish in forced-colors mode.

**Pass criteria:**
- Focused annotation pins show a focus indicator that is visually distinct from hover and selected states.
- All three states (focus, hover, selected) are simultaneously distinguishable when applied to different pins on the canvas.
- The focus indicator persists for the duration that keyboard focus is on the pin — not briefly flashed or animated away.
- Focus indicator survives forced-colors mode and meets 3:1 contrast against adjacent colors.

**Fail examples:**
- Focused pin gets a 2px blue outline that is identical to the hover style; a keyboard user who mouses over a different pin cannot tell which pin actually has focus.
- Focus styling is the same as selected styling, so once a thread is open the focused pin and the selected pin are visually indistinguishable.
- Focus indicator is a subtle drop-shadow only; on a busy gradient artifact background the shadow is invisible.
- Pin focus relies entirely on the browser's default outline:auto which the tool then overrides with outline:none — focus is invisible.

**References:**
- [WCAG 2.4.7 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible)

### Multi-touch zoom and pan gestures on the canvas have single-pointer alternatives

- **ID:** `2.5.1-multi-finger-zoom-alternative`
- **WCAG 2.5.1** Pointer Gestures (Level A)
- **Tags:** `zoom-pan`

Design-review canvases lean heavily on multi-touch gestures — pinch to zoom, two-finger swipe to pan, three-finger tap to fit — because that's how Figma, Sketch, and InVision trained users to navigate. But anyone using a single switch, a head-pointer, a mouth-stick, or a stylus on a small touch surface cannot perform a coordinated two-finger pinch. Every gesture that controls zoom or pan must have an equivalent single-pointer path: visible zoom-in/zoom-out buttons, +/− keyboard shortcuts, or scroll-with-modifier — so the canvas is fully navigable without ever needing two fingers at once.

**How to test:**
- Open a review with the artifact canvas and identify every multi-touch gesture the tool advertises (pinch-zoom, two-finger pan, three-finger fit, rotate).
- Disable multi-touch input (use a mouse, a single-finger touch, or a switch device) and try to reach each zoom level and pan position using only single-pointer controls.
- Confirm visible on-canvas controls exist for zoom-in, zoom-out, fit-to-screen, and 100% — and that pan is achievable via scrollbars, drag with a single pointer, or arrow-key navigation.
- Verify with a keyboard alone that +/−/0 (or equivalent) reach the same zoom states the pinch gesture reaches.
- Check that no canvas operation is gated behind a path-based gesture (e.g. drawing a freehand selection) without a click-sequence alternative.

**Pass criteria:**
- Every multi-touch gesture for zoom, pan, fit, and rotate has a single-pointer equivalent that is visible on the canvas or reachable via keyboard.
- Zoom-in, zoom-out, fit-to-screen, and 100% are all reachable without performing a pinch or multi-finger gesture.
- Pan is achievable with one pointer (single-finger drag, scrollbar, or arrow keys) — not only via two-finger swipe.
- No canvas function is exclusively bound to a multipoint or path-based gesture.

**Fail examples:**
- Canvas only zooms via pinch — there are no visible +/− buttons and no keyboard shortcut, so a single-pointer user is stuck at 100%.
- Pan requires a two-finger swipe on touch and middle-click-drag on desktop; a user with a single-button switch device has no way to pan.
- Three-finger tap is the only way to fit-to-screen; users who cannot coordinate three fingers cannot recover from a zoomed-in state.
- Rotate-artifact is bound only to a two-finger twist gesture with no menu item or keyboard shortcut.

**References:**
- [WCAG 2.5.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures)

### Region and rectangle annotations can be placed without a continuous drag gesture

- **ID:** `2.5.1-region-annotation-single-pointer`
- **WCAG 2.5.1** Pointer Gestures (Level A)
- **Tags:** `annotations`

Region annotations — the rectangles reviewers draw around 'this whole section of the header' — are typically placed via a drag from one corner to the opposite corner. That drag is a path-based gesture: a user who cannot hold-and-move (single-switch users, users with tremor, head-pointer users) cannot complete it. The tool must offer a single-pointer alternative: click to set the first corner, click again to set the opposite corner, or place a default-sized region first and then resize via discrete handle clicks.

**How to test:**
- Select the region/rectangle annotation tool and attempt to place an annotation using only discrete clicks (no drag).
- Confirm the tool offers a click-to-anchor / click-to-set-opposite-corner flow, OR it places a default-sized region on first click and exposes resize handles that can each be clicked to a new position without a continuous drag.
- Try the same flow on touch with a single tap-tap sequence and on keyboard with arrow keys to position the corners.
- Verify that no region-annotation creation path requires a held-down pointer moving along a continuous path.

**Pass criteria:**
- Region annotations can be placed via a discrete click-click sequence (anchor corner, then opposite corner) or by placing a default region and resizing via handle clicks or keyboard arrows.
- No region-annotation creation flow requires a continuous drag from one point to another.
- The single-pointer alternative is documented in the tool's keyboard / accessibility shortcuts list or is discoverable in the annotation toolbar.

**Fail examples:**
- Region annotation can ONLY be created by mousedown-drag-mouseup; releasing the pointer mid-drag cancels the annotation and there is no click-click alternative.
- Touch users must hold and drag with one finger across the canvas with no tap-tap-to-place fallback.
- Resize handles on a placed region require drag — they cannot be moved via arrow keys or click-to-target.
- The tooltip on the region tool reads 'click and drag to create' with no alternative offered to users who cannot drag.

**References:**
- [WCAG 2.5.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures)

### Annotation placement can be aborted before commit by moving off-target or pressing Escape

- **ID:** `2.5.2-annotation-place-cancellable`
- **WCAG 2.5.2** Pointer Cancellation (Level A)
- **Tags:** `annotations`

When a reviewer starts placing an annotation and realizes mid-gesture that they're about to drop a pin in the wrong place — wrong frame, wrong artifact, wrong region — they need to be able to back out without creating noise the whole team has to clean up. The down-event must not commit the annotation. Either the up-event fires the creation only when released on a valid target, or pressing Escape during placement cancels cleanly, leaving no orphan pin and no toast notification fired to collaborators.

**How to test:**
- Select the pin tool, press down on a target on the canvas, then drag the pointer off the canvas before releasing — confirm no annotation is created.
- Repeat with the region tool: start a region, then press Escape mid-placement — confirm the in-progress region disappears and no pin/region is committed.
- On touch, start a placement gesture and lift the finger outside the canvas bounds — confirm no annotation is committed.
- Verify no real-time event ('Patricia placed annotation 47') is broadcast to collaborators during an aborted placement.
- Confirm the down-event alone never commits — only the completed up-event on a valid target finalizes the annotation.

**Pass criteria:**
- Pressing down to start an annotation does not commit it; only releasing on a valid target finalizes the annotation.
- Moving the pointer off the canvas (or off the valid drop target) before release aborts the placement with no side effects.
- Pressing Escape during placement cancels the in-progress annotation, removes any ghost preview, and broadcasts no real-time event.
- No collaborator notification, server-side write, or undo-history entry is created for an aborted placement.

**Fail examples:**
- Pin commits on pointerdown — releasing outside the canvas or pressing Escape still leaves a pin at the click location.
- Region annotation commits on the first click of a click-click sequence with no way to abort before the second click.
- Aborted pin placement still broadcasts a 'Patricia is placing an annotation' presence event that flashes on every collaborator's screen.
- Escape during placement clears the visual preview but the annotation still saves to the server and appears after a refresh.

**References:**
- [WCAG 2.5.2 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation)

### Pin accessible names start with the visible number or label so voice control can target them

- **ID:** `2.5.3-pin-accessible-name-matches`
- **WCAG 2.5.3** Label in Name (Level A)
- **Tags:** `annotations`, `name-role-value`

Annotation pins typically show a visible number ('3', '12') or short label so reviewers can reference them in conversation ('see pin 3'). Voice-control users (Dragon, Voice Control on macOS/iOS) say what they see — 'click pin three' — and the underlying accessible name must start with that visible label for the voice command to match. If the visible label is '3' but the accessible name is 'Annotation by Patricia on header, unresolved, 2 replies', the voice command fails and the user cannot activate the pin by speaking what they see.

**How to test:**
- Inspect several pins with visible numeric or text labels and read their accessible names (DevTools accessibility tree, or screen-reader announcement).
- Confirm each accessible name begins with the visible label string — e.g. visible '3' → accessible name 'Pin 3, by Patricia on header logo, unresolved'.
- Use Voice Control (macOS) or Dragon to say 'click pin three' (or whatever the visible label reads) and confirm the correct pin activates.
- Repeat for pins with non-numeric visible labels (e.g. initials, status icons with text).

**Pass criteria:**
- Every pin's accessible name begins with the visible text label exactly as a sighted user reads it.
- Voice-control commands that say the visible label ('click pin three') successfully activate the matching pin.
- Additional context (author, target, status) appears after the visible label in the accessible name, not before it.
- The visible label text is not paraphrased, translated, or replaced in the accessible name (e.g. '3' is not rewritten as 'third').

**Fail examples:**
- Pin shows '3' visibly but accessible name is 'Annotation by Patricia, header logo, 2 replies, unresolved' — voice command 'click pin three' does not match.
- Pin label visible as 'PG' (initials) but accessible name reads 'Patricia Goh annotation on header' — voice 'click P G' fails.
- Visible label '12' is rewritten in the accessible name as 'annotation twelve' — voice 'click twelve' does not match.
- Pin accessible name is just the raw ID ('annotation_a8f3b2') and the visible number is rendered via a background-image so it is not in the accessible name at all.

**References:**
- [WCAG 2.5.3 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name)

### Workflow action buttons expose accessible names beginning with their visible label

- **ID:** `2.5.3-workflow-button-name-matches`
- **WCAG 2.5.3** Label in Name (Level A)
- **Tags:** `workflow-state`, `name-role-value`

The Approve, Request Changes, Reject, and Submit buttons drive the review workflow — these are the highest-stakes controls in the entire UI. Voice-control users must be able to invoke them by saying what they see ('click Approve', 'click Request Changes'). If the visible label is 'Approve' but the accessible name is 'Submit approval decision for version 4 of homepage redesign', the voice command 'click Approve' fails and the user cannot drive the workflow without keyboard or pointer.

**How to test:**
- List every workflow-state control in the review tool (Approve, Request Changes, Reject, Submit, Reopen, Resolve, Archive).
- For each, inspect the accessible name in DevTools or via screen reader and confirm it begins with the visible button text.
- Use Voice Control or Dragon to say 'click <visible label>' for each button and confirm the correct action fires.
- Verify that buttons with icon + text (e.g. checkmark + 'Approve') do not prepend the icon role into the accessible name ('check mark, Approve…').
- If a workflow button shows different visible text per role (e.g. 'Approve' for approvers, 'Acknowledge' for viewers), confirm each variant's accessible name matches its visible label.

**Pass criteria:**
- Every workflow action button has an accessible name that begins with the visible label text.
- Voice-control commands using the visible label activate the matching workflow button.
- Additional context (artifact name, version, role) appears after the visible label, not before it.
- Icon-decorations are not announced ahead of the visible text in the accessible name.

**Fail examples:**
- Visible button reads 'Approve' but accessible name is 'Submit final approval for version 4' — 'click Approve' fails in Voice Control.
- Request Changes button has aria-label='Send change request to design team' — voice command 'click Request Changes' does not match.
- Approve button uses an icon font with aria-label='check, Approve homepage v4' — the leading 'check' breaks voice 'click Approve'.
- Resolve thread button visible as 'Resolve' has accessible name 'Mark thread as resolved and archive' — voice 'click Resolve' does not fire.

**References:**
- [WCAG 2.5.3 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name)

### Device motion never the only path to pan, rotate, or undo on the artifact

- **ID:** `2.5.4-no-motion-actuated-pan`
- **WCAG 2.5.4** Motion Actuation (Level A)
- **Tags:** `motion`, `zoom-pan`

Mobile and tablet design-review apps sometimes bind device-motion gestures to canvas operations — tilt the tablet to pan the artifact, shake to undo an annotation. These are inaccessible to users who hold their device in a mount, who have tremor, who cannot reliably move their device through space, or who have disabled motion in OS settings. Every motion-actuated operation must have an equivalent UI control (button, menu item, keyboard shortcut), and users must be able to disable the motion binding entirely.

**How to test:**
- On a tablet or phone build, list every device-motion gesture (tilt-to-pan, shake-to-undo, rotate-device-to-rotate-canvas).
- For each, confirm an equivalent on-screen control exists — pan buttons, an Undo button or menu item, a rotate control in the toolbar.
- Open settings and verify a 'disable motion gestures' toggle exists; enable it and confirm motion no longer triggers canvas operations.
- Place the device flat on a table (no motion possible) and confirm full canvas functionality remains via on-screen controls.
- Verify the OS-level 'reduce motion' preference also suppresses motion-actuated behaviors in the app.

**Pass criteria:**
- No canvas operation (pan, rotate, zoom, undo, redo) is exclusively triggered by device motion.
- Every motion-actuated gesture has an equivalent on-screen control reachable by touch and keyboard.
- Users can disable motion actuation entirely in app settings, and the app also respects the OS reduce-motion preference.
- The app remains fully functional when the device is held stationary in a mount.

**Fail examples:**
- Shake-to-undo is the only path to undo the last annotation on tablet — there is no on-screen Undo button.
- Tilt-to-pan is enabled by default with no setting to disable it; users with tremor pan unintentionally and cannot opt out.
- Rotate the device 90° to rotate the artifact is the only rotate control — users who use the tablet in a fixed mount cannot rotate.
- Motion actuation respects no OS or in-app preference and fires continuously when the device is moved at all.

**References:**
- [WCAG 2.5.4 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/motion-actuation)

### Drag-to-place and drag-to-reorder annotations have non-drag alternatives

- **ID:** `2.5.7-annotation-drag-alternative`
- **WCAG 2.5.7** Dragging Movements (Level AA)
- **Tags:** `annotations`

WCAG 2.2 adds 2.5.7 Dragging Movements: any operation that uses a drag must have a non-drag alternative. In a design-review tool, drags are everywhere — drag a pin to reposition it, drag a region's handle to resize, drag-and-drop comments in a sidebar to reorder, drag an annotation onto a different layer. Each must have a non-drag path: click-then-click to reposition, arrow keys to nudge, a 'move to' menu, a 'reorder' affordance with up/down buttons. Users with tremor, with single-pointer setups, on switch devices, or with limited dexterity cannot reliably drag.

**How to test:**
- Catalog every drag interaction in the annotation system: drag-to-place, drag-to-reposition pin, drag-to-resize region, drag-to-reorder in sidebar, drag-to-reassign-layer.
- For each, attempt the same outcome without dragging — keyboard arrows to nudge a focused pin, a 'Reposition' menu that takes click-target, up/down buttons in the sidebar list, a 'Move to layer…' menu.
- Test with a single-finger tap only on touch and with keyboard only on desktop — every annotation operation must complete.
- Verify the non-drag alternative is discoverable: it appears in a context menu, toolbar, or documented keyboard shortcut — not hidden behind dev-only flags.
- Confirm precision: the non-drag alternative supports the same range and granularity as the drag (e.g. 1px nudge with arrows, 10px with Shift+arrow).

**Pass criteria:**
- Every drag interaction on annotations has a non-drag alternative (click-sequence, keyboard, or menu-based).
- Non-drag alternatives are discoverable via context menu, toolbar, or keyboard-shortcut help.
- Non-drag alternatives support equivalent precision and range to the drag (fine and coarse movement).
- Keyboard alternatives include both nudge (arrow) and jump (Shift/PageUp/PageDown) modes where the drag supports both.

**Fail examples:**
- Annotation pins can only be moved by drag — focusing a pin and pressing arrow keys does nothing and there is no 'Move to…' menu.
- Sidebar comment reorder is drag-and-drop only; there are no up/down buttons and no keyboard reorder shortcut.
- Region handles support drag-to-resize but no keyboard or click-target resize; users who can't drag cannot adjust region size after creation.
- A 'Reposition' menu item exists but only opens a coordinate text input with no live preview — precision is worse than drag and there's no equivalent nudge mode.

**References:**
- [WCAG 2.5.7 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements)

### Version-compare slider supports click-to-position and text-input alternatives to dragging

- **ID:** `2.5.7-version-drag-compare-alternative`
- **WCAG 2.5.7** Dragging Movements (Level AA)
- **Tags:** `versioning`

WCAG 2.2's 2.5.7 also covers the version-compare slider — that 'before / after' divider you drag across the artifact to reveal version A under version B. Users who can't drag cannot operate it as designed. The slider must accept click-anywhere-on-track to jump the divider to that position, support keyboard left/right and Home/End, and offer a text input or stepper for the exact percentage. Drag is the affordance for precision; non-drag alternatives must match its expressiveness.

**How to test:**
- Open the version-compare view between two versions of the artifact and locate the swipe / slider divider.
- Try clicking once anywhere on the track (not on the handle) and confirm the divider jumps to the clicked position.
- Focus the divider with keyboard and use Left/Right arrows to nudge, Home/End to jump to 0% and 100%; confirm both work.
- Look for a numeric input or percentage stepper that lets the user set an exact position (e.g. 37%); confirm it updates the divider.
- Verify on touch that a single tap on the track repositions the divider without requiring a swipe gesture.

**Pass criteria:**
- The version-compare divider can be repositioned by single click or tap anywhere on the track, not only by dragging the handle.
- Keyboard arrows nudge the divider; Home/End jump to extremes; the divider has a clear focus indicator.
- A numeric input or stepper supports exact-percentage positioning, matching the drag's precision.
- Touch users can tap-to-position without performing a swipe.

**Fail examples:**
- Version-compare slider only responds to drag on the handle — clicking elsewhere on the track does nothing.
- Slider divider is keyboard-focusable but arrow keys do not move it; only mouse drag works.
- There is no text or stepper input for an exact position — users who can't drag cannot reach 50% precisely.
- On touch, a tap on the track is ignored; only a horizontal swipe gesture moves the divider.

**References:**
- [WCAG 2.5.7 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements)

### Annotation pin hit targets are at least 24x24 CSS pixels or meet the spacing exception

- **ID:** `2.5.8-annotation-pin-target-size`
- **WCAG 2.5.8** Target Size (Minimum) (Level AA)
- **Tags:** `target-size`, `annotations`

WCAG 2.2 adds 2.5.8 Target Size (Minimum) at AA: pointer targets must be at least 24x24 CSS pixels, or have enough spacing around them that a 24x24 circle around the target center does not intersect any other target. Annotation pins are notoriously small — 16x16 dots, 20x20 numbered circles — because designers want them visually unobtrusive. But on a dense canvas with adjacent pins they become impossible to hit with a trackpad on a tablet or with a tremor-affected finger. Pins must either grow to 24x24 (the hit target, not just the visual dot), or sit far enough apart that the 24x24 spacing exception is satisfied.

**How to test:**
- Measure several annotation pins on the canvas at default zoom (100%) — both the visible dot/circle and the pointer hit-target via DevTools (inspect bounding box).
- Confirm the pointer hit target is at least 24x24 CSS pixels, OR confirm that the distance between any two pin centers is large enough that a 24-pixel diameter circle around each center does not touch the next pin's hit box.
- Place a cluster of pins close together (a dense thread region) and verify hit-targets still satisfy size or spacing.
- Test on a touch device: try tapping each pin in a cluster and confirm you can reliably hit a single pin without zooming the canvas.
- If pins shrink at lower zoom levels, verify they still meet the 24-pixel rule (or scale up the hit target while keeping the visible pin small).

**Pass criteria:**
- Every annotation pin's pointer target is at least 24x24 CSS pixels, OR the spacing exception is satisfied (24-pixel circle around the target center does not intersect any other target).
- Hit targets stay at least 24x24 across the default and lower zoom ranges; visible pin appearance may be smaller, but the hit area meets the threshold.
- In dense pin clusters, spacing or size is sufficient that users can reliably target an individual pin without pixel-precise pointing.
- Decorative pin shrinking (e.g. when zoomed out) does not shrink the hit-target below 24x24.

**Fail examples:**
- Pins render as 16x16 dots with hit targets equal to the visual size; users with tremor consistently miss them on a trackpad.
- Pin visual is 24x24 but the actual <button> hit-target is set to 18x18 via padding-box CSS — measured hit area is below the threshold.
- Cluster of 5 pins at 18x18 each, spaced 4 pixels apart — neither the size nor the spacing exception is met.
- At 50% zoom the pin hit area shrinks to 12x12, well below 24x24, even though the on-canvas pin is still rendered as a 24-pixel SVG.

**References:**
- [WCAG 2.5.8 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)

### Reply, resolve, edit, delete, and reaction targets on threads are at least 24x24 CSS pixels

- **ID:** `2.5.8-thread-action-target-size`
- **WCAG 2.5.8** Target Size (Minimum) (Level AA)
- **Tags:** `target-size`, `threads`

Thread comment cards bristle with small action buttons — reply, resolve, edit, delete, the emoji reaction picker, the overflow menu kebab. These are typically icon-only 16x16 or 20x20 buttons squeezed into a dense card layout. Under WCAG 2.2's 2.5.8 (AA, new in 2.2), each must hit at least 24x24 CSS pixels or satisfy the spacing exception. A reviewer with limited dexterity, on a tablet with a finger, or on a small viewport must be able to resolve a thread or delete their own comment without mis-tapping its neighbor.

**How to test:**
- Open a thread with multiple comments and identify every interactive control on a comment card: reply, resolve, edit, delete, react, overflow menu.
- Inspect each in DevTools and confirm the pointer hit target is at least 24x24 CSS pixels, OR adjacent controls have enough whitespace that the 24-pixel spacing exception applies.
- Test on a touch device: try to resolve a thread, then delete a comment, then add a reaction — confirm each can be tapped without hitting an adjacent control.
- Inspect emoji reaction targets specifically (often 16x16 each in a row); confirm each emoji button meets size or spacing.
- Verify the overflow / kebab menu target itself meets 24x24, not just the items inside the menu.

**Pass criteria:**
- Every interactive target on a thread comment card (reply, resolve, edit, delete, react, overflow) is at least 24x24 CSS pixels, or satisfies the 24-pixel spacing exception.
- Emoji reaction buttons individually meet 24x24 or have enough spacing between them that the exception applies.
- Touch users can hit any single action on a comment card without inadvertently triggering an adjacent action.
- Hit targets are not reduced below 24x24 at responsive breakpoints or on dense layouts.

**Fail examples:**
- Comment card kebab menu is 16x16 with 2-pixel padding to the adjacent reply button — neither size nor spacing exception is met.
- Emoji reaction row shows 8 emojis at 18x18 each, packed tight — touch users routinely tap the wrong emoji.
- Resolve and delete sit side-by-side at 20x20 with 1-pixel gap; a misfired tap deletes a comment when the user meant to resolve.
- At narrow viewport the comment-card action bar collapses target sizes to 16x16 to fit horizontally instead of stacking vertically.

**References:**
- [WCAG 2.5.8 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)

## Understandable

### The review tool declares the page's primary human language on the <html> element

- **ID:** `3.1.1-document-language`
- **WCAG 3.1.1** Language of Page (Level A)
- **Tags:** `language`

Screen readers, browser translation engines, and language-aware spellcheck all key off the page's lang attribute. A design-review tool without a lang declaration on <html> leaves a screen reader guessing — JAWS may read English content with a French voice, VoiceOver may mispronounce reviewer names and UI strings, and Google Translate may translate-into the very language the page already uses. The primary language of the review tool's UI shell must be declared on <html lang="..."> so assistive tech and language tools render the right voice, prosody, and hyphenation from the moment the page loads.

**How to test:**
- View source on the review tool's main artifact page and confirm <html> has a lang attribute set to a valid BCP 47 language tag (e.g. lang="en", lang="en-US", lang="ja").
- Confirm the declared language matches the actual primary language of the UI chrome — not a stale default like lang="en" on a tool whose UI has been localized to Japanese.
- Load the tool with VoiceOver / NVDA and confirm the chosen voice matches the declared language (an English voice for an English UI, not a fallback robotic voice).
- If the tool supports UI locale switching, confirm the lang attribute updates when the user changes locale — not pinned to the user's first-session value.
- Run axe DevTools and confirm the 'html-has-lang' and 'html-lang-valid' rules pass.

**Pass criteria:**
- <html> carries a valid lang attribute with a BCP 47 language tag.
- The declared lang matches the primary language of the UI chrome currently being rendered.
- Switching UI locale updates the lang attribute to the new locale.
- axe DevTools reports no violations on 'html-has-lang' or 'html-lang-valid'.

**Fail examples:**
- Main review page renders <html> with no lang attribute; VoiceOver falls back to the system default voice and mispronounces every reviewer name.
- UI is fully localized into Japanese but <html lang="en"> persists because the locale switcher only swaps strings, not the document language.
- lang="english" — not a valid BCP 47 tag; assistive tech treats it as unknown.
- <html lang=""> (empty string) shipped on a production build, silently failing axe and breaking screen-reader pronunciation.

**References:**
- [WCAG 3.1.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/language-of-page)

### Comments authored in a language different from the page declare that language on the comment element

- **ID:** `3.1.2-comment-language-tagging`
- **WCAG 3.1.2** Language of Parts (Level AA)
- **Tags:** `language`, `threads`

Cross-team design reviews routinely mix languages — a reviewer in Tokyo replies in Japanese to a thread on an English-defaulting tool, a contractor in São Paulo drops a Portuguese clarification into an otherwise-English review. If the page-level lang is 'en' and the Japanese reply has no lang attribute of its own, a screen reader pronounces the Japanese characters with an English voice and produces unintelligible output. The comment renderer must either detect or let the author declare the comment's language and emit a corresponding lang attribute on the comment element — and must never assert a language it cannot verify.

**How to test:**
- On a tool whose page-level lang is 'en', post a reply containing Japanese (or any non-English script) and inspect the rendered comment element.
- Confirm the comment element (or the text node wrapping its body) carries a lang attribute matching the comment's actual language (e.g. lang="ja").
- Read the comment with VoiceOver / NVDA and confirm the voice switches to the appropriate language pronunciation, not the page default.
- If the tool does not auto-detect comment language, confirm the composer offers an explicit language picker — and that picking a language updates the lang attribute on the posted comment.
- Verify the tool does not assert an incorrect lang (e.g. defaulting every comment to lang="en" regardless of content), which is worse than declaring nothing.
- Confirm @mentions, code blocks, and quoted prior comments preserve the lang attribute of the original author, not the current reader's locale.

**Pass criteria:**
- Comments containing content in a language different from the page declare that language via a lang attribute on the comment element (or an inner wrapper around the differing text).
- If language tagging is not implemented, the tool does not assert an incorrect lang — it inherits the page lang and the authoring flow does not falsely claim otherwise.
- Screen readers switch pronunciation when reading a comment in a tagged non-default language.
- Quoted text and @mentions preserve the original author's language tag when relevant.

**Fail examples:**
- Page is lang="en"; a Japanese reply renders inside <div class="comment-body"> with no lang attribute, so VoiceOver reads kana with an English voice and produces gibberish.
- Comment composer auto-tags every reply with lang="en" regardless of the typed content; a Portuguese comment is asserted to be English and mispronounced confidently.
- Tool offers a 'comment language' picker but the value is stored only in metadata and never emitted as an attribute on the rendered comment element.
- Quoted prior comment in Japanese loses its original lang attribute when re-rendered inside an English-language reply, so the quote is read with an English voice.

**References:**
- [WCAG 3.1.2 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts)

### Focusing a thread row, annotation pin, or version-history entry does not auto-navigate or open a modal

- **ID:** `3.2.1-focus-no-context-change`
- **WCAG 3.2.1** On Focus (Level A)
- **Tags:** `focus`

Keyboard users tab through dense lists — thread rows in the sidebar, annotation pins on the canvas, version entries in the history panel — to scan and decide where to engage. If merely focusing a row triggers a context change (auto-loading that thread in the main panel, opening a modal, scrolling the canvas to the pin's location, switching the displayed version), the user is jolted out of their scan position on every Tab keypress and effectively cannot survey their options. Focus must move silently; only explicit activation (Enter, Space, click) may change context.

**How to test:**
- Tab through the thread sidebar list and confirm focusing a row does not open the thread in the main panel, scroll the artifact, or open a modal.
- Tab through annotation pins on the canvas and confirm focus alone does not pan/zoom the canvas, expand the pin's thread, or trigger any popover beyond a non-intrusive focus ring.
- Tab through version-history entries and confirm focus does not load the version into the canvas — only Enter/Space/click does.
- Verify the same when navigating with screen-reader virtual cursor (NVDA browse mode, VoiceOver QuickNav) — moving the virtual cursor onto a row must not commit a context change.
- Inspect for onFocus / onMouseEnter handlers that mutate route state, open dialogs, or call history.push — these are the classic 3.2.1 violations.

**Pass criteria:**
- Tabbing to a thread row, annotation pin, or version entry produces only a focus ring and any non-intrusive focus styling — no route change, modal open, canvas pan, or content swap.
- Context changes (open thread, switch version, scroll-to pin) require explicit activation: Enter, Space, or click.
- Screen-reader virtual cursor movement does not trigger any of the above.
- No onFocus handler in the codebase performs navigation, dialog opening, or state-load actions.

**Fail examples:**
- Tabbing onto a thread row in the sidebar immediately replaces the main panel content with that thread; a keyboard user cannot scan to row 7 without loading rows 1–6 along the way.
- Focusing an annotation pin auto-pans and zooms the canvas to that pin's location; a screen-reader user reviewing the list of pins ends up at a new canvas viewport on every arrow keypress.
- Version-history row uses onFocus={() => loadVersion(id)} so tabbing through the list triggers a full canvas reload per entry.
- Focusing the 'Approve' button in a popover opens a confirmation modal before the user has pressed Enter.

**References:**
- [WCAG 3.2.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/on-focus)

### Comment autosave persists silently without navigating, refreshing, or shifting view; status is exposed via an unobtrusive indicator

- **ID:** `3.2.2-comment-autosave-no-surprise`
- **WCAG 3.2.2** On Input (Level A)
- **Tags:** `forms`, `threads`

Many review tools autosave draft comments as the user types so a refresh or accidental tab close does not lose the in-progress reply. Autosave is a 3.2.2 risk when it produces a context change — re-rendering the thread (and stealing focus), scrolling the panel to refresh the draft list, opening a 'Saved!' modal, or briefly disabling the composer. The autosave action itself must not navigate, refresh, or change context; its status (saving / saved / failed) must be available via a polite, non-focus-stealing indicator that does not interrupt typing.

**How to test:**
- Open the comment composer, type several sentences, and pause periodically to allow autosave to fire.
- Confirm autosave does not steal focus from the composer (focus must remain in the textarea / contenteditable through every save).
- Confirm autosave does not scroll the thread panel, re-render the parent thread, open a modal, or briefly disable the composer.
- Verify the autosave status indicator ('Saving…', 'Saved', 'Save failed') updates in a live region (aria-live="polite") that does not interrupt the user's typing and does not steal focus on each update.
- Trigger a save failure (offline, throttled network) and confirm the failure state is announced via the same polite mechanism, with a clearly labeled retry action — not a blocking modal that yanks focus.
- Verify autosave does not navigate the URL (e.g. attaching a draft ID to the route) in a way that causes a back-button context change.

**Pass criteria:**
- Autosave does not steal focus, scroll the view, re-render parent containers, or open modals.
- Autosave status is exposed via an unobtrusive live region (aria-live="polite") that does not interrupt typing.
- Failure states are surfaced via the same polite mechanism with a retry affordance — no focus-stealing dialogs.
- Autosave does not mutate the URL or browser history in a way that changes context.
- The user can continue typing through every save cycle without their cursor or selection being disturbed.

**Fail examples:**
- Each autosave re-renders the entire thread panel; the textarea remounts, the user's cursor jumps to the start, and the next keystroke types in the wrong place.
- Autosave success pops a 'Draft saved' toast that grabs keyboard focus, forcing the user to dismiss it before they can continue typing.
- Autosave failure opens a blocking modal 'Could not save your draft. Retry?' that interrupts the user mid-sentence.
- Autosave pushes a new URL ('?draft=abc123') on every save so the browser back button replays a string of phantom states.
- Status indicator updates an aria-live="assertive" region on every save, so screen-reader users hear 'Saving… Saved… Saving… Saved…' constantly as they type.

**References:**
- [WCAG 3.2.2 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/on-input)

### Typing in the comment composer does not trigger workflow transitions or unexpected submission

- **ID:** `3.2.2-input-no-context-change`
- **WCAG 3.2.2** On Input (Level A)
- **Tags:** `forms`, `workflow-state`

The comment composer is the most-used input in a design-review tool, and it is the easiest place to ship a 3.2.2 violation: plain Enter that submits and posts a comment, a slash-command that fires a workflow transition as the user types, an @mention picker that commits the wrong user when focus moves. Sighted, mouse-driven authors rarely notice; keyboard authors and screen-reader users post truncated drafts, fire 'Approve' by accident, or mention the wrong colleague. Plain Enter must insert a newline by default; submission must require an explicit, well-labeled affordance (e.g. Cmd/Ctrl+Enter, a Submit button), and slash-commands or input-as-you-type behaviors must not cause workflow state changes without a confirmation step.

**How to test:**
- Open the comment composer, type two sentences across multiple lines using plain Enter for line breaks, and confirm Enter inserts a newline rather than posting the comment.
- Confirm submission requires an explicit gesture: a labeled Submit button activated by mouse or keyboard, or a documented modifier shortcut (Cmd/Ctrl+Enter) whose hint is visible near the composer.
- Type a slash-command (e.g. '/approve' if supported) and confirm the workflow transition does not execute until the user explicitly confirms — not on the next keystroke or on blur.
- Type an @mention, then blur the composer mid-suggestion; confirm no mention is committed silently against the user's intent.
- Verify autocomplete pickers do not commit on focus change — only on Enter or click after the user has selected the intended option.

**Pass criteria:**
- Plain Enter in the comment composer inserts a newline; it does not submit the comment.
- Submission requires either a labeled Submit button or a documented modifier shortcut whose hint is visible.
- Slash-commands that trigger workflow transitions require an explicit confirmation step before they fire.
- @mention pickers and other autocomplete UI commit only on explicit selection (Enter/click on the desired option), not on blur or focus change.
- No keystroke in the composer causes a context change (navigation, modal open, workflow state mutation) without explicit confirmation.

**Fail examples:**
- Plain Enter in the composer immediately posts whatever has been typed; reviewers ship one-line truncated comments because Shift+Enter is undocumented.
- Typing '/approve' followed by space immediately moves the artifact to Approved with no confirmation; a slip of the finger ships unintended approvals.
- Tabbing out of the composer with an open @mention picker commits the first suggestion as the mention, so a comment intended for Patricia tags Patrick.
- Pressing Enter on the workflow-state dropdown immediately commits the highlighted option without an intermediate confirm.

**References:**
- [WCAG 3.2.2 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/on-input)

### Thread panel filter, sort, search, and show-resolved controls appear in the same order and location across every artifact page

- **ID:** `3.2.3-thread-panel-consistent-nav`
- **WCAG 3.2.3** Consistent Navigation (Level AA)
- **Tags:** `navigation`, `threads`

Reviewers move between dozens of artifacts a day — different files, different boards, different review states. The thread panel they use to triage feedback should not shuffle its filter / sort / search / show-resolved controls between pages. A user with low vision who has built spatial muscle memory for 'Filter is in the top-left of the thread panel' should not have to relearn the layout on a board-style review vs a Figma-style review vs a versioned PDF. The same controls should appear in the same order and the same place across every artifact context the tool supports.

**How to test:**
- Open the same thread-panel controls (filter, sort, search, show-resolved toggle, group-by) on at least three distinct artifact types or page contexts the tool supports — e.g. a single-frame artifact, a multi-frame board, a versioned PDF, a video review.
- Confirm the control set is the same (no missing or extra controls without justification), the order is identical, and the spatial position relative to the thread list is consistent.
- Tab through each panel and confirm keyboard tab order through the controls is identical across artifact contexts.
- Verify that any context-specific controls (e.g. a 'frame' filter only on board views) are clearly differentiated as optional additions, not inserted in a way that shifts the universal controls.
- Confirm screen-reader landmarks and headings around the thread panel are named identically across contexts.

**Pass criteria:**
- Thread panel control set (filter, sort, search, show-resolved, group-by) is the same across all artifact contexts where threads exist.
- The order of these controls is consistent across contexts.
- Spatial position relative to the thread list is consistent.
- Keyboard tab order through the controls is identical across contexts.
- Context-specific additions (if any) are clearly distinguished and do not shift the universal controls.

**Fail examples:**
- Single-frame artifact shows filter / sort / search left-to-right; the board view shows search / filter / sort and adds a 'frame' picker that pushes the show-resolved toggle off-screen.
- Show-resolved toggle is top-right of the thread panel on artifacts but tucked inside an overflow menu on the dashboard view, with no spatial cue that the same control exists.
- Sort dropdown's options reorder between contexts ('Newest first' is default on artifacts but 'Most replied' is default on boards), so users cannot predict where their preferred sort lives.
- Keyboard tab order skips the search input on board views because the input is rendered conditionally below the filter, shifting the entire panel's tab sequence.

**References:**
- [WCAG 3.2.3 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation)

### Workflow actions like Approve and Request Changes carry the same icon, label, and accessible name everywhere they appear

- **ID:** `3.2.4-workflow-buttons-consistent-identity`
- **WCAG 3.2.4** Consistent Identification (Level AA)
- **Tags:** `workflow-state`, `name-role-value`

An 'Approve' action surfaces in several places: the artifact header toolbar, the bulk-action menu on the dashboard, the right-click context menu, the keyboard-shortcut hint card, and the confirmation dialog that fires after activation. If each surface uses a slightly different icon, label, or accessible name — 'Approve' / 'Approve this' / 'Mark approved' / a checkmark with no text — users (especially cognitively disabled users and screen-reader users) cannot recognize they are the same function. Every instance of a workflow action must share one canonical icon, label, and accessible name.

**How to test:**
- List every surface where the Approve, Request Changes, Reject, and Reopen actions appear: toolbar, bulk-action menu, context menu, keyboard-shortcut hint, confirmation dialog, notification, audit log.
- Confirm the visible text label is identical across surfaces (not 'Approve' on the toolbar and 'Mark approved' in the menu).
- Confirm the icon used is the same glyph on every surface — same shape, same orientation — even when sizes differ.
- Inspect each instance in DevTools and confirm the accessible name (aria-label or button text) is identical across surfaces; screen-reader output should match word-for-word.
- Repeat for Request Changes, Reject, and Reopen — each canonical action must be uniquely identified and consistently labeled.

**Pass criteria:**
- Every workflow action uses the same visible text label across all surfaces it appears on.
- Every workflow action uses the same icon glyph across surfaces.
- The accessible name (button text or aria-label) for each action is identical across surfaces.
- Distinct actions are not confusable with each other — Approve and Mark Ready are not represented by the same icon or label.

**Fail examples:**
- Toolbar shows a checkmark button labeled 'Approve'; bulk-action menu shows the same checkmark labeled 'Mark approved'; right-click context menu shows it labeled 'Approve this design'. Screen-reader users hear three different commands.
- Approve icon is a checkmark on the toolbar but a thumbs-up in the confirmation dialog; the visual signal that 'I am confirming the same action' breaks.
- Keyboard shortcut hint card lists 'A — Accept' while the toolbar button reads 'Approve'; users mapping the shortcut do not realize they map the same function.
- Approve uses a checkmark and Mark Ready uses the same checkmark with no other differentiation — two distinct actions are visually identical.

**References:**
- [WCAG 3.2.4 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification)

### Help, keyboard-shortcut, and contact-support entry points appear in the same relative location on every page (WCAG 2.2 new)

- **ID:** `3.2.6-help-consistent-location`
- **WCAG 3.2.6** Consistent Help (Level A)
- **Tags:** `navigation`

WCAG 2.2 added 3.2.6 Consistent Help as a Level A criterion: when a tool provides help mechanisms — a help link, a keyboard-shortcut overlay opened by '?', a contact-support entry, a feedback form — they must appear in the same relative location on every page. In a review tool, help is something users reach for under stress (a reviewer cannot figure out the keyboard shortcut to resolve a thread, an external guest cannot find how to mention a teammate). If help lives in the top-right user menu on the dashboard but moves to a footer link on artifact pages and disappears entirely from the version-compare view, users in a stressed state cannot reliably find it.

**How to test:**
- Inventory every help-related affordance the tool ships: help link, '?' shortcut overlay, contact-support entry, feedback form, docs link.
- Visit each top-level page (dashboard, artifact view, version-compare, settings, guest-review gate) and confirm each help affordance present on one page appears in the same relative location on every other page where it exists.
- Confirm the keyboard shortcut to open the help overlay (typically '?') works on every page and the overlay is reachable in the same way.
- Verify the contact-support / feedback entry is consistently in (e.g.) the user-menu top-right across all surfaces, not scattered between header on some pages and footer on others.
- Repeat the inventory for the external-guest view and confirm guests have the same help entry points in the same relative spots.

**Pass criteria:**
- Every help affordance the tool provides appears in the same relative location on every page where it exists.
- The keyboard shortcut to open help (e.g. '?') works consistently across all pages.
- Contact-support and feedback entries live in one canonical relative location and do not move between pages.
- Guest / external-reviewer surfaces follow the same consistent placement.
- If a help affordance is intentionally omitted from a page, that absence is documented and consistent — not random.

**Fail examples:**
- Help link is in the user-menu top-right on the dashboard but moves to a footer link on the artifact page and disappears from the version-compare view entirely.
- '?' keyboard shortcut opens the help overlay on the dashboard but is bound to a different action on artifact pages.
- Contact-support is reachable from a 'Help' icon in the toolbar on some pages and only via a 'Send feedback' link buried in settings on others.
- Guest-review gate ships no help entry at all even though authenticated views have a prominent help affordance — guests in a stressed state cannot find documentation.

**References:**
- [WCAG 3.2.6 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/consistent-help)

### Comment submission errors name the field and the specific issue in text, not just a red outline

- **ID:** `3.3.1-comment-validation-error-identified`
- **WCAG 3.3.1** Error Identification (Level A)
- **Tags:** `forms`

When a reviewer's comment submission fails — over the length cap, flagged by a profanity filter, missing a required @mention to assign an action, attaching an unsupported file type — the error must be identified in text that names both the field and the specific issue. A red border around the textarea with no accompanying text leaves screen-reader users with no idea why the Submit button bounced their reply. The error must be programmatically associated with the failing input (aria-describedby) and rendered as readable text adjacent to it, so a screen reader announces 'Comment is over the 2000-character limit' rather than silently inheriting an invalid state.

**How to test:**
- Submit a comment that exceeds the length cap and confirm the error text names both the field ('Comment') and the issue ('over 2000 characters').
- Submit a reply missing a required @mention (in tools that require it for action assignment) and confirm the error names the missing requirement, not just 'Invalid'.
- Trigger the profanity / content-policy filter (in tools that have one) and confirm the rejection is explained in text, not via a generic toast.
- Attach an unsupported file type to a comment and verify the error names the field, the disallowed type, and what is allowed.
- Inspect each failing input in DevTools and confirm the error text is wired via aria-describedby (or aria-errormessage) so the screen reader announces it on focus.
- Repeat with a screen reader (VoiceOver / NVDA) and confirm the error is announced — not just visually red.

**Pass criteria:**
- Every submission error names the failing field and the specific issue in human-readable text.
- Error text is programmatically associated with the failing input via aria-describedby or aria-errormessage.
- Failing inputs expose aria-invalid="true" so assistive tech knows the field is in an error state.
- Color is never the sole indicator — a red border without text fails this criterion.
- Screen readers announce the error when the input receives focus.

**Fail examples:**
- Comment textarea gets a red 1px border on over-length submission with no accompanying text; the screen-reader user has no clue why Submit did nothing.
- A generic 'Could not post comment' toast appears for every error reason — the user cannot tell whether the failure was a length issue, a network issue, or a policy issue.
- Profanity filter blocks the comment silently and clears the textarea — the typed content is lost and no error is shown.
- Error text is rendered visually next to the textarea but not wired via aria-describedby, so screen-reader users navigating to the field hear only 'edit, comment' with no error context.

**References:**
- [WCAG 3.3.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/error-identification)

### Failed workflow transitions explain which specific thread(s) or condition(s) block the change

- **ID:** `3.3.1-workflow-transition-error`
- **WCAG 3.3.1** Error Identification (Level A)
- **Tags:** `workflow-state`, `threads`

When a reviewer tries to move an artifact from 'In review' to 'Approved' but the transition is blocked — unresolved blocking threads, missing required approvers, a stale version — the failure message must identify which specific thread(s) or condition(s) block the change, not just 'Cannot approve.' A generic refusal leaves the user hunting through dozens of threads to find the blocker. The error should name each blocking thread by its topic or anchor and, where possible, link to it, so the reviewer can resolve the actual obstacle.

**How to test:**
- Attempt to approve an artifact that has at least one unresolved thread marked 'blocking' and confirm the error names that specific thread (by topic, anchor, or pin number) and links to it.
- Attempt to approve when a required approver has not yet signed off and confirm the error names the missing approver(s) by role or name.
- Attempt to transition to a state that requires a fresh version (e.g. 'Requires changes' → 'Approved' without a re-upload) and confirm the error explains the version requirement.
- Verify that when multiple conditions block the transition, all blockers are listed — not just the first encountered.
- Confirm the error is announced via a live region or programmatically associated with the workflow control so assistive-tech users hear the full reason.

**Pass criteria:**
- Workflow-transition errors name each specific blocker (thread, missing approver, version requirement) rather than a generic 'Cannot approve.'
- Blocking threads are identified by topic, anchor, or pin number — and ideally linked.
- When multiple conditions block, all are surfaced together.
- The error is exposed programmatically to assistive tech (live region announcement or aria-describedby on the workflow button).
- Disabled workflow buttons that fail this way still expose their reason via aria-describedby or an accessible tooltip.

**Fail examples:**
- Clicking 'Approve' shows a toast 'Cannot approve right now' with no explanation — the reviewer has to manually audit every thread to find the blocker.
- The Approve button is disabled with no exposed reason; sighted users see a faint tooltip on hover, keyboard / screen-reader users get nothing.
- The error lists 'Unresolved threads: 3' as a count but does not name the threads, so the reviewer scrolls through 47 comments looking for the blockers.
- Only the first blocker is reported; the reviewer fixes it, retries, hits a second blocker, fixes it, retries, hits a third — a frustrating game of whack-a-mole.

**References:**
- [WCAG 3.3.1 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/error-identification)

### Comment composers carry visible labels and reply targets clarify which thread or comment is being addressed

- **ID:** `3.3.2-comment-field-label`
- **WCAG 3.3.2** Labels or Instructions (Level A)
- **Tags:** `forms`, `threads`, `name-role-value`

Comment composers in review tools are often visually minimal — a placeholder that disappears on focus, no label, no indication of which thread the reply belongs to. WCAG 3.3.2 requires labels or instructions when content needs user input. For threaded reply UIs, the label must also clarify the reply target: a reply 4 levels deep on a long thread needs to make clear (programmatically and visibly) which comment it answers, so a screen-reader user composing from the keyboard knows they are replying to Alice's comment about contrast and not Bob's later remark about copy.

**How to test:**
- Open the top-level comment composer and confirm a visible label is present (or a persistent placeholder PLUS an aria-label / aria-labelledby providing the accessible name).
- Open a reply composer 3+ levels deep on a long thread and confirm the accessible name (and ideally visible text) names the comment being replied to — e.g. 'Reply to Alice: contrast on the CTA looks low'.
- Inspect with DevTools: every comment input has a non-empty accessible name and is not relying solely on a placeholder that vanishes on focus.
- Open the @mention picker and confirm the search input itself has an accessible name ('Search people to mention'), not just an icon.
- Test with a screen reader: navigate by form field and confirm each composer announces both its label AND its reply context.

**Pass criteria:**
- Every comment composer has a visible label or a programmatically-associated accessible name.
- Placeholders are not the sole label (they disappear on focus and are not announced by all AT consistently).
- Reply composers identify the comment / thread being replied to in their accessible name.
- Mention pickers, attachment inputs, and other secondary inputs inside the composer all have accessible names.
- Required-field indicators (e.g. when a mention is required for action assignment) are exposed via aria-required and named in the label.

**Fail examples:**
- Comment textarea has only a placeholder 'Write a comment…' with no <label> and no aria-label; focus puts the cursor in a field with no announced name.
- Reply composer deep in a thread is announced as just 'edit' with no indication of which comment is being replied to.
- @mention picker is a bare icon button labelled only by an @ glyph; screen readers announce 'button, at sign'.
- Composer is a contenteditable <div> with no role or accessible name — screen readers ignore it entirely.
- Required action-assignment field is enforced via JS only; aria-required is missing and the label does not mention the requirement.

**References:**
- [WCAG 3.3.2 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions)

### Submission errors on comments offer concrete fixes (trim to N characters, use @ to mention, switch file format)

- **ID:** `3.3.3-comment-error-suggestion`
- **WCAG 3.3.3** Error Suggestion (Level AA)
- **Tags:** `forms`

Beyond identifying that an error occurred (3.3.1), WCAG 3.3.3 requires that when a fix is known, the system suggests it. For comment composers this means: an over-length error states the current count and the limit ('2147 / 2000 — trim by 147 characters'); a missing-mention error suggests typing '@' to open the picker; an unsupported attachment lists supported formats; a profanity rejection explains the policy and suggests rephrasing. The suggestion must be concrete and actionable, not a vague 'Please try again.'

**How to test:**
- Submit an over-length comment and confirm the error shows both the current count and the limit, plus suggests trimming.
- Submit a comment missing a required @mention and confirm the suggestion names the action ('type @ to mention a teammate').
- Attach an unsupported file type and confirm the error lists the supported types.
- Trigger the content-policy / profanity filter (where present) and confirm the message explains the policy and invites rephrasing rather than rejecting opaquely.
- Verify each suggestion is rendered in text (not only icons) and is programmatically associated with the failing input via aria-describedby.

**Pass criteria:**
- Every fixable submission error includes a concrete, actionable suggestion in text.
- Counts, limits, and supported values are stated explicitly where relevant.
- Suggestions are wired to the input via aria-describedby so screen readers announce them on focus.
- If a suggestion cannot be given safely (e.g. opaque server-side rejection), the system says so honestly rather than offering generic noise.
- Suggestions do not steal focus or disrupt the user's typing — they appear inline near the input.

**Fail examples:**
- Over-length error reads 'Comment too long' with no count and no limit; the user has no idea how much to trim.
- Required-mention error reads 'Missing required field' with no hint about how to add a mention.
- Unsupported attachment is rejected with 'File rejected' and no list of supported formats.
- Profanity filter triggers a generic 'Cannot post' modal — the user cannot tell whether to rephrase, retry, or contact support.
- Suggestions are shown as small grey helper text that is not wired via aria-describedby; screen-reader users never hear them.

**References:**
- [WCAG 3.3.3 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion)

### Irreversible workflow actions require explicit confirmation and clearly state consequences

- **ID:** `3.3.4-irreversible-approval-confirm`
- **WCAG 3.3.4** Error Prevention (Legal, Financial, Data) (Level AA)
- **Tags:** `workflow-state`

Final approval that locks an artifact, archiving a review that removes it from active dashboards, deleting a thread that has replies (destroying the conversation history) — these are irreversible or hard-to-reverse data actions and fall under WCAG 3.3.4's requirement for reviewable, confirmable, or reversible flows. The UI must require an explicit confirmation step (not a single-click destructive action), state the consequences in the confirmation text ('this will lock the artifact and notify all reviewers; new comments will be disabled'), and ideally support a grace-period undo.

**How to test:**
- Trigger final approval and confirm a clear, explicit confirmation step is required (not a single-click 'Approve' that immediately locks).
- Read the confirmation text and confirm it names the consequences — lock, notification, downstream side effects.
- Trigger 'archive review' and confirm the same: explicit confirmation, stated consequences.
- Trigger 'delete thread with N replies' and confirm the confirmation states that N replies will also be destroyed.
- Where possible, confirm a post-action undo / grace-period exists (e.g. 'Approval finalised — undo within 10 seconds').
- Confirm the confirmation dialog is keyboard-accessible, focus-trapped, dismissable with Escape, and announced via role=dialog with an accessible name.

**Pass criteria:**
- Irreversible or hard-to-reverse actions require an explicit confirmation step — never a single accidental click.
- Confirmation text names the specific consequences (lock, notification, deletion of replies, etc.).
- The default focus in the confirmation dialog is on the safer choice (Cancel), or at minimum the destructive action is not auto-focused.
- Where feasible, a post-action undo / grace period is offered.
- Confirmation dialogs are properly accessible (role=dialog, focus trap, Escape to dismiss, accessible name).

**Fail examples:**
- Clicking 'Approve' on the toolbar immediately locks the artifact with no confirmation; an accidental click finalises a review with no recourse.
- Confirmation dialog reads only 'Approve this review?' with no mention that the artifact will be locked, reviewers notified, and comments disabled.
- Deleting a thread with 14 replies pops a confirmation that says only 'Delete?' — the user does not realise all 14 replies will be destroyed.
- Confirmation dialog auto-focuses the destructive 'Approve' button so a stray Enter keypress confirms without the user reading the text.
- No undo / grace period is offered; an approval click made at the wrong moment cannot be reversed.

**References:**
- [WCAG 3.3.4 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data)

### External reviewer name/email is not re-requested within the same session (WCAG 2.2 new)

- **ID:** `3.3.7-redundant-entry-reviewer-info`
- **WCAG 3.3.7** Redundant Entry (Level A)
- **Tags:** `forms`

WCAG 2.2 added 3.3.7 Redundant Entry as a Level A criterion: information the user has already entered in a process must not be requested again in the same process, unless re-entry is essential (e.g. password confirmation). External / guest reviewers commonly enter their name and email on a magic-link gate to start commenting; the tool must not re-prompt them when they navigate back, revisit the link, or switch artifacts inside the same review. Either auto-populate, persist via the magic-link token, or expose a clear 'already identified as <name>' indicator with an explicit edit affordance.

**How to test:**
- Open a guest-review link in an incognito session, enter name and email, and post a comment.
- Navigate to another artifact within the same review (or refresh) and confirm the tool does not re-prompt for name and email.
- Close the tab and reopen the same magic link within its valid lifetime; confirm the identity persists (or is auto-populated) rather than being re-requested.
- Repeat across multiple comment / reply submissions within the session — the identity must not be re-asked between actions.
- Confirm an explicit 'Editing as <name>' indicator and an explicit affordance to change identity (in case the link was shared incorrectly).

**Pass criteria:**
- Once a guest reviewer has provided name / email in a session, the tool does not request the same information again within that session.
- Magic-link tokens persist identity across reloads and tabs for the link's lifetime, unless re-auth is essential.
- Fields that are auto-populated remain editable so the user can correct an entry.
- An explicit 'identified as <name>' affordance is visible so the user knows which identity the tool is using.
- Where re-entry IS essential (e.g. confirming an email change), the tool says so explicitly.

**Fail examples:**
- Every page navigation re-prompts the guest reviewer for name and email; switching between artifacts in the same review pops the identity gate again.
- Refreshing the page wipes the entered identity and forces re-entry, even though the magic-link token is still valid.
- Each reply submission opens a name / email modal; the user re-types their details for every comment.
- Auto-populated fields are read-only with no edit affordance, so a guest who mistyped their email is stuck with the typo for the whole session.
- No indicator shows the current identity, so the guest has no way to verify they are posting as the right person.

**References:**
- [WCAG 3.3.7 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry)

### Reviewer authentication does not require cognitive function tests; supports paste, password managers, and magic links (WCAG 2.2 new)

- **ID:** `3.3.8-accessible-auth-no-cognitive-test`
- **WCAG 3.3.8** Accessible Authentication (Minimum) (Level AA)
- **Tags:** `forms`

WCAG 2.2 added 3.3.8 Accessible Authentication (Minimum) as Level AA: authentication must not require a cognitive function test (memorising a code, transcribing an audio CAPTCHA, solving a puzzle, identifying objects in images) unless an alternative is provided. For review tools this most often means the guest-reviewer auth flow: one-time codes must be pasteable (not blocked from clipboard), password managers must work (no fields that block autofill via autocomplete=off without justification), magic-link auth must be supported as a path of least cognitive load, and any CAPTCHA must offer a non-cognitive alternative.

**How to test:**
- Trigger the guest-reviewer auth flow and confirm a magic-link option is available (no required password / code memorisation).
- If a one-time code is required, confirm the code field accepts paste — try pasting from clipboard and confirm no JS or input restriction blocks it.
- Verify password fields (where used) work with browser password managers and 1Password / Bitwarden / etc. — no autocomplete=off without a documented exception, no JS that interferes with autofill.
- If a CAPTCHA gates auth, confirm it offers a non-cognitive alternative (e.g. invisible verification, biometric, or a known-device skip).
- Confirm audio CAPTCHAs (where present) are not the sole alternative — transcribing audio IS a cognitive function test.
- Test the full guest-review auth flow with a screen reader and keyboard only; confirm there is at least one path that does not require solving a puzzle, transcribing, or memorising.

**Pass criteria:**
- Authentication offers at least one path that does not require a cognitive function test (memorising, transcribing, solving puzzles).
- One-time codes are pasteable from clipboard.
- Password fields support password managers — no autocomplete=off without documented exception, no JS interference with autofill.
- Magic-link auth is offered as a primary or alternative path.
- Any CAPTCHA provides a non-cognitive alternative.
- The accessible auth path is reachable in the standard flow — not hidden behind 'contact support'.

**Fail examples:**
- Guest auth requires solving a 'click all the traffic lights' image CAPTCHA with no alternative.
- One-time code input blocks paste via onpaste=preventDefault, forcing users to type the code character by character.
- Password field sets autocomplete=off, blocking password-manager autofill without justification.
- Auth flow requires the user to memorise a 6-digit code shown on screen then re-enter it on a subsequent page — a textbook cognitive function test.
- The only CAPTCHA alternative is an audio transcription, which is itself a cognitive function test for many users.
- Magic-link is offered only via a 'contact support to enable' workflow, not as a standard option in the auth UI.

**References:**
- [WCAG 3.3.8 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum)

## Robust

### Annotation pins expose role, accessible name, and state (selected, focused, resolved/unresolved) programmatically

- **ID:** `4.1.2-pin-role-name-state`
- **WCAG 4.1.2** Name, Role, Value (Level A)
- **Tags:** `name-role-value`, `annotations`

Annotation pins on a design artifact are interactive controls — they receive focus, can be activated, anchor a thread, and toggle between resolved and unresolved. WCAG 4.1.2 requires that for every UI component the role, accessible name, and current state are programmatically determinable. Pins built as bare <div> elements with click handlers fail this entirely: they have no role, no name, and no state exposed to assistive tech. The correct implementation is a focusable button (or a role=button element) with an accessible name describing what it annotates ('Pin 3, on the primary CTA button'), and ARIA states for selected (aria-pressed or aria-current), focused (native focus), and resolved/unresolved (aria-label includes the state, or an aria-describedby points to a status text).

**How to test:**
- Inspect a pin element in DevTools and confirm it has role=button (or is a native <button>) and is focusable (tabindex=0 or native).
- Confirm the accessible name describes what the pin annotates — e.g. 'Pin 3: comment on primary CTA, by Alice, 2 replies, unresolved'.
- Toggle the pin between selected and unselected and confirm aria-pressed (or aria-current) updates.
- Resolve the pin's thread and confirm the pin's accessible name or aria-describedby reflects the new 'resolved' state.
- With a screen reader, navigate to each pin and confirm role, name, and state are all announced.
- Run axe-core / Lighthouse and confirm no 'button-name', 'aria-valid-attr-value', or 'aria-allowed-attr' violations on pin elements.

**Pass criteria:**
- Every pin has a programmatically-determinable role (button or role=button).
- Every pin has a non-empty accessible name that identifies what it annotates and any relevant metadata (author, reply count).
- Selected state is exposed via aria-pressed, aria-current, or aria-selected as appropriate.
- Resolved / unresolved state is exposed in the accessible name or via aria-describedby pointing to status text.
- Focus state is native (so assistive tech detects it) — not faked via a CSS class without keyboard focus.
- axe-core reports no role/name/value violations on pin elements.

**Fail examples:**
- Pins are <div onclick=…> elements with no role and no tabindex; screen readers ignore them entirely.
- Pin accessible name is the literal pin number ('3') with no context — screen-reader user hears 'button, 3' and cannot tell what is annotated.
- Selected pin is indicated only via a CSS class (e.g. .pin--selected) with no aria-pressed / aria-current; assistive tech cannot tell which pin is active.
- Resolved pins are visually faded but the resolved state is nowhere in the accessible name or via aria-describedby; a screen-reader user cannot tell resolved from unresolved.
- Pins use role=button but also include nested interactive children (avatar, count badge) that are themselves focusable, producing nested-button violations.

**References:**
- [WCAG 4.1.2 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value)

### Thread containers expose a region/article role, an accessible name, and resolved/open state programmatically

- **ID:** `4.1.2-thread-role-name`
- **WCAG 4.1.2** Name, Role, Value (Level A)
- **Tags:** `name-role-value`, `threads`

Each thread in a review tool is a discoverable conversation — a screen-reader user navigating by landmark or by article must be able to find it, recognise what it is about, and know whether it is open or resolved. WCAG 4.1.2 requires role, name, and state for each thread container. The correct pattern: each thread is a role=article (or role=region) with an aria-label or aria-labelledby naming the thread (topic if user-set, otherwise an excerpt of the first comment) and an aria-describedby or aria-label suffix that includes the open/resolved state.

**How to test:**
- Open a review with multiple threads and inspect each thread container in DevTools.
- Confirm each thread has role=article (or role=region) and a non-empty accessible name from aria-label or aria-labelledby.
- Confirm the accessible name names the thread by topic (if set) or by first-comment excerpt — not a meaningless ID.
- Resolve a thread and confirm the accessible name (or an associated aria-describedby) updates to include the resolved state.
- Navigate by region / article landmark in a screen reader and confirm each thread is discoverable and identifiable.
- Confirm reopened threads correctly update their state in the accessible name.

**Pass criteria:**
- Each thread is a role=article or role=region with a non-empty accessible name.
- The accessible name identifies the thread by topic or first-comment excerpt — not by ID alone.
- Open / resolved state is exposed in the name or via aria-describedby pointing to a status text.
- When a thread is resolved or reopened, the accessible name updates accordingly.
- Screen readers can find each thread via landmark / article navigation.

**Fail examples:**
- Threads are bare <div> elements with no landmark role — screen-reader users cannot list or jump between them.
- Thread accessible name is the literal thread ID ('Thread-abc123'); the user has no idea what the thread is about.
- Resolved state is conveyed only by a visual checkmark and a faded color — never in the accessible name.
- Each thread is wrapped in role=region but two threads share the same accessible name 'Comment thread', so screen-reader users cannot distinguish them.
- Reopening a thread leaves the accessible name still saying 'resolved' because the value was hard-coded at render.

**References:**
- [WCAG 4.1.2 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value)

### Workflow state buttons expose pressed/disabled state and the reason for disablement programmatically

- **ID:** `4.1.2-workflow-button-role-state`
- **WCAG 4.1.2** Name, Role, Value (Level A)
- **Tags:** `name-role-value`, `workflow-state`

Workflow buttons (Approve, Request changes, Reject, Archive) commonly become disabled in certain states — e.g. Approve is disabled while blocking threads are unresolved. WCAG 4.1.2 requires that role, name, and value (state) be exposed programmatically. A button greyed out with no aria-disabled (or worse, hidden via disabled but with no exposed reason) leaves assistive-tech users unable to discover both that it is disabled and why. The pattern: use aria-disabled="true" (not the disabled attribute, which removes the button from focus order entirely and prevents the user from reading the reason via aria-describedby) plus aria-describedby pointing to a visible reason text.

**How to test:**
- Open an artifact with blocking unresolved threads and inspect the Approve button.
- Confirm the disabled state is exposed via aria-disabled="true" rather than the native disabled attribute (so the button remains focusable and screen-reader users can hear the reason).
- Confirm an aria-describedby on the button points to a visible reason text — e.g. 'Cannot approve: 3 blocking threads unresolved'.
- Toggle the button to a pressed state (e.g. Approve becomes 'Approved' with a pressed visual) and confirm aria-pressed updates.
- Tab to the disabled button with a screen reader and confirm BOTH the role/name AND the disablement reason are announced.
- Verify enabled buttons have no stale aria-disabled='false' attributes and no stale describedby pointing to outdated reasons.

**Pass criteria:**
- Workflow buttons use aria-disabled="true" rather than the native disabled attribute when the disablement carries a reason the user should hear.
- Disabled workflow buttons expose their reason via aria-describedby pointing to visible reason text.
- Pressed / toggled state is exposed via aria-pressed when applicable.
- When the disablement clears, aria-disabled and the describedby reason are removed in sync.
- Screen readers announce both the button name and the disablement reason on focus.

**Fail examples:**
- Approve button uses the native disabled attribute; the button is removed from tab order and screen-reader users cannot focus it to hear why.
- Disabled Approve button has no aria-describedby; sighted users see a tooltip on hover but keyboard / screen-reader users get nothing.
- Approve button stays aria-pressed="true" after the user clicks 'Request changes', producing a stale state.
- Disabled reason text is rendered visually adjacent to the button but is not wired via aria-describedby — screen-reader users hear only 'Approve, dimmed' with no explanation.
- Button uses both disabled AND aria-disabled='true', producing inconsistent behaviour across browsers / screen readers.

**References:**
- [WCAG 4.1.2 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value)

### Remote-collaborator presence and incoming annotations announce non-disruptively via a live region with a user mute

- **ID:** `4.1.3-realtime-collab-announce`
- **WCAG 4.1.3** Status Messages (Level AA)
- **Tags:** `live-regions`, `realtime`

Real-time collaboration produces a stream of status events: a collaborator joins, a collaborator leaves, a new annotation arrives, a comment is posted. Under WCAG 4.1.3 these are status messages and must be programmatically determinable without stealing focus. But because the stream can be high-frequency and disruptive for screen-reader users, the tool must also offer a user-controlled mute — a setting to silence presence announcements while keeping annotation announcements, or vice versa, or all of them. Without a mute, an over-eager live region becomes a denial-of-service against the screen-reader user.

**How to test:**
- Open a review with two real users and have the second user join; confirm a polite live region announces 'Bob joined' (or similar) without stealing focus from the first user.
- Have the second user leave; confirm a corresponding 'Bob left' announcement.
- Have the second user add an annotation; confirm a polite announcement names the author and what was added.
- Open the accessibility / notifications settings and confirm a per-channel mute exists — at minimum: mute presence, mute incoming annotations, mute typing indicators.
- Toggle each mute and confirm the corresponding channel goes silent while the others continue.
- Stress-test with 5+ concurrent collaborators making rapid edits and confirm the live region does not produce an unreadable wall of speech — either it batches, debounces, or respects a 'reduced' mode.

**Pass criteria:**
- Presence join/leave events announce via a polite live region without stealing focus.
- Incoming annotations / comments from remote users announce via a polite live region with author + content context.
- A user-controlled mute is exposed in settings, with per-channel granularity (presence, annotations, typing).
- High-frequency announcements are batched, debounced, or reduced to avoid overwhelming screen-reader users.
- Mute settings persist across sessions for the same user.

**Fail examples:**
- Remote collaborator joins are not announced at all; screen-reader users have no idea anyone else is in the room.
- Every keystroke from a remote user produces a live-region update ('Alice is typing… Alice is typing… Alice typed t… Alice typed te…'), DoS-ing the screen reader.
- No mute control is exposed; the only way to silence announcements is to disable the screen reader or close the page.
- Presence announcements use aria-live="assertive" and interrupt the user's own dictation / typing constantly.
- Mute toggle exists but does not persist; every reload reverts to the noisy default.

**References:**
- [WCAG 4.1.3 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/status-messages)

### Resolving or reopening a thread announces via a live region

- **ID:** `4.1.3-thread-resolve-announce`
- **WCAG 4.1.3** Status Messages (Level AA)
- **Tags:** `live-regions`, `threads`

Marking a thread resolved (or reopening a resolved thread) is a status message: the change is meaningful to anyone tracking the review's progress, particularly screen-reader users who cannot rely on visual cues like a strike-through or fade. WCAG 4.1.3 requires this be announced via a live region without stealing focus. The announcement should name the thread and the new state — 'Thread on primary CTA resolved by Alice' — so the user has enough context to know which thread changed.

**How to test:**
- Open a thread and click 'Resolve'; confirm a polite live region announces 'Thread <topic> resolved' (or similar named announcement).
- Reopen the thread and confirm a corresponding 'Thread <topic> reopened' announcement.
- Confirm focus remains where it was — on the resolve button — and is not stolen.
- Resolve a thread that has no topic and confirm the announcement falls back to a first-comment excerpt or a meaningful identifier.
- Resolve multiple threads in rapid succession and confirm each announcement is preserved (or at minimum the live region uses an aria-relevant strategy that does not silently drop messages).
- Verify resolve-by-others (remote action) also announces, so the local user is aware of the change.

**Pass criteria:**
- Resolving or reopening a thread fires a polite live-region announcement that names the thread.
- Focus is not stolen.
- Remote resolve/reopen actions are also announced (so the local user knows the state change came from a teammate).
- Announcements contain enough context to identify which thread was affected.
- Rapid sequential resolves do not produce a confusing pile-up — the live region pattern handles bursts gracefully.

**Fail examples:**
- Resolving a thread changes only a visual checkmark and a faded background; nothing is announced and screen-reader users never know the resolution happened.
- Announcement reads only 'Thread resolved' with no identifier — when ten threads are open the user cannot tell which one changed.
- Resolve action moves focus to a 'Resolved' toast that must be dismissed — interrupting the user.
- Remote resolves are not announced; the local user only finds out when they scroll to the thread and see it has changed.
- Live region uses assertive priority for every resolve, interrupting the screen reader mid-sentence on a busy review.

**References:**
- [WCAG 4.1.3 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/status-messages)

### Workflow state transitions announce via a live region without stealing focus

- **ID:** `4.1.3-workflow-state-announce`
- **WCAG 4.1.3** Status Messages (Level AA)
- **Tags:** `live-regions`, `workflow-state`

When an artifact moves between workflow states (draft → in review → approved → requires changes), the transition is a status message under WCAG 4.1.3: it must be programmatically determinable to assistive tech without receiving focus and without requiring the user to navigate to find it. The pattern is a polite live region (aria-live="polite" or role="status") that announces 'Artifact moved to In Review' on transition. The announcement must not steal focus (the reviewer should not be yanked from their current task) and must not be assertive unless the transition is genuinely urgent.

**How to test:**
- Trigger a workflow transition (e.g. submit for review) and confirm a polite live region announces the new state — without focus moving.
- Confirm focus remains where the user was — typically on the workflow control or the next logical control.
- Inspect the DOM and confirm the live region exists at page load (aria-live regions added dynamically often miss the first announcement).
- Trigger several transitions in sequence and confirm each is announced (no rapid-fire skipping).
- Confirm an assertive announcement is used only for genuinely urgent transitions (e.g. 'Approval failed: server error') — not for every state change.
- Test with VoiceOver, NVDA, and JAWS to confirm the announcement is reliably picked up across the major screen readers.

**Pass criteria:**
- Workflow state transitions are announced via a polite live region (aria-live="polite" or role="status").
- Focus is not moved by the announcement.
- The live region exists in the DOM at page load (not injected on demand).
- Assertive announcements are reserved for genuine urgency.
- Announcements are picked up by NVDA, JAWS, and VoiceOver.

**Fail examples:**
- Workflow transition opens a 'State changed to In Review' modal that steals focus and must be dismissed.
- State change is reflected visually in a header pill but never announced; screen-reader users have no way to know the transition happened.
- All state changes (including routine ones) use aria-live="assertive", interrupting the user every few seconds during a busy review session.
- Live region is injected dynamically on the first transition; the first announcement is missed because the region had not yet existed when the screen reader scanned the page.
- Multiple rapid transitions overwrite the live-region text faster than the screen reader can read it, so the user hears only the final state.

**References:**
- [WCAG 4.1.3 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/status-messages)

## Dynamic & Collaborative Patterns

### Presence avatar tooltips persist while hovered and are dismissable with Escape

- **ID:** `1.4.13-presence-tooltip-dismissable`
- **WCAG 1.4.13** Content on Hover or Focus (Level AA)
- **Tags:** `realtime`, `focus`

Presence avatars in a collaborative tool typically reveal a tooltip on hover or focus showing the user's full name and role. WCAG 1.4.13 requires that such tooltips (a) be dismissable without moving pointer / focus (Escape must dismiss), (b) be hoverable (the user can move the pointer into the tooltip itself without it disappearing — e.g. to read text or click a link inside), and (c) be persistent (the tooltip remains visible until the trigger or tooltip itself loses hover/focus, the user dismisses it, or the information becomes invalid).

**How to test:**
- Hover a presence avatar to show its tooltip; press Escape and confirm the tooltip dismisses without moving the pointer.
- Hover the avatar to show the tooltip, then move the pointer slowly into the tooltip body; confirm the tooltip stays visible (does not close mid-traverse).
- Tab to a presence avatar so it receives keyboard focus and confirm the tooltip appears on focus, not only on mouse hover.
- Press Escape with keyboard focus on the avatar and confirm the tooltip dismisses while focus remains on the avatar.
- Leave the tooltip visible and confirm it persists indefinitely — it does not time out after 2 seconds and disappear without user action.
- Confirm the tooltip content is exposed to AT (via aria-describedby on the trigger or by being inside the same accessible-name boundary).

**Pass criteria:**
- Tooltips on presence avatars appear on both hover and keyboard focus.
- Escape dismisses the tooltip without moving focus or pointer.
- The pointer can move into the tooltip body without dismissing it (hoverable).
- The tooltip persists until trigger / tooltip loses hover/focus, user dismisses, or content is invalidated.
- Tooltip content is exposed to assistive tech.

**Fail examples:**
- Tooltip closes the instant the pointer leaves the avatar — the user cannot move the pointer into the tooltip to read it.
- No keyboard equivalent: tooltip only shows on mouse hover, never on focus.
- Tooltip cannot be dismissed without moving the mouse — Escape does nothing.
- Tooltip auto-dismisses after a short timeout (e.g. 1.5 seconds) regardless of whether the user has finished reading.
- Tooltip content is rendered in a detached portal with no aria-describedby on the trigger; screen-reader users never see the tooltip text.

**References:**
- [WCAG 1.4.13 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus)

### Incoming remote updates do not move the local user's keyboard focus

- **ID:** `2.4.3-focus-survives-remote-update`
- **WCAG 2.4.3** Focus Order (Level A)
- **Tags:** `focus`, `realtime`, `keyboard`

In a collaborative tool, remote events constantly mutate the DOM: a teammate adds a comment, a new version is dropped, presence changes. Each of these can cause a careless re-render to dump the user's focus — the textarea they were typing in unmounts, focus reverts to <body>, and the next Tab moves from the top of the page rather than from where they were. Under WCAG 2.4.3, focus order must be preserved through these mutations. Remote updates must be applied in ways that retain the local user's focus on the element they were interacting with, either via stable keys / refs, focus restoration after re-render, or insertion strategies that do not unmount the focused element.

**How to test:**
- Focus a deeply-nested control (a reply textarea in thread #14) and have a teammate add a new top-level comment; confirm focus stays on the textarea.
- Focus the comment composer mid-typing and have a teammate upload a new version; confirm focus stays on the composer.
- Focus a workflow button and have a teammate change presence (join, leave); confirm focus stays on the workflow button.
- Tab around the page after each remote event and confirm the next Tab goes to the next logical control — not back to the top of the document.
- Inspect React / Vue / Svelte keys on dynamically rendered lists and confirm they are stable identifiers so React does not unmount the focused element on every remote update.
- Test specifically the case where the focused element's parent re-orders — focus must follow the element, not its DOM position.

**Pass criteria:**
- Remote updates never reset focus to <body>.
- The currently focused element survives re-renders triggered by remote events.
- Dynamic lists use stable keys / refs so the focused element is not unmounted on every update.
- After remote events, the next Tab from the focused element goes to the next logical control.
- Where unmount is unavoidable (focused element's container is removed by a remote action), focus is explicitly restored to a sensible neighbour.

**Fail examples:**
- Typing in a reply textarea when a teammate posts a new comment; the thread list re-keys, the textarea unmounts and remounts, focus drops to <body>, and the next keystroke goes nowhere.
- A teammate joins the room; the presence-list update triggers a global app re-render and focus is lost from wherever the local user was.
- Remote version drop causes the entire artifact canvas to remount, dropping focus from any control inside it.
- Focused button is conditionally hidden by a remote update (e.g. the user's role changes); focus is not restored to any neighbour and the page becomes hard to keyboard-navigate.
- Dynamic comment list uses array index as a key, so insertion of a new top-level comment renumbers every key and React unmounts every comment — including the one being edited.

**References:**
- [WCAG 2.4.3 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/focus-order)

### Mid-session role changes update workflow-toolbar focus order predictably without dropping current focus

- **ID:** `2.4.3-role-aware-focus-order`
- **WCAG 2.4.3** Focus Order (Level A)
- **Tags:** `focus`, `roles`, `workflow-state`

Roles can change mid-session — a viewer is promoted to approver, an external guest is granted comment-only access, a reviewer is removed from the artifact entirely. When this happens, the workflow toolbar gains or loses controls (Approve, Request changes, Archive, etc.) and the tab order must update predictably. Under WCAG 2.4.3 the focus order must remain logical AND the current focus must not be dropped: if the user has focus on the comment composer when their role changes, focus must stay on the composer. New controls should slot into the natural tab sequence; removed controls should leave a sensible neighbour as the next stop.

**How to test:**
- Focus the comment composer and have an admin (in another window) promote the local user from viewer to approver; confirm focus stays on the composer.
- Tab forward through the workflow toolbar and confirm the new 'Approve' control appears in its logical position (e.g. before 'Archive', after 'Request changes').
- Have an admin revoke approver rights mid-session and confirm focus is preserved (or, if focus was on the just-removed Approve button, focus moves to a sensible neighbour rather than to <body>).
- Verify role-aware controls maintain stable tab order keys so insertion / removal doesn't trigger wholesale unmounting of unrelated controls.
- Announce the role change itself via a polite live region (a side benefit, but it gives users context for the new controls).
- Test the case where the new role removes ALL workflow toolbar controls — confirm focus moves to a sensible landmark, not to <body>.

**Pass criteria:**
- Mid-session role changes do not drop the user's current focus unless the focused control itself is removed.
- If the focused control is removed, focus moves to a sensible nearby control or landmark.
- New controls slot into the tab order in a logical position — not appended at the very end as an afterthought.
- Removed controls leave the remaining tab sequence coherent.
- Role change is itself announced so the user can understand why their toolbar suddenly grew or shrank.

**Fail examples:**
- User is promoted to approver mid-typing; the toolbar re-renders, focus drops to <body>, and the next Tab moves from the top of the page.
- New 'Approve' button is appended at the very end of the tab order — after every link in the footer — instead of slotting into the workflow toolbar group.
- User is demoted from approver mid-focus on the Approve button; the button is removed, focus drops to <body>, and the keyboard user has to retrace their steps.
- Role change is silent; the toolbar shape changes but the user gets no announcement explaining why.
- Role-aware controls use array-index keys, so any role change unmounts the entire toolbar and drops focus.

**References:**
- [WCAG 2.4.3 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/focus-order)

### Remote version uploads do not auto-switch the local user's view; a non-modal banner offers to switch

- **ID:** `3.2.2-remote-version-no-auto-switch`
- **WCAG 3.2.2** On Input (Level A)
- **Tags:** `versioning`, `realtime`, `workflow-state`

When a teammate uploads a new version of an artifact, a naive implementation might auto-switch every viewer to the new version. Under WCAG 3.2.2 a change of context must not happen as a side effect of a remote action — the local user did not request the switch, and the auto-switch is exactly the kind of unexpected context change the criterion forbids. The correct pattern is a non-modal banner ('Bob uploaded v3 — switch to view it') that lets the local user choose when to switch. This preserves their current focus, their scroll position, and any in-progress comment.

**How to test:**
- Open an artifact at v2 and have a teammate upload v3; confirm the local view does NOT switch automatically.
- Confirm a non-modal banner / toast appears offering to switch, with a clear action button.
- Confirm the banner does not steal focus.
- Click the switch action and confirm the local view moves to v3.
- Dismiss the banner and confirm the local user stays on v2 with no further interruption.
- Confirm that any in-progress comment / draft is preserved when the user later chooses to switch (or when they dismiss the banner).
- Verify the banner is announced via a polite live region so screen-reader users know a new version is available.

**Pass criteria:**
- Remote version uploads never auto-switch the local user's view.
- A non-modal banner offers the switch with a clear, keyboard-accessible action.
- The banner does not steal focus.
- The banner is announced via a polite live region.
- Dismissing the banner does not lose the option entirely — the user can still find the new version via the version picker.
- In-progress drafts survive the switch (or are preserved if the user dismisses).

**Fail examples:**
- Teammate uploads v3; the local view auto-switches mid-comment-composition, dumping focus and losing the in-progress comment.
- Auto-switch happens with a brief flash and no announcement; screen-reader users do not realise the artifact changed under them.
- Switch is offered via a modal that steals focus and must be dismissed.
- Banner appears but its 'Switch' action is mouse-only; keyboard users cannot reach it.
- Banner is not announced via a live region; AT users miss the offer entirely.
- Dismissing the banner clears the new-version-available state entirely; the user has to refresh the page to find v3.

**References:**
- [WCAG 3.2.2 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/on-input)

### Concurrent edit conflicts and resolution paths announce via an assertive live region

- **ID:** `4.1.3-conflict-resolution-announce`
- **WCAG 4.1.3** Status Messages (Level AA)
- **Tags:** `live-regions`, `realtime`, `forms`

When two users edit the same comment or annotation simultaneously, a conflict arises: the local user's draft is about to be overwritten or merged with a remote edit. Unlike the routine status events that should be polite, a conflict requires the user's attention before they continue — typing into a field that is mid-conflict will lose data. WCAG 4.1.3 status messages allow assertive priority for genuinely urgent updates; conflict resolution is the canonical example. The announcement must name the conflict, name the conflicting party, and clearly state the available resolution paths (keep mine, keep theirs, merge, view diff).

**How to test:**
- Simulate a concurrent edit on the same comment (two users editing the same comment in two browser windows).
- Confirm an assertive live region (aria-live="assertive" or role="alert") announces the conflict — naming the conflicting user and the available resolution paths.
- Confirm the conflict-resolution UI is keyboard-accessible and that resolution paths can be selected without a mouse.
- Confirm that focus is NOT stolen unless the user's text would otherwise be silently overwritten — assertive announcement only, focus retention preferred.
- Trigger the conflict and try to continue typing; confirm the tool blocks the input from being silently lost (e.g. preserves the local draft in a fork).
- After resolution, confirm a polite follow-up announcement names the outcome ('Conflict resolved — your edit kept').

**Pass criteria:**
- Edit conflicts are announced via aria-live="assertive" or role="alert".
- The announcement names the conflicting user and the available resolution paths.
- Resolution UI is fully keyboard-accessible.
- The local user's in-progress text is preserved through the conflict — never silently overwritten.
- A polite follow-up announcement confirms the outcome.

**Fail examples:**
- Remote edit silently overwrites the local user's in-progress text — the user keeps typing into a field whose underlying value just changed under them.
- Conflict is shown visually as a yellow banner with no live-region exposure; screen-reader users never know a conflict happened.
- Conflict resolution UI is a mouse-only dropdown — keyboard users cannot pick 'keep mine' / 'keep theirs'.
- Live region uses polite priority for conflicts, so the user keeps typing for several seconds before the announcement plays.
- After resolution the live region is never cleared, leaving stale conflict text that gets re-read on every page interaction.

**References:**
- [WCAG 4.1.3 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/status-messages)

### Changes to the active presence list (join/leave) announce in a polite live region

- **ID:** `4.1.3-presence-list-changes-announce`
- **WCAG 4.1.3** Status Messages (Level AA)
- **Tags:** `live-regions`, `realtime`, `roles`

The presence list — the avatar stack showing 'who else is here right now' — is a real-time status surface unique to collaborative review tools. When a collaborator joins or leaves, the change is meaningful: it affects whether private feedback is safe, whether typing a comment will produce a typing indicator visible to specific people, and whether the artifact will be reviewed by the expected audience. Under WCAG 4.1.3 these presence changes are status messages and must be programmatically determinable without stealing focus. Polite live-region announcements are the right pattern: 'Bob joined. 3 reviewers present.' The list itself must also expose its current count and roster to assistive tech via a role / aria-label.

**How to test:**
- Open a review with two real users and watch the presence avatar stack as the second user joins; confirm a polite live-region announcement names the joining user.
- Have the second user leave; confirm a 'Bob left. 1 reviewer present.' announcement.
- Inspect the presence list container and confirm it has a role (e.g. role=list or role=group) and an aria-label naming what it is ('Active reviewers').
- Confirm each presence avatar has an accessible name (reviewer's name + role) so screen-reader users can navigate the list.
- Confirm focus is not stolen by any join/leave announcement.
- Rapid-fire join/leave (multiple users joining quickly) does not produce an unreadable wall of speech — announcements are batched or summarised.

**Pass criteria:**
- Join and leave events announce via a polite live region without stealing focus.
- Announcements name the user and update the active count.
- The presence list is itself navigable as a list / group with an accessible name.
- Each avatar has a meaningful accessible name (user + role), not just an image.
- Burst events are batched or summarised rather than producing one announcement per millisecond.

**Fail examples:**
- Users join silently — only the avatar stack updates, with no announcement; a screen-reader user never knows when others arrive.
- Presence list is a row of <img> with no list role and no aria-label; AT cannot describe it as a unit.
- Each avatar's alt text is the user's initials ('AB') — screen-reader users hear 'AB, BC, CD' with no idea who is present.
- Announcements use aria-live="assertive" and interrupt the user every time anyone joins or leaves a busy review.
- Five users joining within one second produces five separate announcements, blowing past the user's ability to keep up.

**References:**
- [WCAG 4.1.3 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/status-messages)

### Real-time connection loss, reconnection, and unsaved-comment buffering announce via live regions

- **ID:** `4.1.3-realtime-error-announce`
- **WCAG 4.1.3** Status Messages (Level AA)
- **Tags:** `live-regions`, `realtime`

Real-time collaboration depends on a persistent connection (websocket, long-poll, presence channel). When the connection drops, the user is no longer seeing teammate edits and their own comments may not be reaching the server. Under WCAG 4.1.3 these state changes are status messages: connection loss, reconnect attempts, successful reconnect, and the state of any unsaved-comment buffer must all be announced via live regions. The pattern: an assertive announcement on first disconnect (because the user is about to type into the void), polite announcements for each subsequent state change, and a clear status indicator that screen-reader users can poll on demand.

**How to test:**
- Disconnect the network (e.g. browser DevTools 'Offline') and confirm a live region announces the disconnect within a reasonable interval (a few seconds).
- Confirm the announcement explains what disconnect means for the user — e.g. 'Connection lost — comments will be sent when reconnected'.
- Confirm any in-progress comments are buffered locally (not silently dropped) and that the buffer state is visible / announced.
- Reconnect and confirm a polite announcement confirms recovery and that buffered comments are being sent.
- Confirm reconnect attempts (during longer outages) are announced at a non-spammy interval — not every single retry, but enough to let the user know the tool is trying.
- Confirm a persistent status indicator in the UI is exposed to AT (e.g. an aria-live polite region holding the current connection state, queryable by JAWS / NVDA on demand).

**Pass criteria:**
- Connection loss is announced via an assertive live region or role="alert" with a clear explanation.
- Unsaved-comment buffering is visible and exposed to AT — the user can confirm nothing is being lost.
- Reconnect attempts are announced at a reasonable interval (not on every retry).
- Successful reconnection is announced with confirmation that buffered comments are being flushed.
- A persistent connection-status indicator is exposed to AT for on-demand checking.
- Comments composed while offline are preserved, not silently dropped.

**Fail examples:**
- Connection drops silently; the user keeps typing for minutes before realising nothing has been sent.
- Disconnect is shown only via a small grey icon in the corner — no announcement and no AT exposure.
- Reconnect attempts produce a live-region announcement every retry (e.g. every 2 seconds), DoS-ing the screen reader.
- Buffered comments are silently dropped on disconnect; the user's typed text is lost.
- Reconnection happens silently; the user does not know that pending comments were flushed and is unsure whether to retype.
- Connection-status indicator is a visual-only badge with no AT-readable text.

**References:**
- [WCAG 4.1.3 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/status-messages)

### Remote typing indicators expose status programmatically and respect a user mute

- **ID:** `4.1.3-typing-indicator-announce`
- **WCAG 4.1.3** Status Messages (Level AA)
- **Tags:** `live-regions`, `realtime`, `threads`

Typing indicators ('Alice is typing…') are visual-only by default in most tools — an animated three-dot ellipsis in the thread. For screen-reader users this is invisible context; they may post a comment seconds before Alice's reply lands, producing an awkward overlap. Under WCAG 4.1.3 typing indicators are status messages: they should be exposed programmatically. But because typing indicators can be high-frequency and noisy, they MUST be combined with a user-controlled mute. Without a mute, exposing every keystroke as a status update would itself become a denial-of-service.

**How to test:**
- Open a thread with a second user, have them start typing, and confirm a polite live-region announcement names the typing user (e.g. 'Alice is typing').
- Have the second user stop typing and confirm the indicator clears (no stale 'typing' state).
- Have multiple users type simultaneously and confirm announcements are batched ('Alice and Bob are typing') rather than fired per keystroke.
- Open settings and confirm a per-channel mute for typing indicators exists, separate from presence and annotation mutes.
- Enable the mute and confirm typing indicators are no longer announced (visually they may remain or also be hidden, by the user's choice).
- Confirm the typing indicator's visual animation is not the SOLE channel — screen-reader users have a parity announcement (subject to mute).

**Pass criteria:**
- Typing indicators are exposed via a polite live region naming the typing user(s).
- Stale 'typing' state clears when typing stops.
- Simultaneous typers are batched into a single announcement rather than producing parallel announcements.
- A user-controlled mute for typing indicators exists, separate from other realtime channels.
- Typing is not signalled only by a visual ellipsis animation.

**Fail examples:**
- Typing indicator is a CSS animation of three dots with no programmatic exposure — screen-reader users have no idea anyone is typing.
- Every keystroke fires a live-region update; the screen reader gets stuck reading 'Alice is typing, Alice is typing, Alice is typing' as she types one word.
- No mute is offered; the only escape from constant typing announcements is to disable the screen reader.
- Indicator uses aria-live="assertive" and interrupts the user's dictation each time anyone starts typing.
- Indicator stays stuck on 'Alice is typing' after Alice has navigated away — stale state never clears.

**References:**
- [WCAG 4.1.3 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/status-messages)

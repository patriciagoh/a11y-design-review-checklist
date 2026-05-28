# a11y-design-review-checklist

> Generated from `checklist.json`. Do not edit by hand.
> Version 1.0.0 · WCAG 2.2 AA · Released 2026-05-28T00:00:00Z

Total items: 5

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

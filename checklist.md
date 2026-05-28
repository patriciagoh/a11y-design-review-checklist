# a11y-design-review-checklist

> Generated from `checklist.json`. Do not edit by hand.
> Version 1.0.0 · WCAG 2.2 AA · Released 2026-05-28T00:00:00Z

Total items: 2

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

# Phase 2 — core 15 components (progress file)

Figma file: <file key> · Theme preview component 4:13
Pages: Cover 0:1 · Get started 4:2 · Theming 4:4 · Color 4:5 · Typography 4:6 · Spacing 4:7 · Shape 4:8 · Motion 4:9 · ——— Components 4:10 · ——— Patterns 4:11 · ——— Demos 4:12

Icons page 12:174 · Icon/* ids: plus 12:184 minus 12:189 x 12:194 check 12:199 chevron-down 12:204 chevron-right 12:209 chevron-up-down 12:214 arrow-right 12:219 external-link 12:224 search 12:229 filter 12:234 more 12:239 info 12:244 check-circle 12:249 alert-triangle 12:254 x-circle 12:259 mail 12:264 user 12:269 lock 12:274 calendar 12:279 eye 12:284 copy 12:289 trash 12:294 pencil 12:299 download 12:304 star 12:309 settings 12:314 globe 12:319
New Color roles added (56 total): border/invalid, control/track-off, control/knob, danger/subtle-hover

## Shared rules (same in Figma and code)
- Disabled = whole control at 40% opacity (controls dim, never grey out).
- Pressed = hover colours + 85% opacity.
- Focus = 2px ring in border/focus, 2px outside the control (Figma: locked "focus-ring" layer, stretch constraints).
- Fields: border/control → hover border/control-hover → focus border/focus + 3px accent/subtle-hover halo; error border/invalid + message with x-circle icon.
- Sizes use Density tokens: control/height-sm|md|lg, control/padding-x, control/gap.
- Text: sm controls subheadline-emphasized · md callout-emphasized · lg headline. Field text callout. Labels callout-emphasized. Help footnote.
- Icon stroke 1.75 on a 24 grid.

## Components
| # | Component | Figma axes | React props | Code | Figma |
|---|---|---|---|---|---|
| 1 | Button | Variant filled/tinted/gray/plain/destructive × Size sm/md/lg × State default/hover/pressed/focus/disabled; props Label, Icon left/right, Loading | variant, size, disabled, loading, iconLeft, iconRight | | |
| 2 | Icon button | Variant filled/tinted/gray/plain × Size × State | variant, size, icon, label (aria) | | |
| 3 | Link | Variant inline/standalone × State default/hover/focus | variant, external | | |
| 4 | Text field | State default/hover/focus/error/disabled | label, hint, error, icon, clearable | | |
| 5 | Text area | State default/focus/error/disabled | label, hint, error, maxLength (counter) | | |
| 6 | Search field | State default/focus/filled | value, onClear | | |
| 7 | Select | State default/hover/focus/error/disabled | label, options, placeholder, hint, error | | |
| 8 | Checkbox | Checked false/true/mixed × State default/hover/focus/invalid/disabled | checked, indeterminate, label, description | | |
| 9 | Radio | Selected false/true × State default/hover/focus/disabled (+ RadioGroup) | value, options | | |
| 10 | Toggle | On false/true × State default/focus/disabled | checked, label | | |
| 11 | Segmented control | Segment: Selected × State; control: Items 2/3/4 | options, value | | |
| 12 | Badge | Tone neutral/accent/success/warning/danger/info × Style subtle/solid | tone, appearance | | |
| 13 | Spinner | Size sm/md/lg | size, label | | |
| 14 | Progress bar | Value 0/25/50/75/100/indeterminate | value, label, showValue | | |
| 15 | Box | Variant outlined/filled/elevated | variant, title, description, actions, footer | | |

## Figma progress
Component pages: Button 13:174 · Icon button 13:175 · Link 13:176 · Text field 13:177 · Text area 13:178 · Search field 13:179 · Select 13:180 · Checkbox 13:181 · Radio 13:182 · Toggle 13:183 · Segmented control 13:184 · Badge 13:185 · Spinner 13:186 · Progress bar 13:187 · Box 13:188
Prelude for every script: scripts/figma/prelude.js (docPage builds the standard component docs page)
Built sets: Spinner 13:216 · Button 14:1314 · Icon button 15:366 · Link 16:200 · Text field 17:226 · Text area 18:215 · Search field 19:203 · Select 20:225 · Checkbox 21:272 · Radio 22:220 · Toggle 23:212 · .Segment 24:188 · Segmented control 24:210 · Badge 25:222 · Progress bar 26:215

## Typeface
Inter (variable, optical sizes) for text and display in Default/Graphite/Ember; Studio keeps Bricolage Grotesque for display only.
Figma: Theme collection font/text + font/display; text styles use Inter "Semi Bold" (with a space). Code: @fontsource-variable/inter/opsz.css + font-optical-sizing: auto.

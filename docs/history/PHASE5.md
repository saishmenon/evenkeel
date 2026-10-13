# Phase 5 — remaining components (progress file)

Figma pages: Tooltip 52:174 · Popover 52:175 · Menu 52:176 · Toast 52:177 · Skeleton 52:178 · Expandable section 52:179 · Steps 52:180 · Combo box 52:181 · Slider 52:182 · Tag 52:183
Sets: Tooltip 52:199 · Popover 52:290 · Menu item 52:469 · Menu 52:473 · Toast 52:779 · Skeleton 52:916 · Expandable section 54:238 · Step 54:378 · Steps 54:449 · Combo box 54:675 · Option 54:618 · Slider 54:918 · Tag 54:1039 · Tag group 54:1040

Code: src/components/{Tooltip,Popover,Menu,Toast,Skeleton,ExpandableSection,Steps,ComboBox,Slider,Tag}; floating panels share Popover/floating.ts (+ .css).
Keyboard: Menu (arrows, Home/End, type-ahead, Escape returns focus) · Combo box (ARIA 1.2 combobox) · Tooltip (focus + Escape) · Popover (Escape returns focus) · Toast (hover/focus pauses).

Final audit: 44 sets · 379 variants · 52 components · 48 icons · 0 unbound colours.

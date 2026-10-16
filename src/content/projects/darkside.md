Darkside is a Manifest V3 Chrome extension that restyles a page for eye comfort. A content script runs at `document_start` and sets CSS variables for invert, brightness, contrast, sepia warmth, and dim. Photos and video stay true color. If a page is already dark — a `dark` class, `color-scheme`, or a dark background — invert is skipped unless you force it.

Each hostname keeps its own settings in `chrome.storage`. The popup has Dark Mode, a per-site toggle, presets (Soft, Night, Sunset, Contrast, Reading), and the four sliders. Presets change the eye-care sliders and do not turn invert on. The options page holds global defaults, an auto-night window, custom presets, and the list of per-site preferences.

`Alt` + `Shift` + `D` toggles dark mode on the current tab. Chrome's own pages and the Chrome Web Store are left alone.

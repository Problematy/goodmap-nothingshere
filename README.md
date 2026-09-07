# goodmap-nothingshere

goodmap plugin that shows popup if no point is visible in a view

## Installation

```sh
pip install goodmap_nothingshere
```

## Activation

Add the plugin to the `plugins` list in your Platzky database configuration.
The `name` must match the entry-point key declared in `pyproject.toml`:

```json
{
    "plugins": [
        {
            "name": "nothingshere",
            "config": {}
        }
    ]
}
```

## Configuration

Everything under `config` is passed straight to the frontend component, so the popup is
tuned from the database without rebuilding the plugin. All keys are optional:

| Key | Type | Default | Meaning |
| --- | --- | --- | --- |
| `messages` | `{ <lang>: string }` | built-in English text | Popup text per language code, picked with the site's active language and falling back to `en`. May contain HTML (e.g. a link). |
| `closeLabels` | `{ <lang>: string }` | `{ "en": "Close", "pl": "Zamknij" }` | Accessible name of the close button, per language. |
| `dismissMinutes` | number | `15` | How long the popup stays hidden after the user closes it. A page reload also brings it back. |

```json
{
    "name": "nothingshere",
    "config": {
        "messages": {
            "en": "No points here yet. <a href=\"/add\">Add one?</a>",
            "pl": "Brak punkt\u00f3w w tym miejscu."
        },
        "dismissMinutes": 30
    }
}
```

## Development

This is a goodmap frontend plugin: the backend class subclasses a goodmap capability
base, and the frontend ships a React component per capability via Webpack Module
Federation. A plugin declares its capabilities by subclassing one or more of:

- `goodmap.plugin.MapOverlayPluginBase` — component mounted once over the map
  (exposed as `./MapOverlay`); this plugin's capability
- `goodmap.plugin.MarkerFieldPluginBase` — component rendering/wrapping a marker-popup
  field (exposed as `./MarkerField`)

goodmap derives each capability's Module Federation module from the base class name,
so the webpack `exposes` keys must match, and the webpack container `name` must equal
the entry-point key (`nothingshere`). See goodmap's `examples/plugins/silly-gif` for
the reference layout.

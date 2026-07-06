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

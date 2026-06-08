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

This plugin extends [`PluginBase`](https://platzky.readthedocs.io/en/latest/plugins.html).
To add a specific capability, subclass one of:

- `NotifierPluginBase` — send notifications (implement `notify`)
- `AttachmentNotifierPluginBase` — notifications with file attachments
- `ContentTransformerPluginBase` — transform post/page content and register shortcodes

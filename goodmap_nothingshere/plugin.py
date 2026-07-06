"""goodmap plugin that shows popup if no point is visible in a view"""

from typing import Any

from goodmap.plugin import MapOverlayPluginBase


class NothingsherePlugin(MapOverlayPluginBase):
    """Goodmap map-overlay plugin that shows a popup when no point is visible in a view."""

    def __init__(self, config: dict[str, Any]) -> None:
        super().__init__(config)

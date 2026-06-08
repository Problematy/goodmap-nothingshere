"""goodmap plugin that shows popup if no point is visible in a view"""

from typing import Any

from goodmap.plugin import GoodmapPluginBase


class NothingsherePlugin(GoodmapPluginBase):
    """Goodmap Nothingshere plugin."""

    def __init__(self, config: dict[str, Any]) -> None:
        super().__init__(config)

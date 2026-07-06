from goodmap.plugin import MapOverlayPluginBase

from goodmap_nothingshere.plugin import NothingsherePlugin


def test_plugin_instantiates():
    plugin = NothingsherePlugin({})
    assert isinstance(plugin, NothingsherePlugin)


def test_plugin_declares_map_overlay_capability():
    # goodmap derives the manifest capability/module from this base, so the
    # subclass relation is the plugin's frontend contract.
    assert issubclass(NothingsherePlugin, MapOverlayPluginBase)

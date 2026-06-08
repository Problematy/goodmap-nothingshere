from goodmap_nothingshere.plugin import NothingsherePlugin


def test_plugin_instantiates():
    plugin = NothingsherePlugin({})
    assert isinstance(plugin, NothingsherePlugin)

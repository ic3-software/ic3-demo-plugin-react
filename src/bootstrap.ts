import PluginDefinition from "./PluginDefinition";

const plugin = PluginDefinition();
const info = "Exporting the plugin : " + plugin.id + " [v" + plugin.apiVersion.getInfo() + "]"

const elem = document.getElementById("info");
elem && (elem.innerHTML = info);

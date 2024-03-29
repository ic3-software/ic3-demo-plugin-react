import PluginLocalization from "./PluginLocalization.csv";
import {
    ApiUtils,
    ILocalizationManager,
    ILogger,
    ITidyTableTransformationManager,
    IWidgetManager,
} from "@ic3/reporting-api";
import {TransfRendererCustom} from "./transformations/TransfRendererCustom";
import {KpiCardDefinition} from "./widget/KpiCardDefinition";
import {OpenLayerMapDefinition} from "./widget/OpenLayerMapDefinition";
import {GoogleMapDefinition} from "./widget/GoogleMapDefinition";

/**
 * The plugin definition exposed as a remote Webpack module to the icCube dashboards application.
 */
const PluginDefinition = ApiUtils.makePlugin({

    /**
     * The ID used to identify this plugin within the icCube dashboards application.
     *
     * Keep that id simple (i.e., ASCII letter without any dot, space, separator, etc...) as it will be used
     * as a folder name (once deployed into an icCube server), Webpack module name, localization id, etc...
     *
     * It must be unique across all the loaded plugins.
     */
    id: "MyPluginReact",

    registerLocalization(logger: ILogger, manager: ILocalizationManager) {

        logger.info("Demo", "[MyPluginReact] registerLocalization")

        manager.registerLocalization(PluginLocalization);

    },

    registerTidyTableTransformations(logger: ILogger, manager: ITidyTableTransformationManager) {

        manager.registerTransformation(TransfRendererCustom);

    },


    registerWidgets(logger: ILogger, manager: IWidgetManager) {

        logger.info("Demo", "[MyPluginReact] registerWidgets")

        manager.registerWidget(KpiCardDefinition);
        manager.registerWidget(GoogleMapDefinition);
        manager.registerWidget(OpenLayerMapDefinition);

    },

});

export default PluginDefinition;
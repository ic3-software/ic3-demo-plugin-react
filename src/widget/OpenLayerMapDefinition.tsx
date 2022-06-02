import React, {useCallback, useMemo} from "react";
import {
    FormFieldObject,
    FormFields,
    IPublicReactChartTemplate,
    IPublicWidgetReactTemplateDefinition,
    IWidgetPublicContext,
    IWidgetTemplateTidyData,
    WidgetTemplateDefinitionType
} from "@ic3/reporting-api";

import {fromLonLat} from "ol/proj";
import {createEmpty, extend, getHeight, getWidth} from "ol/extent";
import "ol/ol.css";

// This example illustrates the versatility of a dynamic RStyle
// It also makes use of its caching abilities
import {RLayerCluster, RLayerStamen, RLayerTile, RMap} from "rlayers";
import {RCircle, RFill, RRegularShape, RStroke, RStyle, RText,} from "rlayers/style";
import Feature from "ol/Feature";
import Geometry from "ol/geom/Geometry";
import GeoJSON from "ol/format/GeoJSON";
import earthquakes from "./data/earthquakes.geojson";
import img from "./img/openLayerMap.png"
import Box from "@mui/material/Box";

const reader = new GeoJSON({featureProjection: "EPSG:3857"});

const colorBlob = (size: number) =>
    "rgba(" + [255, 153, 0, Math.min(0.8, 0.4 + Math.log(size / 10) / 20)].join() + ")";

const radiusStar = (feature: Feature<Geometry>) =>
    Math.round(5 * (parseFloat(feature.get("mag")) - 2.5));

// This returns the north/south east/west extent of a group of features
// divided by the resolution
const extentFeatures = (features: any, resolution: number) => {
    const extent = createEmpty();
    for (const f of features) extend(extent, f.getGeometry().getExtent());
    return Math.round(0.25 * (getWidth(extent) + getHeight(extent))) / resolution;
};

enum LayerType {
    geo = 'geo',
    watercolor = 'watercolor',
    toner = "toner"
}

let uid = 1;

/**
 * An OpenLayer map using RLayers lib https://github.com/mmomtchev/rlayers
 *
 * This Example (Cluster): https://mmomtchev.github.io/rlayers/#/cluster
 * All examples : https://mmomtchev.github.io/rlayers/#/ *
 *
 * If you want an example how to bind with a query, you can check GoogleMap.tsx
 */
function MyOpenLayerMap(context: IWidgetPublicContext, data: IWidgetTemplateTidyData, options: OpenLayerOptions, header: string) {

    const [distance, setDistance] = React.useState(20);
    const earthquakeLayer = React.useRef<RLayerCluster>();

    // reactKey is there to force a React redraw when the options change. <RMap> doesn't refresh well on props change
    const [reactKey, view] = useMemo(() => {
        const view = {
            center: fromLonLat([options.mapOptions.longitude, options.mapOptions.latitude]),
            zoom: options.mapOptions.zoom
        }
        return [uid++, view]
    }, [options]);

    /**
     * We could use a theme based styling as well instead of hardcoding
     *
     * @see KpiCardDefinition.tsx for one
     */
    return <Box
        sx={{
            display: 'flex',
            height: '100%',
            weight: '100%',
            flexDirection: 'column',
            "& .Ic3-OpenLayerMap-root": {
                flexGrow: 1
            },
            "& .Ic3-OpenLayerMap-cluster": {
                width: "100%"
            },
            "& .Ic3-OpenLayerMap-cluster-input": {
                width: "100%"
            }
        }}
    >
        <RMap
            key={reactKey}
            className="Ic3-OpenLayerMap-root"
            initial={view}
        >
            {/*The layer used for the map using props to switch*/}
            {
                options.mapType === LayerType.geo ?
                    <RLayerTile
                        url="https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png"
                        attributions="Kartendaten: © OpenStreetMap-Mitwirkende, SRTM | Kartendarstellung: © OpenTopoMap (CC-BY-SA)"
                    />
                    :
                    <RLayerStamen layer={options.mapType}/>
            }
            {/*The cluster as defined in the example*/}
            <RLayerCluster
                ref={earthquakeLayer as any}
                distance={distance}
                format={reader}
                url={earthquakes}
            >
                <RStyle
                    cacheSize={1024}
                    cacheId={useCallback(
                        (feature, resolution) =>
                            // This is the hashing function, it takes a feature as its input
                            // and returns a string
                            // It must be dependant of the same inputs as the rendering function
                            feature.get("features").length > 1
                                ? "#" + extentFeatures(feature.get("features"), resolution)
                                : "$" + radiusStar(feature.get("features")[0]),
                        []
                    )}
                    render={useCallback((feature, resolution) => {
                        // This is the rendering function
                        // It has access to the cluster which appears as a single feature
                        // and has a property with an array of all the features that make it
                        const size = feature.get("features").length;
                        // This is the size (number of features) of the cluster
                        if (size > 1) {
                            // Render a blob with a number
                            const radius = extentFeatures(feature.get("features"), resolution);
                            return (
                                <>
                                    <RCircle radius={radius}>
                                        <RFill color={colorBlob(size)}/>
                                    </RCircle>
                                    <RText text={size.toString()}>
                                        <RFill color="#fff"/>
                                        <RStroke color="rgba(0, 0, 0, 0.6)" width={3}/>
                                    </RText>
                                </>);
                        }
                        // We have a single feature cluster
                        const unclusteredFeature = feature.get("features")[0];
                        // Render a star
                        return (
                            <RRegularShape
                                radius1={radiusStar(unclusteredFeature)}
                                radius2={3}
                                points={5}
                                angle={Math.PI}
                            >
                                <RFill color="rgba(255, 153, 0, 0.8)"/>
                                <RStroke color="rgba(255, 204, 0, 0.2)" width={1}/>
                            </RRegularShape>
                        );
                    }, [])}
                />
            </RLayerCluster>
        </RMap>
        <div className="Ic3-OpenLayerMap-cluster">
            <label htmlFor="distance">Clustering distance</label>
            <input
                type="range"
                className="Ic3-OpenLayerMap-cluster-input"
                min="5"
                max="50"
                id="distance"
                value={distance}
                onChange={useCallback((e) =>
                    setDistance(parseInt(e.currentTarget.value)), [])
                }
            />

        </div>
    </Box>
}

interface OpenLayerCenterZoom extends FormFieldObject {
    /**
     * Zoom.
     *
     * To set the currently displayed zoom open the widget's menu (top right) and click on 'Set Zoom & Center'.
     *
     * Integers between zero, and up to the supported <a href="https://developers.google.com/maps/documentation/javascript/maxzoom">maximum zoom level</a>.
     */
    zoom: number;

    /**
     * Latitude.
     *
     * To set the currently displayed latitude open the widget's menu (top right) and click on 'Set Zoom & Center'.
     */
    latitude: number;

    /**
     * Longitude.
     *
     * To set the currently displayed longitude open the widget's menu (top right) and click on 'Set Zoom & Center'.
     */
    longitude: number;
}

/**
 * The options (possibly edited and/or from the theme) of this widget.
 */
interface OpenLayerOptions extends FormFieldObject {

    /**
     * Map Type.
     */
    mapType: LayerType;

    mapOptions: OpenLayerCenterZoom;
}

function centerAndZoomMeta(): FormFields<OpenLayerCenterZoom> {
    return {
        "zoom": {
            fieldType: "number",
            group: "mapSettings",
            defaultValue: 1,
        },
        "latitude": {
            fieldType: "number",
            group: "mapSettings",
            defaultValue: 0,
        },
        "longitude": {
            fieldType: "number",
            group: "mapSettings",
            defaultValue: 0,
        },
    }
}

function openLayerWidgetMeta(): FormFields<OpenLayerOptions> {
    return {
        "mapType": {
            fieldType: "option",
            group: "mapSettings",
            defaultValue: LayerType.geo,
            editorConf: {
                optionValues: Object.values(LayerType)
            }
        },
        "mapOptions": {
            fieldType: "embedded",
            editorConf: {
                fieldPathPrefix: "mapOptions",
                meta: centerAndZoomMeta(),
            }
        }
    }
}

export const OpenLayerMapDefinition: IPublicWidgetReactTemplateDefinition<OpenLayerOptions> = {

    type: WidgetTemplateDefinitionType.Filter,

    /**
     * @see PluginLocalization.csv
     */
    id: "OpenLayer",
    groupId: "myChartsReact",

    image: img,

    withoutQuery: true,

    chartOptionsMeta: openLayerWidgetMeta(),

    reactComponent: true,

    jsCode: (context): IPublicReactChartTemplate<OpenLayerOptions> => {
        return {
            reactElement: (data, options, header) => MyOpenLayerMap(context, data, options, header)
        }
    },

}


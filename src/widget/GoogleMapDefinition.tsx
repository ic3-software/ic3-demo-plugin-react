import React, {useMemo, useRef} from "react";
import {
    FormFieldObject,
    FormFields,
    GoogleMapCoordinateChartOptions,
    IPublicWidgetReactTemplateDefinition,
    IWidgetPublicContext,
    IWidgetTemplateMdxBuilderAxisPropsConstraint,
    IWidgetTemplateTidyData,
    TidyColumnsType,
    WidgetTemplateDefinitionType
} from "@ic3/reporting-api";
import img from "./img/googleMap.png"

/**
 * You could use the Google React Wrapper https://github.com/googlemaps/react-wrapper instead,
 * but you would lose some ic3 features.
 */
function MyGoogleMap(props: { wContext: IWidgetPublicContext, data: IWidgetTemplateTidyData, options: GoogleWidgetOptions, widgetHeader: string }) {

    const {wContext, data, options} = props;

    const googleMapRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    // all options available google.maps.MapOptions
    // see https://developers.google.com/maps/documentation/javascript/reference/map
    const mapOptions: google.maps.MapOptions = useMemo(() => ({
        ...options,
        center: {lat: options.mapOptions.latitude, lng: options.mapOptions.longitude},
        zoom: options.mapOptions.zoom,
        mapOptions: undefined,
    }), [options]);

    // important / cache mapOptions as on each option change there is a React flow callback
    const ret = wContext.reactUseGoogleMapPlus(mapOptions, googleMapRef);

    const markers = useRef<google.maps.Marker[]>([]);

    const gMap = ret?.map;
    const table = data?.table;
    const inter = data?.inter;
    useMemo(() => {

        if (gMap && table) {

            const clickEventColumn = table.getOptionalColumnByAlias("location");

            // That's the way to delete former markers
            markers.current.forEach(marker => marker.setMap(null));

            // use ic3 logic to get from the table the column coordiantes  (might be props)
            // this is possible as we use ic3 way to define location, latitude and longitude
            const [latitude, longitude] = wContext.getMapCoordinates(table);
            if (latitude && longitude) {

                // for each row create a marker
                table.mapRows(rowIdx => {

                    const lat = Number(latitude.getValue(rowIdx));
                    const lng = Number(longitude.getValue(rowIdx));

                    const marker = new google.maps.Marker({
                        position: {lat: lat, lng: lng},
                        map: gMap,
                        title: "I'm here" + (clickEventColumn ? " : " + clickEventColumn.getValue(rowIdx) : ""),
                    });
                    markers.current.push(marker);

                    // bind the marker click event to ic3 interactions
                    const eventsActive = inter.isSelectionActive() || inter.firesEvent('RowClick');
                    if (eventsActive && clickEventColumn) {

                        const eventCallback = (event: any) => {
                            alert("You clicked " + clickEventColumn.getValue(rowIdx));
                            inter.handleClickSelection(rowIdx, event);
                            inter.fireEvent('RowClick', clickEventColumn, rowIdx);
                        }

                        marker.addListener('click', function (event: any) {
                            eventCallback && eventCallback(event.domEvent);
                        });

                    }

                });


            }
        }

    }, [wContext, gMap, table, inter]);


    return <div style={{width: '100%', height: '100%'}} ref={googleMapRef}/>
}

interface GoogleMapCenterZoom extends FormFieldObject {
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
interface GoogleWidgetOptions extends GoogleMapCoordinateChartOptions {

    /**
     * Map Type.
     */
    mapType: string[];


    /**
     * initial position and zoom
     */
    mapOptions: GoogleMapCenterZoom;

    /**
     * Zoom Control.
     */
    zoomControl?: boolean;

    /**
     * Full Screen Control.
     */
    fullscreenControl?: boolean;


}

function centerAndZoomMeta(): FormFields<GoogleMapCenterZoom> {
    return {
        "zoom": {
            fieldType: "number",
            group: "mapSettings",
            defaultValue: 3,
        },
        "latitude": {
            fieldType: "number",
            group: "mapSettings",
            defaultValue: 42,
        },
        "longitude": {
            fieldType: "number",
            group: "mapSettings",
            defaultValue: 24,
        },
    }
}

function googleWidgetMeta(): FormFields<GoogleWidgetOptions> {
    return {
        "location": {
            fieldType: "columnsChooser",
            editorConf: {
                allowedTypes: [TidyColumnsType.CHARACTER],
                fallback: true,
            },
        },
        "latitude": {
            fieldType: "columnsChooser",
            editorConf: {
                allowedTypes: [TidyColumnsType.LATITUDE],
                fallback: true,
                includeProperties: true
            },
            mandatory: true,
        },
        "longitude": {
            fieldType: "columnsChooser",
            editorConf: {
                allowedTypes: [TidyColumnsType.LONGITUDE],
                fallback: true,
                includeProperties: true
            },
            mandatory: true,
        },
        "mapType": {
            fieldType: "option",
            group: "mapSettings",
            defaultValue: ['roadmap'],
            editorConf: {
                multiple: true
            },
        },
        // we need this structure to allow to set zom/lat/long from the user menu when editing
        // see setZoomAndCenter
        "mapOptions": {
            fieldType: "embedded",
            editorConf: {
                fieldPathPrefix: "mapOptions",
                meta: centerAndZoomMeta(),
            }
        },
        "zoomControl": {
            fieldType: "boolean",
            group: "mapSettings",
            defaultValue: false,
        },
        "fullscreenControl": {
            fieldType: "boolean",
            group: "mapSettings",
            defaultValue: false,
        },
    }
}

export const GoogleMapDefinition: IPublicWidgetReactTemplateDefinition<GoogleWidgetOptions> = {

    type: WidgetTemplateDefinitionType.Filter,

    /**
     * @see PluginLocalization.csv
     */
    id: "GoogleMap",
    groupId: "myChartsReact",

    image: img,

    renderIfQueryNotExecuted: true,

    /**
     * Graphical MDX query builder meta information.
     */
    mdxBuilderSettings: {
        withoutCellValuesSingleAxis: true,
        mdxAxis: [
            {
                name: "location",
                constraint: IWidgetTemplateMdxBuilderAxisPropsConstraint.GeoLatLong
            }
        ]
    },

    eventRoles: {
        publish: ['RowClick'],
    },

    chartOptionsMeta: googleWidgetMeta(),

    // so users, can set zoom & center from the reporting
    userMenuOptionsOnEditing: ["setZoomAndCenter"],

    reactComponent: true,
    reactEl: MyGoogleMap,

}

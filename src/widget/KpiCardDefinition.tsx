import React from "react";
import {
    FormFieldObject,
    FormFields,
    IPublicReactChartTemplate,
    IPublicWidgetReactTemplateDefinition,
    IWidgetPublicContext,
    IWidgetTemplateTidyData,
    TidyColumnsType,
    TidyTableColumnSelector,
    WidgetTemplateDefinitionType
} from "@ic3/reporting-api";
import {Typography} from "@mui/material";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {styled} from "@mui/material/styles";
import img from "./img/kpiCard.png"

/**
 * This might be overloaded in a theme
 */
const LocalRoot = styled('div', {
    name: "MyCharts-KpiCard",
    slot: 'Root',
    overridesResolver: (props, styles) => {
        return styles.root;
    }
})(({theme}) => ({

        height: "100%",
        width: "100%",
        paddingTop: theme.spacing(1),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        position: "relative",

        "& .MyCharts-KpiCard-title": {
            color: theme.palette.primary.contrastText,
        },
        "& .MyCharts-KpiCard-value": {
            color: theme.palette.primary.contrastText,
            marginBottom: theme.spacing(2),
        },
        "& .MyCharts-KpiCard-info": {
            display: "flex",
            alignItems: "center",
            position: "absolute",
            bottom: 0,
        },
        "& .MyCharts-KpiCard-percent": {
            fontWeight: theme.typography.h1.fontWeight,
            display: "flex",
            alignItems: "center",
        },
        "& .MyCharts-KpiCard-percentZero": {
            color: theme.palette.primary.contrastText,
        },
        "& .MyCharts-KpiCard-percentUp": {
            color: theme.palette.success.main,
        },
        "& .MyCharts-KpiCard-percentDown": {
            color: theme.palette.error.main,
        },
        "& .MyCharts-KpiCard-text": {
            color: theme.palette.primary.contrastText,
            marginLeft: theme.spacing(1),
        },
    })
);

function KpiCard(context: IWidgetPublicContext, data: IWidgetTemplateTidyData, options: KpiCardOptions, header: string) {

    const table = data.table;

    const valueSeries = table.getColumnByAlias('value');

    const currentValue = valueSeries.is(TidyColumnsType.NUMERIC) ? valueSeries.getValue(0) : null;
    const previousValue = valueSeries.is(TidyColumnsType.NUMERIC) ? valueSeries.getValue(1) : null;

    const formattedValue = valueSeries.getFormattedValueOrValue(0);

    const compareSeries = table.getColumnByAlias('compare');
    const prevInfo = compareSeries.getMdxInfo(1);
    const prevCaption = prevInfo?.caption ?? prevInfo?.name ?? "-";

    let diffPercent: number | null = null;
    let diffIcon = null;
    let diffClass = "MyCharts-KpiCard-percentZero";

    if (currentValue != null && previousValue != null) {
        diffPercent = (currentValue - previousValue) / previousValue * 100;
    }

    if (diffPercent != null && isFinite(diffPercent)) {
        if (diffPercent > 0) {
            diffIcon = <ArrowDropUpIcon/>;
            diffClass = "MyCharts-KpiCard-percentUp";
        } else if (diffPercent < 0) {
            diffIcon = <ArrowDropDownIcon/>;
            diffClass = "MyCharts-KpiCard-percentDown";
        }
    } else {
        diffPercent = null;
    }

    return (
        <LocalRoot variant={options.variant}>

            <Typography variant="subtitle2" paragraph={true} className={"MyCharts-KpiCard-title"}>
                {header ?? ""}
            </Typography>

            <Typography variant="h3" className={"MyCharts-KpiCard-value"}>
                <span>{formattedValue}</span>
            </Typography>

            <Typography variant="caption" paragraph={true} className={"MyCharts-KpiCard-info"}>
                <span className={"MyCharts-KpiCard-percent" + " " + diffClass}>
                    {diffIcon}
                    <span title={"" + (diffPercent ?? "")}>
                        <span>{(diffPercent != null) ? formatPercent(diffPercent) : '-'}</span>
                    </span>
                </span>
                <span className={"MyCharts-KpiCard-text"}>
                    {options.comparisonText.replace("{0}", prevCaption) || ""}
                </span>
            </Typography>

        </LocalRoot>
    );
}

function formatPercent(x: number): string {
    const rounded = Math.round(x * Math.pow(10, 1)) / Math.pow(10, 1);
    return (x > 0 ? "+" : "") + rounded + '%';
}

/**
 * The options (possibly edited and/or from the theme) of this widget.
 */
interface KpiCardOptions extends FormFieldObject {

    variant?: string;

    /**
     * The meta information is defining a default value to ensure there is always
     * a value when rendering the widget.
     *
     * @see kpiCardOptionsMeta
     */
    comparisonText: string;

    value: TidyTableColumnSelector;
    compare: TidyTableColumnSelector;

}

function kpiCardOptionsMeta(): FormFields<KpiCardOptions> {
    return {
        /**
         * You can add variants in the theme to the KpiCard widget
         *
         * @see Theme example for more information
         */
        "variant": {
            fieldType: "widgetVariant",
            editorConf: {
                componentName: "MyCharts-KpiCard"
            }
        },
        "value": {
            fieldType: "columnsChooser",
            editorConf: {
                allowedTypes: [TidyColumnsType.NUMERIC],
                fallback: true,
            },
            defaultValue: "" as any,
        },
        "compare": {
            fieldType: "columnsChooser",
            editorConf: {
                allowedTypes: [TidyColumnsType.CHARACTER],
                fallback: true,
            },
            defaultValue: "" as any,
        },
        "comparisonText": {
            fieldType: "string",
            defaultValue: "compared to {0}",
        }
    };
}

export const KpiCardDefinition: IPublicWidgetReactTemplateDefinition<KpiCardOptions> = {

    type: WidgetTemplateDefinitionType.Filter,

    /**
     * @see PluginLocalization.csv
     */
    id: "KpiCard",
    groupId: "myChartsReact",

    image: img,

    withoutHeader: true,
    withoutSelection: true,
    withoutDrilldown: true,
    withoutUserMenu: true,

    /**
     * Graphical MDX query builder meta information.
     */
    mdxBuilderSettings: {
        mdxAxis: [
            {
                name: "value",
                disableNonEmpty: true,
                mdxAxisName: "value",
            },
            {
                name: "compare",
                disableNonEmpty: true,
                mdxAxisName: "compare",
            },
        ]
    },

    chartOptionsMeta: kpiCardOptionsMeta(),

    reactComponent: true,

    jsCode: (context): IPublicReactChartTemplate<KpiCardOptions> => {
        return {
            reactElement: (data, options, header) => KpiCard(context, data, options, header)
        }
    },

}

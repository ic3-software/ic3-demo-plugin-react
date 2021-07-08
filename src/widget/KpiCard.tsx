import React from "react";
import {
    FormFieldObject,
    FormFields,
    IPublicWidgetReactTemplateDefinition,
    IWidgetPublicContext,
    IWidgetTemplateDataMappingDef,
    IWidgetTemplateTidyData,
    TidyColumnsType,
    WidgetTemplateDefinitionType
} from "@ic3/reporting-api";
import {Theme, Typography} from "@material-ui/core";
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles((theme: Theme) => {
    return {
        root: {
            height: "100%",
            width: "100%",
            backgroundColor: theme.palette.primary.light,
            paddingTop: theme.spacing(1),
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
            position: "relative",
        },
        title: {
            color: theme.palette.primary.contrastText,
        },
        value: {
            color: theme.palette.primary.contrastText,
            marginBottom: theme.spacing(2),
        },
        info: {
            display: "flex",
            alignItems: "center",
            position: "absolute",
            bottom: 0,
        },
        percent: {
            fontWeight: theme.typography.h1.fontWeight,
            display: "flex",
            alignItems: "center",
        },
        percentZero: {
            color: theme.palette.primary.contrastText,
        },
        percentUp: {
            color: theme.palette.success.main,
        },
        percentDown: {
            color: theme.palette.error.main,
        },
        text: {
            color: theme.palette.primary.contrastText,
            marginLeft: theme.spacing(1),
        },
    }
});

function KpiCard(context: IWidgetPublicContext, data: IWidgetTemplateTidyData, options: KpiCardOptions, header: string) {

    const classes = useStyles();

    const table = data.table;

    const valueSeries = table.getNumericColumnByAlias('value');

    const currentValue = valueSeries.getValue(0);
    const previousValue = valueSeries.getValue(1);

    const formattedValue = valueSeries.getFormattedValueOrValue(0);

    const compareSeries = table.getColumnByAlias('compare');
    const prevInfo = compareSeries.getMdxInfo(1);
    const prevCaption = prevInfo?.caption ?? prevInfo?.name ?? "-";

    let diffPercent: number | null = null;
    let diffIcon = null;
    let diffClass = classes.percentZero;

    if (currentValue != null && previousValue != null) {
        diffPercent = (currentValue - previousValue) / previousValue * 100;
    }

    if (diffPercent != null && isFinite(diffPercent)) {
        if (diffPercent > 0) {
            diffIcon = <ArrowDropUpIcon/>;
            diffClass = classes.percentUp;
        } else if (diffPercent < 0) {
            diffIcon = <ArrowDropDownIcon/>;
            diffClass = classes.percentDown;
        }
    } else {
        diffPercent = null;
    }

    return (
        <div className={classes.root}>

            <Typography variant="subtitle2" paragraph={true} className={classes.title}>
                {header ?? ""}
            </Typography>

            <Typography variant="h3" className={classes.value}>
                <span>{formattedValue}</span>
            </Typography>

            <Typography variant="caption" paragraph={true} className={classes.info}>
                <span className={classes.percent + " " + diffClass}>
                    {diffIcon}
                    <span title={"" + (diffPercent ?? "")}>
                        <span>{(diffPercent != null) ? formatPercent(diffPercent) : '-'}</span>
                    </span>
                </span>
                <span className={classes.text}>
                    {options.comparisonText.replace("{0}", prevCaption) || ""}
                </span>
            </Typography>

        </div>
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

    /**
     * The meta information is defining a default value to ensure there is always
     * a value when rendering the widget.
     *
     * @see kpiCardOptionsMeta
     */
    comparisonText: string;

}

function kpiCardOptionsMeta(): FormFields<KpiCardOptions> {
    return {
        "comparisonText": {
            fieldType: "string",
            defaultValue: "compared to {0}",
        }
    };
}


function kpiCardDataMappingMeta(): IWidgetTemplateDataMappingDef[] {
    return [{
        mappingName: "value",
        allowedTypes: [TidyColumnsType.NUMERIC],
        fallback: true,
        mandatory: true
    }, {
        mappingName: "compare",
        allowedTypes: [TidyColumnsType.CHARACTER],
        fallback: true,
        mandatory: true
    }];
}


export const KpiCardDefinition: IPublicWidgetReactTemplateDefinition<KpiCardOptions> = {

    type: WidgetTemplateDefinitionType.Filter,

    /**
     * @see PluginLocalization.csv
     */
    id: "KpiCard",

    /**
     * @see PluginLocalization.csv
     */
    groupId: "myCharts",

    image: "",

    withoutHeader: true,
    withoutSelection: true,
    withoutDrilldown: true,
    withoutUserMenu: true,

    dataMappingMeta: kpiCardDataMappingMeta(),
    chartOptionsMeta: kpiCardOptionsMeta(),

    reactComponent: true,

    jsCode: (context) => {
        return {
            reactElement: (data, options, header) => {
                return KpiCard(context, data, options, header);
            }
        }
    },

}

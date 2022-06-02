import * as React from 'react';
import {styled} from '@mui/material/styles';
import {
    FormFieldObject,
    FormFields,
    ILocalizationContext,
    IPublicContext,
    ITidyTableTransformation,
    TidyTableColumnSelector,
} from "@ic3/reporting-api";
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
        color: '#ff6d75',
    },
    '& .MuiRating-iconHover': {
        color: '#ff3d47',
    },
});

interface TemplateOptions extends FormFieldObject {
    columns: TidyTableColumnSelector[];
}

export const TransfRendererCustom: ITidyTableTransformation<TemplateOptions> = {

    id: "TransfRendererCustom",
    groupId: "transformation.cellRenderer",

    getFieldMeta(): FormFields<TemplateOptions> {
        return {
            'columns': {
                fieldType: 'columnsChooser',
                mandatory: true,

                editorConf: {
                    multiple: true,
                    includeSelectors: true
                }
            },
        }
    },

    getDescription(context: ILocalizationContext, options: TemplateOptions): string {
        return context.localizeDescriptionEx(context, this.getFieldMeta(), options, 'columns');
    },

    apply(context: IPublicContext, table, options: TemplateOptions): void {


        const math = table.getMath();
        let min: number | undefined = undefined;
        let max: number | undefined = undefined;

        table.getColumnsBySelector(options.columns).forEach(column => {

            const localMin = math.min(column);
            const localMax = math.max(column);
            min = min == null ? localMin : Math.min(min, localMin);
            max = max == null ? localMax : Math.max(max, localMax);

        });

        table.getColumnsBySelector(options.columns).forEach(column => {

            if (column != null) {


                column.setCellDecoration({
                    renderer: (rowIdx: number) => {
                        /**
                         * for the pivot table React node is converted into a string (html)
                         *
                         * so, adding effects will not work
                         */
                        const cellValue = column.getValue(rowIdx);
                        if (cellValue == null)
                            return <></>;

                        const scale = (math.scaleNormalize(column, rowIdx, min, max, undefined) ?? 0) * 5;
                        return <div title={(cellValue ?? "") + "₿ - [" + min + ", " + max + "]"}>
                            <StyledRating
                                size="small"
                                readOnly
                                defaultValue={scale}
                                precision={0.25}
                                max={4}
                                icon={<FavoriteIcon fontSize="inherit"/>}
                                emptyIcon={<FavoriteBorderIcon fontSize="inherit"/>}/>
                        </div>;
                    },
                });
            }

        });

    }
}

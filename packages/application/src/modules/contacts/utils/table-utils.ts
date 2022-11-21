import { CompositeFilterDescriptor } from '@servicetitan/data-query';

export const getFilterSet = (filters: { column: string; value: string }[]) => {
    const result: CompositeFilterDescriptor = {
        logic: 'or',
        filters: filters.map(filter => ({
            field: filter.column,
            value: filter.value,
            operator: 'contains',
        })),
    };

    return result;
};

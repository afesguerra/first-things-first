import { Table, TableProps } from "@cloudscape-design/components";
import { useState } from "react";

type Comparator<T> = (a: T, b: T) => number;

export interface EnhancedTableProps<T> extends Omit<TableProps<T>, 'sortingColumn' | 'sortingDescending' | 'onSortingChange'> {
    /**
     *
     * @param comparator Comparator function to be used to sort items
     */
    onSortingChange?: (comparator?: Comparator<T>) => void
}

const comparatorSort = <T, >(comparator?: Comparator<T>, descending = false): Comparator<T> | undefined =>
    comparator && ((a: T, b: T) => comparator(a, b) * (descending ? -1 : 1));

const fieldSort = <T, >(key?: keyof T, descending = false): Comparator<T> | undefined =>
    key && comparatorSort((a: T, b: T) => a[key] === b[key] ? 0 : (a[key] > b[key] ? 1 : -1), descending);

const compareFn = <T, >(state: TableProps.SortingState<T>): Comparator<T> | undefined =>
    comparatorSort(state.sortingColumn.sortingComparator, state.isDescending)
    ?? fieldSort(state.sortingColumn.sortingField as keyof T, state.isDescending);

const EnhancedTable = <T, >({ onSortingChange, ...props }: EnhancedTableProps<T>) => {
    const [descending, setDescending] = useState<boolean | undefined>(false);
    const [sortingColumn, setSortingColumn] = useState<TableProps.SortingColumn<T> | undefined>({});

    return <Table<T>
        sortingDescending={descending}
        sortingColumn={sortingColumn}
        onSortingChange={({ detail }) => {
            setDescending(detail.isDescending)
            setSortingColumn(detail.sortingColumn);
            onSortingChange && onSortingChange(compareFn(detail));
        }}
        {...props}
    />
};

export default EnhancedTable;

import {
    Button,
    ContentLayout,
    Header,
    Input,
    SpaceBetween,
    TableProps,
} from "@cloudscape-design/components";
import { useState } from "react";
import EnhancedTable from "./components/EnhancedTable.tsx";
import { Criteria } from "./model.ts";

const numberEditConfig = (k: keyof Criteria): TableProps.EditConfig<Criteria> => ({
    validation: (item) => item[k] === undefined ? 'Not defined' : undefined,
    editingCell: (item, { currentValue, setValue }) =>
        <Input
            type={"number"}
            inputMode={"numeric"}
            autoFocus={true}
            value={currentValue ?? item[k]}
            onChange={event => {
                setValue(event.detail.value ?? item[k]);
            }}
        />,
});

const CriteriaTable = () => {
    const [criteria, setCriteria] = useState<Criteria[]>([]);

    const weight = (c: Criteria): number => (c.benefit + c.penalty) / (c.cost + c.risk)

    const add = () => setCriteria(prev => [...prev, {
        id: crypto.randomUUID(),
        name: 'New criteria',
        benefit: 1,
        penalty: 1,
        cost: 1,
        risk: 1,
    }]);

    const remove = (item: Criteria) => setCriteria(prev => prev.filter(i => i.id !== item.id));

    return <ContentLayout disableOverlap={true}>
        <EnhancedTable<Criteria>
            enableKeyboardNavigation
            items={criteria}
            onSortingChange={comparator => setCriteria(prev => prev.toSorted(comparator))}
            columnDefinitions={[{
                id: 'name',
                header: 'Name',
                isRowHeader: true,
                cell: (item) => <strong>{item.name}</strong>,
                sortingField: 'name',
                editConfig: {
                    validation: (item) => item.name === undefined ? 'Not defined' : undefined,
                    editingCell: (item, { currentValue, setValue }) =>
                        <Input
                            autoFocus={true}
                            value={currentValue ?? item.name}
                            onChange={event => setValue(event.detail.value)}
                        />,
                },
            }, {
                id: 'benefit',
                header: 'Benefit',
                cell: (item) => item.benefit,
                editConfig: numberEditConfig('benefit'),
            }, {
                id: 'penalty',
                header: 'Penalty',
                cell: (item) => item.penalty,
                editConfig: numberEditConfig('penalty'),
            }, {
                id: 'cost',
                header: 'Cost',
                cell: (item) => item.cost,
                editConfig: numberEditConfig('cost'),
            }, {
                id: 'risk',
                header: 'Risk',
                cell: (item) => item.risk,
                editConfig: numberEditConfig('risk'),
            }, {
                id: 'weight',
                header: 'Weight',
                cell: (item) => <code>{weight(item)}</code>,
                sortingComparator: (i1, i2) => weight(i1) - weight(i2),
            }, {
                id: "actions",
                header: "Actions",
                cell: item => (
                    <Button
                        variant="icon"
                        iconName={'remove'}
                        ariaLabel={'Delete'}
                        onClick={() => remove(item)}
                    />
                ),
            }]}
            header={<Header
                actions={<SpaceBetween direction="horizontal" size="xs">
                    <Button variant="primary" onClick={add}> Add New </Button>
                </SpaceBetween>}
            >
                Criteria
            </Header>}
            submitEdit={(item, column, newValue) => {
                setCriteria(prev => prev.map(c => c.id !== item.id ? c : {
                    ...c,
                    [column.id as keyof Criteria]: column.id === 'name' ? (newValue as string) : +(newValue as string),
                }))
            }}
        />
    </ContentLayout>;
}

export default CriteriaTable;

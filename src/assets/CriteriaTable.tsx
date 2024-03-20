import {
    Button,
    ContentLayout,
    Header,
    Input,
    SpaceBetween,
    Table,
    TableProps,
} from "@cloudscape-design/components";
import { useState } from "react";
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

    const add = () => setCriteria(prev => [...prev, {
        id: crypto.randomUUID(),
        name: 'New criteria',
        benefit: 1,
        penalty: 1,
        cost: 1,
        risk: 1,
    }]);

    const remove = (item: Criteria) => setCriteria(prev => prev.filter(i => i.id !== item.id));

    return <ContentLayout disableOverlap={false}>
        <Table<Criteria>
            enableKeyboardNavigation
            items={criteria}
            columnDefinitions={[{
                id: 'rank',
                header: 'Rank',
                cell: () => 1,
            }, {
                id: 'name',
                header: 'Name',
                cell: (item) => item.name,
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

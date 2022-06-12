import {useSave} from "../../logic/VickySavesProvider";
import {AgGridReact} from "ag-grid-react";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import {ColDef, ColGroupDef} from "ag-grid-community/dist/lib/entities/colDef";
import _ from "lodash";
import {MouseEventHandler, useCallback, useEffect, useLayoutEffect, useMemo, useState} from "react";
import {ColumnApi, GridApi, GridReadyEvent} from "ag-grid-community";
import {VickyMinorButton} from "../../components/VickyButton";

interface DataExporterProps {
  field: "factories" | "pops"
}

export default function DataExporter(props: DataExporterProps) {
  const save = useSave().state.save!;
  const factories = save[props.field];
  const [gridApi, setGridApi] = useState<GridApi | undefined>(undefined);

  const fields: (ColDef | ColGroupDef)[] = useMemo(() => {
    return Array.from(new Set(factories.flatMap(Object.keys))).map(x => {
      const sampleIndex = factories.findIndex(f => f[x] !== undefined);
      let filter: true | string = true;
      if (sampleIndex !== -1) {
        const sample = factories[sampleIndex][x]!;
        if (_.isNumber(sample)) {
          filter = "agNumberColumnFilter";
        } else if (_.isDate(sample)) {
          filter = "agDateColumnFilter";
        }
      }
      return {
        field: x,
        filter: filter,
      }
    }).sort((a, b) => {
      const first = _.isUndefined(factories[0][a.field]);
      return first === _.isUndefined(factories[0][b.field]) ? 0 : first ? 1 : -1;
    });
  }, [factories]);

  const defaultDef: ColDef = {
    cellRenderer: (params: { value: any; }) => {
      // put the value in bold
      if (_.isString(params.value)) {
        return params.value;
      } else if (_.isUndefined(params.value)) {
        return "";
      } else if (_.isObject(params.value)) {
        return JSON.stringify(params.value);
      }
      return String(params.value);
    },
    cellStyle: {
      textAlign: "leading"
    },
    // checkboxSelection: true,
    // headerCheckboxSelection: true,
    // headerCheckboxSelectionFilteredOnly: true,
    floatingFilter: true,
    sortable: true,
  };

  const download: MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    gridApi?.exportDataAsCsv({fileName: `${props.field}.csv`});
  }, [gridApi, props.field]);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
  }, []);

  return (
    <>
      <VickyMinorButton onClick={download}>
        Download table as CSV
      </VickyMinorButton>
      <div style={{ display: "table", width: '100%', height: '80vh', flexGrow: 1 }} className="ag-theme-balham-dark">
        <div style={{display: "table-cell"}}>
        <AgGridReact
          rowData={save[props.field]}
          columnDefs={fields}
          defaultColDef={defaultDef}
          animateRows={true}
          cacheQuickFilter={true}
          rowSelection='multiple'
          rowMultiSelectWithClick={true}
          groupSelectsChildren={true}
          groupSelectsFiltered={true}
          onGridReady={params => onGridReady(params)}
          // onFirstDataRendered={params => params.columnApi.autoSizeAllColumns(false)}
        >
        </AgGridReact>
        </div>
      </div>
    </>
  );
}
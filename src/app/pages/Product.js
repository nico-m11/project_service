/* eslint-disable no-restricted-imports */
// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import { element } from "prop-types";
import React, { useEffect, useMemo, useState } from "react";

import { useSelector, shallowEqual, connect, useDispatch } from "react-redux";
import {
  SortingState,
  IntegratedSorting,
  PagingState,
  IntegratedPaging,
  FilteringState,
  IntegratedFiltering
} from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableColumnResizing,
  PagingPanel,
  TableFilterRow
} from "@devexpress/dx-react-grid-bootstrap4";
import "@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css";

import config from "../../config/config";

export function Product() {
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [dataProduct, setDataProduct] = useState([]);
  useEffect(() => {
    GetData();
  }, []);

  function GetData() {
    setLoading(true);
    const requestOptions = {
      headers: {
        Authorization:
          "271c4d716fcf0e9555b51cffed666b4321f98f7f8bbeb9ae8bfc67752b4db8a2",
      },
      method: "GET",
    };

    fetch(
      //config.apiUrl + "",
      'https://jsonplaceholder.typicode.com/posts',
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setLoading(false);
        setDataProduct(result);
      });
  }

  console.log(dataProduct)

  const [sorting, setSorting] = useState([{ columnName: "", direction: "" }]);

  const [columns] = useState([
    { name: "title", title: "title" },
    { name: "body", title: "body" },
  ]);
  const [defaultColumnWidths] = useState([
    { columnName: "title", width: 150 },
    { columnName: "body", width: 700 },
  ]);

  return (
    <>
     <div className="card">
      <Grid
        rows={dataProduct}
        columns={columns}
      >
        <PagingState
          defaultCurrentPage={0}
          pageSize={15}
        />
        <IntegratedPaging />
        <SortingState
          sorting={sorting}
          onSortingChange={setSorting}
        />
        <IntegratedSorting />
        <FilteringState defaultFilters={[]} />
        <IntegratedFiltering />
        <Table />
        <TableColumnResizing 
          defaultColumnWidths={defaultColumnWidths} 
        />
        <TableHeaderRow />
        <TableFilterRow />
        <PagingPanel />
      </Grid>
      </div>
    </>
  );
}

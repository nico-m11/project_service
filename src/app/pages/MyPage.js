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
  IntegratedPaging
} from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableColumnResizing,
  PagingPanel,
} from "@devexpress/dx-react-grid-bootstrap4";
import "@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css";

import config from "../../config/config";

export function MyPage() {
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
      config.apiUrl + "products/GetAllProductsFromDescriptionAndReference.php",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setLoading(false);
        setDataProduct(result);
      });
  }

  const [sorting, setSorting] = useState([{ columnName: "", direction: "" }]);

  const [columns] = useState([
    { name: "ean13", title: "Ean13" },
    { name: "name", title: "Nome" },
    { name: "price", title: "Prezzo" },
    { name: "wholesale_price", title: "wholesale_price" },
    { name: "reference", title: "reference" }

  ]);


  const [defaultColumnWidths] = useState([
    { columnName: "ean13", width: 150 },
    { columnName: "name", width: 250 },
    { columnName: "price", width: 150 },
    { columnName: "wholesale_price", width: 250 },
    { columnName: "reference", width: 150 },
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
        <Table />
        <TableColumnResizing 
          defaultColumnWidths={defaultColumnWidths} 
        />
        <TableHeaderRow />
        <PagingPanel />
      </Grid>
      </div>
    </>
  );
}

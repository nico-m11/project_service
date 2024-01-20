/* eslint-disable no-restricted-imports */
import React, { useMemo } from "react";
import objectPath from "object-path";
import { useHtmlClassService } from "../../layout";
import { Card, Table, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, shallowEqual, connect, useDispatch } from "react-redux";
import * as auth from "./../../../app/modules/Auth";
import PrintProvider, { Print, NoPrint } from "react-easy-print";
import { createRef } from "react";
import html2canvas from "html2canvas";
import { func } from "prop-types";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Center } from "devextreme-react/map";

export function Dashboard() {

  const user = useSelector((state) => state.auth.user);
  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;



  console.log(user)
  return (
    <>
      <div className="container mt-2 mb-2">
        <div className="row">
          <h1>DashBoard</h1>
        </div>

     
      </div>



    </>


  )
}

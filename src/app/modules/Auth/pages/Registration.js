/* eslint-disable react/jsx-no-undef */

/* eslint-disable no-restricted-imports */

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { connect, useSelector } from "react-redux";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { register } from "../_redux/authCrud";
import { Button, Card, Form } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import { check } from "prettier";
import { useRef } from "react";
import { set } from "lodash";
import config from "../../../../config/config";
import swal from "sweetalert";


//Valori iniziali quando viene inizializzato il form
const initialValues = {
  email: "",
  username: "",
  password: "",
  name: "",
  role: 0
};

function Registration(props) {
  const user = useSelector((state) => state.auth.user);
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const [dataOrder, setDataOrder] = useState([]);
  console.log(dataOrder);
  useEffect(() => {
    //GetData();
  }, []);

  function GetData() {
    setLoading(true);
    const requestOptions = {
      headers: {
        Authorization:
          "271c4d716fcf0e9555b51cffed666b4321f98f7f8bbeb9ae8bfc67752b4db8a2"
      },
      method: "GET"
    };

    fetch(config.apiUrl + "users/GetRole.php", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setLoading(false);
        setDataOrder(result);
      });
  }

  // Settare tutte le variabili richieste con valore minimo massimo e se e un numero o una stringa
  const RegistrationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required("Inserisci Username"),
    email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required("Inserisci E-mail"),
    name: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required("Inserisci Nome"),
    password: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required("Inserisci una password")
  });

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const formik = useFormik({
    initialValues,
    validationSchema: RegistrationSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      console.log(values.role);
      const requestOptions = {
        headers: {
          Authorization:
            "271c4d716fcf0e9555b51cffed666b4321f98f7f8bbeb9ae8bfc67752b4db8a2"
        },
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          name: values.name,
          username: values.username,
          role: 1
        })
      };

      fetch(config.apiUrl + "users/CreateUser.php", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          swal({
              title: "Utente aggiunto!",
              text: "OK",
              icon: "success",
              type: "Success"
            }
          ).then(function() {
            window.location.reload();
          });
        }).catch(() => {
        setLoading(false);
        setSubmitting(false);
      });
    }
  });


  return (
    <div className="login-form login-signin" style={{ display: "block" }}>
      <div className="text-center mb-10 mb-lg-20">
        <h3 className="font-size-h1">
          <FormattedMessage id="AUTH.REGISTER.TITLE" />
        </h3>
        <p className="text-muted font-weight-bold">
          Enter your details to create your account
        </p>
      </div>

      <div className="login-form login-signin" style={{ display: "block" }}>
        <div className="text-center mb-10 mb-lg-20">
          <h3 className="font-size-h1">Crea Utente</h3>{" "}
        </div>
        <form
          id="kt_login_signin_form"
          className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp"
          onSubmit={formik.handleSubmit}
        >

          {/* begin: Email */}
          <div className="form-group fv-plugins-icon-container">
            <input
              placeholder="Email"
              type="email"
              className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                "email"
              )}`}
              name="email"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.email}</div>
              </div>
            ) : null}
          </div>
          {/* end: Email */}

          {/* begin: Username */}
          <div className="form-group fv-plugins-icon-container">
            <input
              placeholder="User name"
              type="text"
              className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                "username"
              )}`}
              name="username"
              {...formik.getFieldProps("username")}
            />
            {formik.touched.username && formik.errors.username ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.username}</div>
              </div>
            ) : null}
          </div>
          {/* end: Username */}

          {/* begin: Username */}
          <div className="form-group fv-plugins-icon-container">
            <input
              placeholder="Nome"
              type="text"
              className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                "name"
              )}`}
              name="name"
              {...formik.getFieldProps("name")}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.name}</div>
              </div>
            ) : null}
          </div>
          {/* end: Username */}

          {/* begin: Password */}
          <div className="form-group fv-plugins-icon-container">
            <input
              placeholder="Password"
              type="password"
              className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                "password"
              )}`}
              name="password"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.password}</div>
              </div>
            ) : null}
          </div>
          {/* end: Password */}

          <div className="form-group d-flex flex-wrap flex-center">
            <button
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid}
              className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4"
              style={{ background: "#2f2d77", color: "#ffffff" }}
            >
              <span>Crea utente</span>
              {loading && <span className="ml-3 spinner spinner-white"></span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(Registration));

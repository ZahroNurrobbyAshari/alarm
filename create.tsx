import React, { useState, useRef } from "react";
import { FormikValues, useFormik } from "formik";
import classNames from "classnames";
import * as Yup from "yup";
import axios from "axios";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { InputSwitch } from "primereact/inputswitch";
import { Calendar } from "primereact/calendar";

import Title from "../../components/Title";
import { InputNumber } from "primereact/inputnumber";

const Create = () => {
  const token = "s";
  const [loading, setLoading] = useState<boolean>(false);

  const discountTypes = [
    { name: "Percentage", value: "percentage" },
    { name: "Fixed", value: "fixed" },
  ];
  const operator = [
    { name: "less than", value: "<" },
    { name: "less than or equals to", value: "<=" },
    { name: "equals to", value: "=" },
    { name: "more than or equals to", value: ">=" },
    { name: "more than", value: ">" },
  ];

  // handle form

  let onSubmit = async (values: FormikValues, onSubmitProps) => {
    onSubmitProps.setSubmitting(false);
    try {
      const response = await axios.post(
        "/api/marketing/discount/create",
        values
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const validationSchema = Yup.object({
    discountName: Yup.string().required("This field is required!"),
    discountType: Yup.string().required("This field is required!"),
    discount: Yup.string().required("This field is required!"),
    operator: Yup.string().oneOf(["<", "<=", "==", ">=", ">"]),
    value: Yup.string(),
    active: Yup.boolean().required("This field is required!"),
    started_at: Yup.date().required("This field is required"),
    expired_at: Yup.date(),
  });

  const formik = useFormik({
    initialValues: {
      discountName: "",
      discountType: "",
      discount: "",
      condition: {
        operator: null,
        value: "",
      },
      active: true,
      started_at: new Date(),
      expired_at: null,
    },
    onSubmit,
    validationSchema,
  });

  const isFormFieldInvalid = (field: any) =>
    !!(formik.touched[field] && formik.errors[field]);

  const getFormErrorMessage = (field: any) => {
    return isFormFieldInvalid(field) ? (
      <small className="p-error">{formik.errors[field]}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );
  };
  // end handle form

  return (
    <>
      <Title title="Create New Price Rule" />
      <div className="card">
        <form onSubmit={formik.handleSubmit} method="post">
          {/* Field Name */}
          <div className="field grid">
            <label htmlFor="name" className="col-12 mb-2 md:col-2 md:mb-0">
              Name <span className="text-orange-500">*</span>
            </label>
            <div className="col-12 md:col-10">
              <InputText
                id="name"
                type="text"
                placeholder="Price Rule Name"
                className={` ${
                  isFormFieldInvalid("discountName")
                    ? "p-invalid w-full"
                    : "w-full"
                } `}
                {...formik.getFieldProps("discountName")}
              />
              {getFormErrorMessage("discountName")}
            </div>
          </div>
          {/* end field name */}
          {/* field discount Type */}
          <div className="field grid">
            <label className="col-12 mb-2 md:col-2 md:mb-0">
              Type <span className="text-orange-500">*</span>
            </label>
            <div className="col-12 md:col-10">
              <Dropdown
                type="select"
                options={discountTypes}
                optionLabel="name"
                placeholder="Select a Type Price Rule"
                className={` ${
                  isFormFieldInvalid("discountType")
                    ? "p-invalid w-full"
                    : "w-full"
                } `}
                {...formik.getFieldProps("discountType")}
              />
              {getFormErrorMessage("discountType")}
            </div>
          </div>
          {/* end field discount type */}
          {/* field discount */}
          <div className="field grid">
            <label htmlFor="discount" className="col-12 mb-2 md:col-2 md:mb-0">
              Discount <span className="text-orange-500">*</span>
            </label>
            <div className="col-12 md:col-10">
              <InputText
                type="number"
                id="discount"
                inputMode="decimal"
                placeholder="Please input 1-100 for price rule type percentage and all integer for price rule type fixed"
                className={` ${
                  isFormFieldInvalid("discount") ? "p-invalid w-full" : "w-full"
                } `}
                {...formik.getFieldProps("discount")}
              />
              {getFormErrorMessage("discount")}
            </div>
          </div>
          {/* end discount */}
          {/* field condition */}
          <div className="field grid">
            <label className="col-12 mb-2 md:col-2 md:mb-2">Condition</label>
            <div className="col-12 md:col-10">
              <InputText className="mr-5" disabled value="Subtotal" />
              <Dropdown
                options={operator}
                optionLabel="name"
                placeholder="Select an Operator Condition"
                className={` ${
                  isFormFieldInvalid("condition.operator")
                    ? "p-invalid w-full md:w-14rem"
                    : "w-full md:w-14rem"
                } `}
                {...formik.getFieldProps("condition.operator")}
              />
              {getFormErrorMessage("condition.operator")}

              <InputText
                type="number"
                className={` ${
                  isFormFieldInvalid("condition.operator")
                    ? "p-invalid w-full md:w-14rem "
                    : "w-full md:w-14rem "
                } `}
                inputMode="decimal"
                aria-label="Please input 1-100 for price rule type percentage and all integer for price rule type fixed"
                {...formik.getFieldProps("condition.value")}
              />
              {getFormErrorMessage("condition.value")}
            </div>
          </div>
          {/* end field condition */}
          {/* field status */}
          <div className="field grid">
            <label htmlFor="active" className="col-12 mb-2 md:col-2 md:mb-0">
              Active <span className="text-orange-500">*</span>
            </label>
            <div className="col-12 md:col-10">
              <InputSwitch
                id="active"
                name="active"
                checked={formik.values.active}
                onChange={(e) => {
                  formik.setFieldValue("active", e.value);
                }}
                className={classNames({
                  "p-invalid": isFormFieldInvalid("active"),
                })}
              />
              {getFormErrorMessage("active")}
            </div>
          </div>
          {/* end field status */}
          {/* field started at */}
          <div className="field grid">
            <label
              htmlFor="started_at"
              className="col-12 mb-2 md:col-2 md:mb-0"
            >
              Started at <span className="text-orange-500">*</span>
            </label>
            <div className="col-12 md:col-10">
              <Calendar
                inputId="started_at"
                name="started_at"
                value={formik.values.started_at}
                className={classNames({
                  "p-invalid": isFormFieldInvalid("started_at"),
                })}
                onChange={(e) => {
                  formik.setFieldValue("started_at", e.target.value);
                }}
                showIcon
              />
              {getFormErrorMessage("started_at")}
            </div>
          </div>
          {/* end field started at */}
          {/* field expired at */}
          <div className="field grid">
            <label
              htmlFor="expired_at"
              className="col-12 mb-2 md:col-2 md:mb-0"
            >
              Expired at
            </label>
            <div className="col-12 md:col-10">
              <Calendar
                inputId="expired_at"
                name="expired_at"
                value={formik.values.expired_at}
                className={classNames({
                  "p-invalid": isFormFieldInvalid("expired_at"),
                })}
                onChange={(e) => {
                  formik.setFieldValue("expired_at", e.target.value);
                }}
                showIcon
              />
              {getFormErrorMessage("expired_at")}
            </div>
          </div>
          {/* end field expired at */}
          <Button
            className="w-full mt-5"
            disabled={!formik.isValid || formik.isSubmitting}
            label="Submit"
            type="submit"
          />
        </form>
      </div>
    </>
  );
};

export default Create;

import React, { useEffect, useRef, useState } from "react";
import { Alert, Col, Flex, Row, Spin } from "antd";
import { Formik } from "formik";
import { Button, DatePicker, Input, Select } from "antd";
// import CustomMultiSelect from "../../../../CustomMultiSelect";
import "@syncfusion/ej2-react-grids/styles/material.css";
function dateFormatterDayJs(params, format) {
  return params ? dayjs(params).format(format ?? "DD/MM/YYYY") : "";
}

const filterOptions = {
  string: [
    { value: "contains", label: "Contains" },
    { value: "doesnotcontain", label: "Not Contains" },
    { value: "equal", label: "Equals" },
    { value: "notEqual", label: "Not Equals" },
    { value: "startsWith", label: "Begins with" },
    { value: "endsWith", label: "Ends with" },
  ],
  2: [
    { value: "anyOf", label: "Any of" },
    { value: "noneOf", label: "None of" },
  ],
  // "3": //"CheckBox",
  date: [
    { value: "equal", label: "Equals" },
    { value: "notEqual", label: "Not Equals" },
    { value: "greaterThan", label: "After" },
    { value: "greaterThanOrEqual", label: "On or After" },
    { value: "lessthan", label: "Before" },
    { value: "lessThanOrEqual", label: "On or Before" },
    { value: "between", label: "Between" },
  ],
  5: [
    { value: "equal", label: "Equals" },
    { value: "notEqual", label: "Not Equals" },
    { value: "greaterThan", label: "After" },
    { value: "greaterThanOrEqual", label: "On or After" },
    { value: "lessThan", label: "Before" },
    { value: "lessThanOrEqual", label: "On or Before" },
  ],
  6: [
    { value: "anyOf", label: "Any of" },
    { value: "noneOf", label: "None of" },
  ],
  // "7": //"Employees",
  number: [
    { value: "equal", label: "Equals" },
    { value: "notEqual", label: "Not Equals" },
    { value: "greaterThan", label: "Greater than" },
    { value: "greaterThanOrEqual", label: "Greater than or equal to" },
    { value: "lessThan", label: "Less than" },
    { value: "lessThanOrEqual", label: "Less than or equal to" },
  ],
  9: [
    { value: "anyOf", label: "Any of" },
    { value: "noneOf", label: "None of" },
  ],
};

export default function UnyGridFilters({
  onFiltersApplied,
  appliedFilters,
  setAppliedFilters,
  taskFields,
  onResetFilters,
  reset = true,
  isUpdate = false,
  columns = [],
}) {
  const [isError, setIsError] = useState(false);
  const [resetRender, setResetRender] = useState(false);
  const setFilterData = (index, key, value) => {
    setAppliedFilters((prevFilters) => {
      let values = prevFilters[index];
      if (key === "field") {
        values = {};
        values.filterType = columns?.find((col) => col?.field === value)?.type;
      }
      values[key] = value;
      prevFilters[index] = values;
      return [...prevFilters];
    });
  };
  const addNewFilter = () => {
    let temp = [];
    if (appliedFilters) temp = [...appliedFilters];
    let lastItem = temp[temp?.length - 1];
    if (!lastItem || lastItem.field !== "") {
      temp.push({
        field: "",
        filterType: "",
        value: "",
        type: "",
      });
    }
    setAppliedFilters(temp);
  };
  const removeFilter = (index, props) => {
    if (appliedFilters?.length >= 1) {
      const temp = [...appliedFilters];
      temp.splice(index, 1);
      setAppliedFilters(temp);
      if (isUpdate) onFiltersApplied(temp);
      Object?.keys(props?.values)?.forEach((key) =>
        props?.setFieldValue(key, undefined)
      );
    }
  };
  const applyFilters = () => {
    if (!appliedFilters || appliedFilters?.length <= 0) {
      setIsError(true);
      return;
    }
    const falseArray = ["", null, undefined];
    let error = appliedFilters.some((filter) => {
      if (
        falseArray.includes(filter.field) ||
        falseArray.includes(filter.value) ||
        falseArray.includes(filter.condition)
      ) {
        return true;
      }
      return false;
    });
    if (!error) {
      onFiltersApplied(appliedFilters);
    }
    setIsError(error);
  };

  return (
    <>
      <section id="filterSection">
        <>
          <Flex justify="space-between">
            <Button
              className="mb-3"
              size="small"
              type="light"
              onClick={addNewFilter}
              icon={<em className="icon-plus" />}
            >
              Add Filter
            </Button>
            <Flex gap="small" justify="end">
              {reset && (
                <Button
                  onClick={() => {
                    setResetRender(true);
                    onResetFilters();
                  }}
                >
                  Reset
                </Button>
              )}
              <Button type="primary" onClick={applyFilters}>
                Apply
              </Button>
            </Flex>
          </Flex>
          {appliedFilters?.length === 0 && (
            <FilterdFeilds
              taskFields={taskFields}
              setFilterData={setFilterData}
              removeFilter={removeFilter}
              columns={columns}
            />
          )}
          {appliedFilters?.map((filter, index) => (
            <FilterdFeilds
              resetRender={resetRender}
              key={index}
              index={index}
              filter={filter}
              setFilterData={setFilterData}
              removeFilter={removeFilter}
              taskFields={taskFields}
              columns={columns}
            />
          ))}
        </>

        {isError && (
          <Alert
            type="error"
            message="Please fill up or remove empty the fields"
            className="mt-3"
            closable
            onClose={() => {
              setIsError(false);
            }}
            showIcon
          />
        )}
      </section>
    </>
  );
}

export const FilterdFeilds = ({
  filter,
  setFilterData,
  index = 0,
  removeFilter,
  taskFields,
  mode = "custom",
  columns,
  resetRender,
}) => {
  const [dropdownList, setDropdownList] = useState(null);
  const [fieldOptions, setFieldOptions] = useState([]);
  const formRef = useRef();
  const getDropDownList = async (id) => {
    return [
      {
        value: "1",
        label: "Test",
      },
    ];
  };
  // useEffect(() => {
  //   let options = [];
  //   if (taskFields) {
  //     options = Object.keys(taskFields || {})
  //       ?.map((key) => {
  //         let field = taskFields[key];
  //         return {
  //           value: key,
  //           label: field?.nameText,
  //         };
  //       })
  //     // options.push(field)
  //   }
  //   setFieldOptions(options);
  // }, [taskFields]);

  useEffect(() => {
    if (filter?.field) {
      getDropDownList(filter?.field);
    }
  }, [filter]);

  const getInputField = (props) => {
    const field = columns?.find((col) => col?.field === props?.values?.field);
    if (field) {
      if (field?.type === "string") {
        return (
          <Input
            name="value"
            className="ant-input-control"
            type="text"
            setFieldValue={props.handleChange}
            onChange={(e) => {
              setFilterData(index, "value", e.target.value);
              props.setFieldValue("value", e.target.value);
            }}
          />
        );
      } else if (field?.type === "number") {
        return (
          <Input
            name="value"
            className="ant-input-control"
            type="number"
            setFieldValue={props.handleChange}
            onChange={(e) => {
              setFilterData(index, "value", e.target.value);
            }}
          />
        );
      } else if (field?.type === "2") {
        let initialValues =
          props?.values?.value &&
          props?.values?.value?.length &&
          typeof props?.values?.value !== "string"
            ? props?.values?.value?.map((id) => {
                let data = dropdownList?.find((item) => item?.value === id);
                return data;
              })
            : [];
        return dropdownList && dropdownList?.length ? (
          <CustomMultiSelect
            placeholder="Select Options"
            name="value"
            initialValues={initialValues}
            dropdownOptions={dropdownList || []}
            props={props}
            handleChange={(_, value) => {
              props?.setFieldValue(
                "value",
                value?.map((item) => item?.value)
              );
              setFilterData(
                index,
                "value",
                value?.map((item) => item?.value)
              );
              setFilterData(
                index,
                "valueText",
                value?.map((item) => item?.label)
              );
            }}
            maxDisplayItems={1}
          />
        ) : (
          <Spin size="small" />
        );
      } else if (field?.type === "9") {
        let initialValues =
          props?.values?.value &&
          props?.values?.value?.length &&
          typeof props?.values?.value !== "string"
            ? props?.values?.value?.map((id) => {
                let data = dropdownList?.find((item) => item?.value === id);
                return data;
              })
            : [];
        return dropdownList && dropdownList?.length ? (
          <CustomMultiSelect
            placeholder="Select Options"
            name="value"
            initialValues={initialValues}
            dropdownOptions={dropdownList || []}
            props={props}
            handleChange={(_, value) => {
              props?.setFieldValue(
                "value",
                value?.map((item) => item?.value)
              );
              setFilterData(
                index,
                "value",
                value?.map((item) => item?.value)
              );

              setFilterData(
                index,
                "valueText",
                value?.map((item) => item?.label)
              );
            }}
            maxDisplayItems={1}
          />
        ) : (
          <Spin size="small" />
        );
      } else if (field?.type === "date") {
        return props?.values?.condition === "between" ? (
          <DatePicker
            name="value"
            onChange={(value, dates) => {
              // let dateArray = value?.map((val) =>
              //   dateFormatterDayJs(val, "MM-DD-YYYY")
              // );

              console.log({ value, dates });
              props.setFieldValue("value", dates);
              setFilterData(index, "value", dates);
            }}
            type="range"
            dateFormate="YYYY-MM-DD"
          />
        ) : (
          <DatePicker
            name="value"
            onChange={(value, datestring) => {
              let date = dateFormatterDayJs(value, "MM-DD-YYYY");
              console.log("-->", datestring);

              props.setFieldValue("value", datestring);
              setFilterData(index, "value", datestring);
            }}
            dateFormate="YYYY-MM-DD"
          />
        );
      }
    }
    return (
      <Input
        name="value"
        className="ant-input-control"
        type="text"
        onChange={(e) => {
          setFilterData(index, "value", e.target.value);
          props.setFieldValue("value", e.target.value);
        }}
      />
    );
  };
  useEffect(() => {
    if (resetRender) {
      Object.keys(formRef?.current?.values)?.map((key) => {
        formRef?.current?.setFieldValue(key, "");
      });
    }
  }, [resetRender]);
  return (
    <>
      <Formik
        initialValues={{
          field: filter?.field || "",
          condition: filter?.condition || "",
          filterType: filter?.filterType || "",
          value: filter?.value || undefined,
        }}
        enableReinitialize
        key={index}
        innerRef={formRef}
      >
        {(props) => (
          <Row gutter={6} align="middle">
            <Col span={8}>
              <Select
                name="field"
                options={columns?.map((col) => ({
                  value: col?.field,
                  label: col?.headerText,
                }))}
                defaultValue={filter?.field}
                onChange={(value) => {
                  props.setFieldValue("field", value);
                  props.setFieldValue("condition", "");
                  props.setFieldValue("filter", "");
                  setFilterData(index, "field", value);
                  // getDropDownList(value);
                }}
                disabled={mode === "predefined"}
              />
            </Col>
            <Col span={7}>
              <Select
                name="condition"
                options={
                  props?.values?.field
                    ? filterOptions[
                        columns?.find(
                          (col) => col?.field === props?.values?.field
                        )?.type
                      ]
                    : []
                }
                onChange={(value) => {
                  props.setFieldValue("condition", value);
                  setFilterData(index, "condition", value);
                  // setFilterData(index, "type", value);
                }}
              />
            </Col>
            <Col span={7}>{getInputField(props)}</Col>
            {mode !== "predefined" && (
              <Col span={2}>
                <Button
                  className="mb-1 ms-2"
                  type="outline-danger"
                  size="small"
                  shape="circle"
                  icon={<i className="icon-trash" />}
                  onClick={() => {
                    Object?.keys(props?.values)?.forEach((key) =>
                      props?.setFieldValue(key, undefined)
                    );
                    props.resetForm();
                    removeFilter(index, props);
                  }}
                />
              </Col>
            )}
          </Row>
        )}
      </Formik>
    </>
  );
};

import {
  faColumns,
  faSearch,
  faPenToSquare,
  faThumbTackSlash,
  faThumbTack,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Aggregate,
  Edit,
  Filter,
  Freeze,
  GridComponent,
  Group,
  InfiniteScroll,
  Inject,
  Resize,
  Sort,
  VirtualScroll,
} from "@syncfusion/ej2-react-grids";
// Import Syncfusion's default material theme
import "@syncfusion/ej2-react-grids/styles/material.css";
import {
  Button,
  Collapse,
  Drawer,
  Flex,
  Form,
  Input,
  Select,
  Tabs,
  Tooltip,
  ColorPicker,
  Switch
} from "antd";
import { Formik } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import UnyDataGridFilters from "./UnyDataGridFilters/index.jsx";
import { arrayMove } from "@dnd-kit/sortable";
import dayjs from "dayjs";
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React from "react";
import { CSS } from "@dnd-kit/utilities";
import { DndContext } from "@dnd-kit/core";

function DndSortableList({
  items,
  itemsRenderer,
  onDragEnd,
  indexKey = "id",
  draggable = true,
}) {
  const sortableIndexes = useMemo(
    () => items?.map((item) => item[indexKey]),
    [items, indexKey]
  );

  return (
    <>
      <div className="draggableList">
        <DndContext onDragEnd={onDragEnd}>
          <SortableContext
            items={sortableIndexes}
            strategy={verticalListSortingStrategy}
          >
            {items?.map((item) => (
              <SortableItem
                draggable={draggable}
                key={item[indexKey]}
                id={item[indexKey]}
              >
                {itemsRenderer(item)}
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
}

const SortableItem = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: props.id,
      transition: {
        duration: 150,
        easing: "ease-in-out",
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      onMouseDown={(e) => {
        e.target.classList.add("dragging");
      }}
      onMouseUp={(e) => {
        e.target.classList.remove("dragging");
      }}
      className="draggableList_item"
      ref={setNodeRef}
      style={style}
    >
      <Flex align="center">
        {props?.draggable && (
          <span {...attributes} {...listeners}>
            <em className="icon-drag"></em>
          </span>
        )}
        {props?.children}
      </Flex>
    </div>
  );
};

const names = [
  "TOM",
  "Hawk",
  "Jon",
  "Chandler",
  "Monica",
  "Rachel",
  "Phoebe",
  "Gunther",
  "Ross",
  "Geller",
  "Joey",
  "Bing",
  "Tribbiani",
  "Janice",
  "Bong",
  "Perk",
  "Green",
  "Ken",
  "Adams",
];
const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const designation = [
  "Manager",
  "Engineer 1",
  "Engineer 2",
  "Developer",
  "Tester",
];
const status = ["Completed", "Open", "In Progress", "Review", "Testing"];
function data(count) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push({
      Designation:
        designation[Math.round(Math.random() * designation.length)] ||
        designation[0],
      Engineer: names[Math.round(Math.random() * names.length)] || names[0],
      Estimation: hours[Math.round(Math.random() * hours.length)] || hours[0],
      Status: status[Math.round(Math.random() * status.length)] || status[0],
      TaskID: i + 1,
    });
  }
  return result;
}

const UnyDataGrid = ({
  dataSource = [],
  enableColumnSettings = true,
  enableFiltering = true,
  setColumns,
  columns,
  enableGlobalSearching = true,
  enableCheckboxSelection,
  enableSerialNo,
  aggregates = [],
  showTotalCount,
  tabItems = [],
}) => {
  const gridRef = useRef(null);
  const [groupByColumns, setGroupByColumns] = useState([]);
  let grid;
  //   const [columns, setColumns] = useState([
  //     { field: "id", headerText: "ID", width: "100", isPrimaryKey: true },
  //     { field: "name", headerText: "Name", width: "200" },
  //     { field: "age", headerText: "Age", width: "150" },
  //   ]);
  const [settingsActiveTabKey, setSettingsActiveTabKey] = useState("1");
  const [columnSettingsDrawer, setColumnSettingsDrawer] = useState(false);
  const [gridLines, setGridLines] = useState("Both");
  const [searchText, setSearchText] = useState("");
  const [headerColors, setHeaderColors] = useState({});
  const [frozenColumns, setFrozenColumns] = useState(0);
  const formRef = useRef(null);
  const [records, setRecords] = useState([]);

  const datas = data(5000);
  const [filterDrawer, setFilterDrawer] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const onFiltersApplied = (filters) => {
    console.log({ filters });
    grid.clearFiltering();
    filters.forEach((filter) => {
      let filterValue = filter.value;

      // Convert date filter values to Date object
      if (filter.filterType === "date") {
        if (filter.condition === "between") {
          // Handle 'between' condition for dates
          const startDate = dayjs(filter.value[0], "YYYY-MM-DD").toDate();
          const endDate = dayjs(filter.value[1], "YYYY-MM-DD").toDate();
          filterValue = [startDate, endDate]; // Create an array for between filter
          console.log("Between Dates: ", filterValue);
        } else {
          // For other date conditions like equal, notEqual, etc.
          filterValue = dayjs(filter.value, "YYYY-MM-DD").toDate();
          console.log("Converted Date: ", filterValue);
        }
      }
      console.log({
        filterValue,
        condition: filter.condition,
        field: filter.field,
      });
      grid.filterByColumn(
        filter.field, // Column field name
        filter.condition, // Filter operator (like contains, equal, etc.)
        filter?.filterType === "number" ? parseInt(filter.value) : filterValue // Value to filter
      );
    });
    // if (gridRef) {
    //   console.log("==>", new Date(2003, 10, 22));
    //   grid.filterByColumn("dob", "equal", new Date(2003, 10, 23));
    // }
  };

  const onResetFilters = () => {
    grid.clearFiltering();
  };

  const changeEditableColumn = (col) => {
    col.isPrimaryKey = true;
    setColumns((prevColDefs) => {
      return prevColDefs.map((column) => {
        if (column.field === col.field) {
          return { ...col };
        }
        return column;
      });
    });
  };

  // ---------------------------

  // let dataTest = new DataManager({
  //   url: "https://curiousrubik.us/dev/pmsdevapi.php?t=766546&gyu=g/ab/10017",
  //   adaptor: new UrlAdaptor(),
  // });

  // function makeRequest(args) {
  //   var infiniterequestrow = grid.element.querySelector(".infiniterequestrow");
  //   if (infiniterequestrow != undefined) {
  //     var topvalue = infiniterequestrow.offsetTop;
  //     if (topvalue < grid.scrollModule.previousValues.top) {
  //       grid.showSpinner();
  //       infiniterequestrow.classList.remove("infiniterequestrow");
  //       let rows = grid.getRows();
  //       let index =
  //         parseInt(rows[rows.length - 1].getAttribute("aria-rowindex"), 10) + 1;
  //       var prevPage = grid.pageSettings.currentPage;
  //       if (grid.pageSettings.currentPage == 1) {
  //         grid.pageSettings.currentPage = 4;
  //       } else {
  //         grid.pageSettings.currentPage = prevPage + 1;
  //       }
  //       args = {
  //         requestType: "infiniteScroll",
  //         currentPage: grid.pageSettings.currentPage,
  //         prevPage: prevPage,
  //         startIndex: index,
  //         direction: "down",
  //       };
  //       grid.infiniteScrollModule.makeRequest(args);
  //     }
  //   }
  // }
  // function dataBound(args) {
  //   console.log(grid.getRows());
  //   grid
  //     .getRows()
  //     [grid.getRows().length - 30].classList.add("infiniterequestrow");

  //   grid.element
  //     .querySelector(".e-content")
  //     .addEventListener("scroll", function (args) {
  //       makeRequest(args);
  //     });
  // }

  // -----------------------------------

  useEffect(() => {
    if (grid) {
      // Safely interact with the grid
      grid.gridLines = gridLines;
    }
  }, [gridLines, gridRef]);

  useEffect(() => {
    if (gridRef) {
      grid.search(searchText);
    }
  }, [gridRef, searchText]);

  useEffect(() => {
    if (grid) {
      const gridElement = grid.element;
      const headerCells = gridElement.querySelectorAll(".e-headercell");
      // Reset all headers to default color
      headerCells.forEach((cell) => (cell.style.backgroundColor = ""));

      // Apply color to the specific column
      Object.keys(headerColors)?.map((targetColumnId, index) => {
        let column = columns?.find((col) => col?.field === targetColumnId);
        let headerCell = Object.values(headerCells).find(
          (cell) => cell.innerText === column?.headerText
        );
        headerCell.style.backgroundColor = headerColors[targetColumnId];
        const targetCell = gridElement.querySelector(
          `.e-headercell[data-uid="${targetColumnId}"]`
        );
        console.log({ targetCell });
        if (targetCell) {
          targetCell.style.backgroundColor = headerColors[targetColumnId];
        }
      });
    }
  }, [headerColors]);

  const onHeaderCellInfo = (args) => {
    // Check the field or headerText and apply background color
    if (headerColors[args.cell.column.field]) {
      args.node.style.backgroundColor = headerColors[args.cell.column.field]; // Apply background color to 'Name' header
    }
  };

  const changeHeaderColor = (col, color) => {
    setHeaderColors((prevColors) => {
      let colors = {
        ...prevColors,
        [col?.field]: color,
      };
      // setHeaderColorStyle(colors);
      return colors;
    });

    const headerElement = document.querySelector(`[col-id="${col.field}"] `);
    if (headerElement) {
      headerElement.style.backgroundColor = color;
    }
  };
  const columnSettingTabs = [
    {
      key: "2",
      label: "Column Sequencing",
      children: (
        <div className="pt-3">
          <Collapse
            items={[
              {
                key: "1",
                label: "Visible Columns",
                children: (
                  <div className="py-3">
                    <DndSortableList
                      items={columns?.filter((col) => col?.visible)}
                      itemsRenderer={(listItem) => {
                        let index = columns?.indexOf(listItem);
                        return (
                          <Flex
                            className="draggableList_item_content"
                            justify="space-between"
                          >
                            <div className="draggableList_title">
                              {listItem?.headerText}
                            </div>
                            <Flex justify="end" align="center" gap={5}>
                              <ColorPicker
                                size="small"
                                defaultValue="#000000"
                                onChange={(value, color) => {
                                  changeHeaderColor(listItem, color);
                                }}
                              />
                              <Switch
                                size="small"
                                defaultChecked={listItem?.visible}
                                onChange={(value) => {
                                  setColumns((prevViews) => {
                                    const updatedViews = prevViews?.map(
                                      (view) => {
                                        if (view?.field === listItem?.field) {
                                          return {
                                            ...view,
                                            visible: value,
                                          };
                                        }
                                        return view;
                                      }
                                    );
                                    return updatedViews;
                                  });
                                }}
                              />
                              <span
                                onClick={() => {
                                  changeEditableColumn(listItem);
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                {listItem?.editable ? (
                                  <FontAwesomeIcon icon={faPenToSquare} />
                                ) : (
                                  <FontAwesomeIcon icon={faPenToSquare} />
                                )}
                              </span>
                              <span
                                onClick={() => {
                                  setFrozenColumns(index + 2);
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                {" "}
                                {index && index + 2 > frozenColumns ? (
                                  <FontAwesomeIcon icon={faThumbTack} />
                                ) : (
                                  <FontAwesomeIcon icon={faThumbTackSlash} />
                                )}
                              </span>
                            </Flex>
                          </Flex>
                        );
                      }}
                      onDragEnd={({ active, over }) => {
                        setColumns((prevViews) => {
                          const newIndex = prevViews?.findIndex(
                            (view) => view?.field === active?.id
                          );
                          const oldIndex = prevViews?.findIndex(
                            (view) => view?.field === over?.id
                          );
                          let updatedViews = arrayMove(
                            prevViews,
                            newIndex,
                            oldIndex
                          );
                          return updatedViews;
                        });
                      }}
                      indexKey="field"
                    />
                  </div>
                ),
              },
              {
                key: "2",
                label: "Hidden Columns",
                children: (
                  <div className="py-3">
                    <DndSortableList
                      items={columns?.filter((col) => !col?.visible)}
                      itemsRenderer={(listItem) => {
                        let index = columns?.indexOf(listItem);
                        return (
                          <Flex
                            className="draggableList_item_content"
                            justify="space-between"
                          >
                            <div className="draggableList_title">
                              {listItem?.headerText}
                            </div>
                            <Flex justify="end" align="center" gap={5}>
                              <ColorPicker
                                size="small"
                                defaultValue="#000000"
                                onChange={(value, color) => {
                                  changeHeaderColor(listItem, color);
                                }}
                              />
                              <Switch
                                size="small"
                                defaultChecked={listItem?.visible}
                                onChange={(value) => {
                                  setColumns((prevViews) => {
                                    const updatedViews = prevViews?.map(
                                      (view) => {
                                        if (view?.field === listItem?.field) {
                                          return {
                                            ...view,
                                            visible: value,
                                          };
                                        }
                                        return view;
                                      }
                                    );
                                    return updatedViews;
                                  });
                                }}
                              />
                              <span
                                onClick={() => {
                                  changeEditableColumn(listItem);
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                {listItem?.editable ? (
                                  <FontAwesomeIcon icon={faPenToSquare} />
                                ) : (
                                  <FontAwesomeIcon icon={faPenToSquare} />
                                )}
                              </span>
                              <span
                                onClick={() => {
                                  setFrozenColumns(index + 2);
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                {" "}
                                {index && index + 2 > frozenColumns ? (
                                  <FontAwesomeIcon icon={faThumbTack} />
                                ) : (
                                  <FontAwesomeIcon icon={faThumbTackSlash} />
                                )}
                              </span>
                            </Flex>
                          </Flex>
                        );
                      }}
                      onDragEnd={({ active, over }) => {
                        setColumns((prevViews) => {
                          const newIndex = prevViews?.findIndex(
                            (view) => view?.field === active?.id
                          );
                          const oldIndex = prevViews?.findIndex(
                            (view) => view?.field === over?.id
                          );
                          let updatedViews = arrayMove(
                            prevViews,
                            newIndex,
                            oldIndex
                          );
                          return updatedViews;
                        });
                      }}
                      indexKey="field"
                    />
                  </div>
                ),
              },
            ]}
          />
        </div>
      ),
    },
    {
      key: "1",
      label: "Column Grouping",
      children: (
        <div className="w-100 py-3">
          <Formik innerRef={formRef}>
            <Form
              component="div"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              onChange={(event) => {
                const { name, value } = event.target;
                setViewCreateForm((prevViewCreateForm) => ({
                  ...prevViewCreateForm,
                  [name]: value,
                }));
              }}
            >
              <Form.Item label="Group By">
                <Select
                  name="groupBy"
                  className="form-control"
                  options={columns?.map((column) => ({
                    label: column.headerText,
                    value: column.field,
                  }))}
                  defaultValue={groupByColumns?.[0]}
                  onChange={(value) => {
                    setGroupByColumns([value]);
                  }}
                />
              </Form.Item>
              <Form.Item label="Sub Group By (1)">
                <Select
                  name="subGroupBy1"
                  // label="Sub Group By (1)"
                  className="form-control"
                  options={columns?.map((column) => ({
                    label: column.headerText,
                    value: column.field,
                  }))}
                  defaultValue={groupByColumns?.[1]}
                  onChange={(value) => {
                    setGroupByColumns((prevGroupByFields) => {
                      if (prevGroupByFields?.length > 1)
                        return prevGroupByFields?.map(
                          (prevGroupByField, index) => {
                            if (index === 1) {
                              return value;
                            }
                            return prevGroupByField;
                          }
                        );
                      return [...prevGroupByFields, value];
                    });
                  }}
                  disabled={groupByColumns?.length < 1}
                />
              </Form.Item>
              <Form.Item label="Sub Group By (2)">
                <Select
                  name="subGroupBy2"
                  label="Sub Group By (2)"
                  className="form-control"
                  options={columns?.map((column) => ({
                    label: column.headerText,
                    value: column.field,
                  }))}
                  defaultValue={groupByColumns?.[2]}
                  onChange={(value) => {
                    setGroupByColumns((prevGroupByFields) => {
                      if (prevGroupByFields?.length > 2)
                        return prevGroupByFields?.map(
                          (prevGroupByField, index) => {
                            if (index === 2) {
                              return value;
                            }
                            return prevGroupByField;
                          }
                        );
                      return [...prevGroupByFields, value];
                    });
                  }}
                  disabled={groupByColumns?.length < 2}
                />
              </Form.Item>
            </Form>
          </Formik>
        </div>
      ),
    },
    {
      key: 3,
      label: "Other Settings",
      children: (
        <div className="pt-3">
          <Formik>
            <Form
              component="div"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
            >
              {/* <RadioGroup
                name="gridLines"
                label="Grid Lines"
                options={[
                  {
                    value: "Both",
                    label: "Both",
                  },
                  {
                    value: "Horizontal",
                    label: "Horizontal",
                  },
                  {
                    value: "Vertical",
                    label: "Vertical",
                  },
                ]}
                onChange={(value) => {
                  console.log(value?.target?.value);
                  setGridLines(value?.target?.value);
                }}
              /> */}
            </Form>
          </Formik>
        </div>
      ),
    },
  ];
  const editSettings = {
    allowEditing: true,
    allowAdding: false,
    allowDeleting: false,
    mode: "Batch",
  };
  const finalCols = useMemo(() => {
    let cols = [...columns];

    if (enableSerialNo) {
      const serialNoColumn = {
        headerText: "S.No", // Header name for the serial number column
        width: 50, // Adjust width as needed
        textAlign: "Center", // Align text to center
        template: (data, row) => {
          return data?.index * 1 + 1;
        }, // Use the row index to generate serial numbers
        isPrimaryKey: false, // Serial number won't be a key
        allowEditing: false,
        minWidth: "80px",
        maxWidth: "80px",
        width: "80px", // Disallow editing on this column
      };

      cols = [serialNoColumn, ...cols];
    }

    if (enableCheckboxSelection) {
      const checkboxColumn = {
        type: "checkbox",
        minWidth: "50px",
        maxWidth: "50px",
        width: "50px",
      };
      cols = [checkboxColumn, ...cols];
    }

    return cols;
  }, [columns, enableSerialNo]);

  const finalDataSource = useMemo(() => {
    const isValidDate = (dateString) => {
      const date = new Date(dateString);
      return !isNaN(date.getTime()); // Ensure the date is valid
    };

    const convertDates = (item) => {
      return Object.keys(item).reduce((acc, key) => {
        const value = item[key];

        // If the value is a string and can be converted to a valid date, convert it
        acc[key] =
          typeof value === "string" && isValidDate(value)
            ? new Date(value)
            : value;
        return acc;
      }, {});
    };

    return dataSource.map((record) => convertDates(record));
  }, [dataSource]);
  console.log(finalDataSource);

  const finalAggregates = useMemo(() => {
    let agg = [...aggregates];
    if (showTotalCount) {
      agg = [
        ...agg,
        {
          columns: [
            {
              type: "Count",
              field: "id",
              footerTemplate: "Total Count: ${Count}",
              textAlign: "right",
              columnName: finalCols[finalCols.length - 1]?.field,
            },
          ],
        },
      ];
    }
    return agg;
  }, [aggregates, showTotalCount]);

  console.log(finalAggregates, {
    columns: groupByColumns ?? [],
    showDropArea: false,
    captionTemplate:
      '<span class="groupItems"> ${headerText} - ${key} : ${count} Items </span>',
  });
  return (
    <div className="unyDataGrid">
      <Flex className="unyDataGrid_inner" justify="space-between" gap={15}>
        {tabItems?.length > 0 ? (
          <div className="commonTabs">
            <Tabs
              // activeKey={currentView?.name}
              // onChange={onViewChange}
              defaultActiveKey="1"
              items={tabItems}
            />
          </div>
        ) : (
          <div></div>
        )}
        <Flex gap={10} align="center">
          {enableGlobalSearching && (
            <div>
              <Input
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
                placeholder={"Search . . ."}
                prefix={<FontAwesomeIcon icon={faSearch} />}
              />
            </div>
          )}
          {enableFiltering && (
            <Tooltip title="Flters">
              <Button
                shape="circle"
                className="filterBtn"
                onClick={() => {
                  // grid.filterByColumn("name", "equal", "John");
                  // console.log("executed");
                  setFilterDrawer(true);
                }}
              >
                <FontAwesomeIcon icon={faFilter} />
              </Button>
            </Tooltip>
          )}
          {enableColumnSettings && (
            <Tooltip title="Column Settings">
              <Button
                shape="circle"
                className="filterBtn"
                onClick={() => setColumnSettingsDrawer(true)}
              >
                <FontAwesomeIcon icon={faColumns} />
              </Button>
            </Tooltip>
          )}
        </Flex>
      </Flex>
      <GridComponent
        height={"700"}
        aggregates={finalAggregates}
        headerCellInfo={onHeaderCellInfo}
        dataSource={dataSource}
        ref={(g) => (grid = g)}
        columns={finalCols}
        allowSorting
        allowMultiSorting
        selectionSettings={{
          type: "Multiple",
          checkboxOnly: true,
          cellSelectionMode: "BoxWithBorder",
          persistSelection: true,
        }}
        allowGrouping
        allowFiltering
        groupSettings={{
          columns: groupByColumns ?? [],
          showDropArea: false,
          captionTemplate:
            '<span class="groupItems"> ${headerText} - ${key} : ${count} Items </span>',
        }}
        editSettings={editSettings}
        frozenColumns={[frozenColumns]}
        allowResizing
        // enableVirtualization={true}
        enableInfiniteScrolling={true}
        pageSettings={{
          pageSize: 50,
        }}
        // dataBound={dataBound}
      >
        <Inject
          services={[
            Filter,
            Sort,
            Group,
            Edit,
            Resize,
            Aggregate,
            InfiniteScroll,
            VirtualScroll,
            Freeze,
          ]}
        />
      </GridComponent>
      <Drawer
        title="Column Settings"
        width={720}
        onClose={() => {
          setColumnSettingsDrawer(false);
        }}
        open={columnSettingsDrawer}
        styles={{
          body: {
            paddingBottom: 50,
          },
        }}
        footer={
          settingsActiveTabKey === "1" ? (
            <Flex justify="space-between" align="center">
              <Button onClick={() => setColumnSettingsDrawer(false)}>
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setGroupByColumns([]);
                  formRef.current.resetForm();
                }}
              >
                Reset Grouping
              </Button>
            </Flex>
          ) : (
            <></>
          )
        }
      >
        <div className="commonTabs">
          <Tabs
            // activeKey={currentView?.name}
            onChange={(tab) => {
              setSettingsActiveTabKey(tab);
            }}
            defaultActiveKey="1"
            items={columnSettingTabs}
          />
        </div>
      </Drawer>
      <Drawer
        title={"Filters"}
        width={720}
        onClose={() => {
          setFilterDrawer(false);
        }}
        open={filterDrawer}
        styles={{
          body: {
            paddingBottom: 50,
          },
        }}
      >
        <UnyDataGridFilters
          appliedFilters={appliedFilters}
          setAppliedFilters={setAppliedFilters}
          onFiltersApplied={onFiltersApplied}
          onResetFilters={onResetFilters}
          columns={columns}
        />
      </Drawer>
    </div>
  );
};

export default UnyDataGrid;

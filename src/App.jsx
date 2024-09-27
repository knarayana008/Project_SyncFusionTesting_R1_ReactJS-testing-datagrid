import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
} from "@syncfusion/ej2-react-grids";
import React,{useEffect} from "react";
import UnyDataGrid from "./UnyDataGrid";
import {$ajax_post} from "./Library/Library";
function App() {
    const [columns, setColumns] = React.useState([
                  {
                    headerText: "ID",
                    field: "id",
                    width: 200,
                  },
                  {
                    headerText: "API Name",
                    field: "name",
                    width: 300,
                  },
                  {
                    headerText: "Screen Name",
                    field: "screen_name",
                    width: 300,
                  },
                  {
                    headerText: "API Status",
                    field: "api_statustext",
                    width: 300,
                  },
                  {
                    headerText: "Purpose",
                    field: "purposetext",
                    width: 300,
                  },
                  {
                    headerText: "Delivery Method",
                    field: "delivary_method",
                    width: 150,
                  },
      ]);
      const [dataSource, setDataSource] = React.useState([]);


      const getApplicationList = async () => {
        $ajax_post('post', 'g/ab/10017', {}, function(record){
          // alert(JSON.stringify(record))
          setDataSource(record);
        });
      };
      useEffect(() => {
        getApplicationList();
      }, []);

  return (
    <UnyDataGrid
      columns={columns}
      setColumns={setColumns}
      dataSource={dataSource}
      enableColumnSettings={true}
      enableFiltering={true}
      enableGlobalSearching={true}
      enableSerialNo={true}
      enableCheckboxSelection={true}
      showTotalCount={true}
      tabItems={[]}
    />
  );
}
export default App;

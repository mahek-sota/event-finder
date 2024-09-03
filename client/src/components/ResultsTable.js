import React, { useState, useEffect} from "react";
import _ from 'lodash';
import axios from "axios";

export default function ResultsTable(props) {

    // console.log(props.formSubmissionData.category)

    const [tableData, setTableData] = useState([]);
    const [selectedData, setSelectedData] = useState(null);
    const [tableShown, setTableShown] = useState(false);

    const handleRowClick = (rowData) => {
        setSelectedData(rowData);
        props.onData(rowData)
    };  

    React.useEffect(() => {

        const getData = setTimeout(async () => {
          const response = await axios.get(`/api/getResultsTable?keyword=${props.formSubmissionData.keyword}&radius=${props.formSubmissionData.distance}&category=${props.formSubmissionData.category}&lat=${props.formSubmissionData.lat}&lng=${props.formSubmissionData.lng}`);
          const data = response.data
          setTableData(data)
          console.log(data);
          console.log(data.length);

          setTableShown(true);

      }, 10)
  
      return () => clearTimeout(getData)
      }, [])

    return (<div> 
      <br></br>
      <br></br>
      {tableData.length !==0 && ( <div className="container">
        <div className="table-responsive">
          <table className="table table-striped table-dark " style={{borderRadius :"15px"}}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Icon</th>
              <th>Event</th>
              <th>Genre</th>
              <th>Venue</th>
            </tr>
          </thead>
          <tbody>
            {_.orderBy(tableData, ['date'], ['asc']).map((row) => (
              <tr key={row.id} onClick={() => handleRowClick(row)}>
                <td>{row.date}</td>
                <td><img src={row.icon} style= {{width : 100}} alt="" /></td>
                <td>{row.event}</td>
                <td>{row.genre}</td>
                <td>{row.venue}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div> 
      </div>
    )}
      
      {console.log("tableData", tableData.length)}
      {(tableShown && tableData.length === 0) && ( <div className="container text-center">
        <div> <p style={{background : "white", color : "red", borderRadius : "30px"}}> No results available </p></div>
        </div>)}
      {/* {selectedData && (
      <div>
          <p>ID: {selectedData.id}</p>
          <p>Name: {selectedData.date}</p>
          <p>Email: {selectedData.event}</p>
        </div>
      )} */}
      </div>)
  }
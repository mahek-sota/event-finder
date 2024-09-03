import SearchForm from "../components/SearchForm"
import ResultsTable from "../components/ResultsTable"
import EventDeatailsCard from "../components/EventDetailsCard";


import React, { useState } from "react";

export default function Search() {

    const [submittedData, setSubmittedData] = useState(null);
    const [rowData, setRowData] = useState(null);
    const [showTable, setShowTable] = useState(false);
    const [showEventsCard, setShowEventsCard] = useState(false);

    const handleSubmit = async data => {
        setSubmittedData(data);
        setShowTable(true);
    };

    const handleClear = async data => {
        setSubmittedData(null);
        setShowTable(false);
        setShowEventsCard(false);
    };

    const handleRowSelected = async data => {
        setRowData(data);
        setShowTable(false);
        setShowEventsCard(true);

    };

    const handleBackPressed = async data => {
        setShowTable(data);
        setShowEventsCard(false)
    };
    
    
    return (<div className="p-2">
                
                <SearchForm onSubmit={handleSubmit} onReset = {handleClear}/>
                
                {showTable && ( 
                    <ResultsTable formSubmissionData = {submittedData} onData = {handleRowSelected}/>
                )}

                {!showTable && showEventsCard && ( 
                    <EventDeatailsCard rowSubmissionData = {rowData} onBackPressed = {handleBackPressed}/>
                    )}

            </div>)
  }
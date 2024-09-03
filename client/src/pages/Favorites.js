import { MenuList } from "@mui/material";
import React, { useState, useEffect } from "react";


export default function Favorites() {

  const [myList, setMyList] = useState([]);


  React.useEffect(() => {

    const getData = setTimeout(async () => {
        var idxValue = 0;
        for (var i = 0; i < localStorage.length; i++) {
          var x = localStorage.key(i);
          try{
            idxValue = idxValue +1 
            
            var localStorageInfo = JSON.parse(localStorage.getItem(x))
            console.log(x, localStorageInfo)
            const listOfLocalStorage = {"idx" : idxValue, "date" : localStorageInfo[2], "event" : localStorageInfo[0], "category" : localStorageInfo[1], "venue" : localStorageInfo[3], "localStorageKey" : x}
            setMyList(myList => [...myList, listOfLocalStorage]);
            
          }
          catch{
            idxValue = idxValue - 1
          }
          
        }

    }, 10)

    return () => clearTimeout(getData)
    }, [])

  function handleClick(id) {

    const updatedList = myList.filter(item => item.localStorageKey !== id);
    setMyList(updatedList);

    localStorage.removeItem(id);

    alert("Removed from favorites!")


  }
  
  
  return (
    <div>

      {myList.length !== 0 && ( <div className="container">

        <h5 style={{color:"#73f9df", textAlign: "center"}}>List of your favourite events</h5>
        <div className="table-responsive">

          <table className="table table-light table-bordered ">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Event</th>
              <th>Category</th>
              <th>Venue</th>
              <th>Favorite</th>
            </tr>
          </thead>
          <tbody>
            {myList.map((row, index) => (
              <tr key={index+1}>
                <td>{index+1}</td>
                <td>{row.date}</td>
                <td>{row.event}</td>
                <td>{row.category}</td>
                <td>{row.venue}</td>
                <td><button className="btn" onClick={() => handleClick(row.localStorageKey)}> <i className="fa-solid fa-trash-can"></i></button></td>
                
              </tr>
            ))}

          </tbody>
        </table>
      </div>
      
      </div>
      )}

      {myList.length === 0  && (<div className="container text-center">
        <div> <p style={{background : "white", color : "red", borderRadius : "30px"}}> No favorite events to show</p></div>
        </div>)}

        
    </div>
  );
}
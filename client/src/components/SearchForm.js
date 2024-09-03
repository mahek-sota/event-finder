import React, { useState, useRef, useEffect, CSSProperties } from "react";
import '../style.css';
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

const categories = [
    "Default",
    "Music",
    "Sports",
    "Arts & Theatre",
    "Film",
    "Miscellaneous"
  ];

export default function SearchForm({onSubmit, onReset}) {
    const [keyword, setKeyword] = useState("");
    const [distance, setDistance] = useState(10);
    const [category, setCategory] = useState(categories[0]);
    const [location, setLocation] = useState("");
    const [autoDetect, setAutoDetect] = useState(false);
    
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");

    const [optionSelected, setOptionSelected] = useState(0)

    let [loading, setLoading] = useState(true);
    let [optionsLoaded , setOptionsLoaded] = useState(false)

    function handleSubmit(event) {
        event.preventDefault();
        
        const selectedOption = options.find(option => option.name === keyword);
        const selectedKeyword = selectedOption ? selectedOption.name : keyword;
        
        setKeyword(selectedKeyword);
        
        // Handle form submission
        onSubmit({ keyword, distance, category, location, autoDetect , lat, lng});
      }
      

    

    const [options, setOptions] = useState([]);
    
    React.useEffect(() => {

        if(optionSelected == 1)
        {
            setOptionSelected(0)
        }
        else{
            if (keyword.trim() !== ""){
                const getData = setTimeout(async () => {
                const response = await fetch(`/api/getAutoSuggestions?keyword=${keyword}`,{
                    headers:{}
                });
                const textData = await response.text()

                try {
                    const data = JSON.parse(textData)
                    setOptions(data);
                    setLoading(false);
                    setOptionsLoaded(true);
                }
                catch{
                    console.log("Here Error")
                    console.log("Response", response)
                    setOptions([])
                    setLoading(false);
                    setOptionsLoaded(false);
                }
                
            }, 300)
        
        return () => clearTimeout(getData)
        }}}, [keyword])

    const handleInputChange =  (async (e) => {
        setLoading(true)
        setOptionsLoaded(false)
        const value = e.target.value;
        setKeyword(value);
    });

    const handleOptionSelect = (option) => {
        
        setKeyword(option.name);
        setOptions([]);
        setOptionSelected(1)
    };
    
    React.useEffect(() => {

        if (location.trim() !== ""){
        const getData = setTimeout(async () => {

            
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyByU0eQL7mxd2hAA9H42KnlcScPDtStfuk&address=${location}`);
            const data = response.data;
            
            console.log("data", data)
            if (data.results.length != 0  && "geometry" in data.results[0])
            {
                const locationJson = data.results[0].geometry.location
                const newArray = [{lat : locationJson.lat , lng : locationJson.lng}]
                //res.send(newArray);
                setLat(locationJson.lat)
                setLng(locationJson.lng)
                console.log(lat,lng)
            }
            else{
                const newArray = ["", ""]
                //res.send(newArray);
            }


        }, 500)
    
        return () => clearTimeout(getData)
        }}, [location])


    const handleLocationChange =  (async (e) => {
        setLocation(e.target.value);
        // if (location.trim() !== ""){
        //     const response = await fetch(`/api/getLocationCoordinates?location=${location}`);
        //     const data = await response.json();
        //     console.log(data)
        //     setLat(data[0].lat)
        //     setLng(data[0].lng)
        // }
    });
    
    const handleCheckBoxChange =  (async (e) => {
        setAutoDetect(e.target.checked);
        setLocation("");

        const result = await axios.get("https://ipinfo.io/?token=549f78bcd28462", {
        });
        const data = result.data;

        const splited = data.loc.split(",")
        console.log("Spitted", splited)
        setLat(splited[0])
        setLng(splited[1])

    });

    function handleReset(event) {
        event.preventDefault();
        // Handle form submission
        setKeyword("");
        setDistance(10);
        setCategory(categories[0]);
        setLocation("");
        setAutoDetect(false);
        onReset();
    }

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        // add event listener when component mounts
        document.addEventListener('mousedown', handleClickOutside);

        // cleanup event listener when component unmounts
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-6 blur text-left" style={{borderRadius: '10px'}}>
                    <br></br>
                    <br></br>
                    <div className="text-center">
                        <h2 className="text-light" style={{fontFamily: 'serif'}}>Events Search</h2>
                    </div>
                    <hr style={{borderColor : "white"}}></hr>
                    
                    <form onSubmit={handleSubmit}>
                    <div className="form-group ">
                        <label style={{fontSize : 12, color:"#88c2dd"}} required>Keyword <span style={{ color: "red" }}>*</span><br></br></label>
                        <div className="position-relative">
                            <input type="text" value={keyword} onClick={() => setIsOpen(!isOpen)} onChange={handleInputChange} style={{width : "100%", color: "black"}} className = "form-control" required/>
                            <div className="dropdown" ref={dropdownRef}>
                                
                                {isOpen && (<ul className="list-group mt-2 position-absolute w-100" style={{ top: '100%', zIndex: 1, }}>

                                
                                    {keyword && loading &&(<li className="list-group-item " style={{color: 'black'}}>
                                        <ClipLoader
                                        color={"#000000"}
                                        loading={loading}
                                        size={20}
                                        aria-label="Loading Spinner"
                                        data-testid="loader"
                                         />
                                    </li>)}

                                    {keyword && optionsLoaded && options &&(options.map((option) => (
                                    
                                    <li className="list-group-item " style={{color: 'black'}} key={option.id} onClick={() => handleOptionSelect(option) }>
                                        
                                        {option.name}
                                    </li>
                                    )))}
                                </ul>)}
                            </div>
                        </div>
                        
                        
                    </div>
                    
                    
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label   style={{fontSize : 12, color:"#88c2dd"}}>
                                    Distance: 
                                </label>
                                <br></br>
                                <input
                                type="number"
                                value={distance}
                                onChange={(event) => setDistance(parseInt(event.target.value))}
                                style={{width : "100%", color : "black"}}
                                className = "form-control"
                                required
                                />
                                
                            </div>

                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label   style={{fontSize : 12, color:"#88c2dd"}}>
                                Category: <span style={{ color: "red" }}>*</span>
                                </label>
                                <select value={category} className = "form-control droupdown" onChange={(event) => setCategory(event.target.value)} style={{width : "100%", color: 'black'}} required>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                        {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    
                    <div className="form-group">
                        <label   style={{fontSize : 12, color:"#88c2dd"}}>Location: <span style={{ color: "red" }}>*</span></label>
                        <input type="text" value={location} onChange={handleLocationChange} disabled={autoDetect} className = "form-control" style={{width : "100%", color: 'black'}} required/> 
                    </div>
                    
                    <div className="form-group">
                        <input className = "form-check-input" style={{fontSize : 12 , marginLeft : 5, marginTop:7, }} type="checkbox" checked={autoDetect} onChange={handleCheckBoxChange} />
                        <label  style={{fontSize : 12 , marginLeft : 25, padding : 3, color:"#88c2dd"}}> Auto-detect your location </label>
                    </div>
                    <div > 
                        <div className="text-center">
                            <button type="submit" className="btn btn-danger" style={{margin : 7}}>Submit</button>
                            <button type="reset"  className="btn btn-primary" style={{margin : 7}} onClick={handleReset}>Clear</button>
                        </div>
                    </div>
                    <br></br>
                    </form>  
                </div>
                <div className="col-md-3"></div>
                
            </div>
        </div>

    )
  }
import React, { useState } from "react";
import '../style.css';
import Maps from "../components/Maps";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import axios from "axios";

Modal.setAppElement(document.getElementById('root'));

export default function CardVenue(props) {

    const [venueCardDisplayData, setVenueCardDisplayData] = useState({
        name : "",
        address : "",
        city : "",
        state : "",
        phoneNumber : "",
        openHours : "",
        generalRule : "", 
        childRule : "",
        lat : "",
        lng : ""});

    
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [openHours, setOpenHours] = useState("");
    const [generalRule, setGeneralRule] = useState("");
    const [childRule, setChildRule] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [showMap, setShowMap] = useState(false);

    const [expandedOpenHours, setExpandedOpenHours] = useState(false);
    const [expandedGeneralRule, setExpandedGeneralRule] = useState(false);
    const [expandedChildRule, setExpandedChildRule] = useState(false);

    //check later to do with css
    const openHoursDisplayContent = expandedOpenHours ? openHours : openHours.slice(0, 80);
    const generalRuleDisplayContent = expandedGeneralRule ? generalRule : generalRule.slice(0, 80);
    const childRuleDislayContent = expandedChildRule ? childRule : childRule.slice(0, 80);


    const toggleExpandedOpenHours = () => {
        setExpandedOpenHours(!expandedOpenHours);
    };

    const toggleExpandedGeneralRule = () => {
        setExpandedGeneralRule(!expandedGeneralRule);
    };

    const toggleExpandedChildRule = () => {
        setExpandedChildRule(!expandedChildRule);
    };

    const containerStyle = {
        width: '100%',
        height: '400px',
      };
    
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyByU0eQL7mxd2hAA9H42KnlcScPDtStfuk',
        });
    
    React.useEffect(() => {

        const getData = setTimeout(async () => {
            const response = await axios.get(`/api/getCardVenueDetails?id=${props.props.eventId}`);
            const apiResponse = response.data;
            
            setName(apiResponse[0].name || "");
            setAddress((apiResponse[0].address + ", " + apiResponse[0].city + ", " + apiResponse[0].state) || "");
            setCity(apiResponse[0].city || "");
            setState(apiResponse[0].state || "");
            setPhoneNumber(apiResponse[0].phoneNumber || "");
            setOpenHours(apiResponse[0].openHours || "");
            setGeneralRule(apiResponse[0].generalRule || "");
            setChildRule(apiResponse[0].childRule || "");
            setLat(Number(apiResponse[0].lat || ""));
            setLng(Number(apiResponse[0].lng || ""));

        }, 500)
    
        return () => clearTimeout(getData)
        }, [])

        const customStyles = {
            content: {
                top: '10%',
                left: '10%',
                right: '10%',
                bottom : '50%',
                height: '575px'
            },
            };
        

        const mapStyles = {
            width: '100%',
            height: '400px'
          };
          const handleButtonClick = () => {
            setShowMap(true);
        };

        let subtitle;
        const [modalIsOpen, setIsOpen] = React.useState(false);
      
        function openModal() {
          setIsOpen(true);
        }
      
        function afterOpenModal() {
          // references are now sync'd and can be accessed.
          subtitle.style.color = '#f00';
        }
      
        function closeModal() {
          setIsOpen(false);
        }


    return (
        <div>
            <div className="container-fluid">
                <div className="row">

                    <div className="col-md-6 text-center"> 
                        {name && <div className="m-3"> <div style = {{color : "#73f9df", fontWeight : "bold"}}>Name</div> <div style={{color : "#ECF0F1"}}> {name}</div></div>}
                        {address && <div className="m-3"> <div style = {{color : "#73f9df", fontWeight : "bold"}}>Address</div> <div style={{color : "#ECF0F1"}}> {address}</div></div>}
                        {phoneNumber && <div className="m-3"> <div style = {{color : "#73f9df", fontWeight : "bold"}}>Phone Number</div> <div style={{color : "#ECF0F1"}}> {[phoneNumber]}</div></div>}
                    </div>

                    <div className="col-md-6 text-center"> 
                        
                            {openHours && 
                                <div className="m-3"> 
                                    <div style = {{color : "#73f9df", fontWeight : "bold"}}>Open Hours</div> 
                                        <div style={{color : "#ECF0F1"}}> 
                                            {openHoursDisplayContent} <br></br>
                                            {openHours.length > 80 && (
                                                <button className="btn btn-link" onClick={toggleExpandedOpenHours}>
                                                {expandedOpenHours ? "Show Less" : "Show More"}
                                                {expandedOpenHours && (<i class="arrow up  ml-2 mb-1"></i>)}
                                                {!expandedOpenHours && (<i class="arrow down ml-2 mb-1"></i>)}
                                                </button>
                                            )}
                                    </div>
                                </div>}     
                                
                           {generalRule && 
                            <div className="m-3"> 
                                <div style = {{color : "#73f9df", fontWeight : "bold"}}>General Rule</div> 
                                    <div style={{color : "#ECF0F1"}}> 
                                            {generalRuleDisplayContent} <br></br>
                                            {generalRule.length > 80 && (
                                                <button className="btn btn-link" onClick={toggleExpandedGeneralRule}>
                                                {expandedGeneralRule ? "Show Less" : "Show More"}
                                                {expandedGeneralRule && (<i class="arrow up  ml-2 mb-1"></i>)}
                                                {!expandedGeneralRule && (<i class="arrow down ml-2 mb-1"></i>)}
                                                </button>
                                            )}
                                    </div>
                                </div>}
                            
                            {childRule && 
                            <div className="m-3"> 
                                <div style = {{color : "#73f9df", fontWeight : "bold"}}>Child Rule</div> 
                                    <div style={{color : "#ECF0F1"}}> 
                                            {childRuleDislayContent} <br></br>
                                            {childRule.length > 80 && (
                                                <button className="btn btn-link" onClick={toggleExpandedChildRule}>
                                                {expandedChildRule ? "Show Less" : "Show More"}
                                                {expandedChildRule && (<i class="arrow up  ml-2 mb-1"></i>)}
                                                {!expandedChildRule && (<i class="arrow down ml-2 mb-1 "></i>)}
                                                </button>
                                            )}
                                    </div>
                                </div>}
                    </div>

                </div>

                
            </div>
            {/* {address && <div className="text-center">
                <button className="btn btn-danger" onClick={handleButtonClick}>Show venue on Google Map</button>
            </div>} */}
            
            
            {console.log("lat,lng", lat,lng)}
            {/* {isLoaded ? (
                <div>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={{"lat": lat, "lng" : lng}}
                    zoom={15}
                >
                <Marker position={{"lat": lat, "lng" : lng}} />
                </GoogleMap>      
                </div>

            ) : null}; */}

            <div >
                <div className="text-center">
                    <button className="btn btn-danger" onClick={openModal}>Show venue on Google Map</button>
                    <br></br>
                    <br></br>
                </div>

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <h2 className="ml-2">Event Venue</h2>
                    <hr>
                    </hr>
                    <div>
                        {isLoaded ? (
                            <div>
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={{"lat": lat, "lng" : lng}}
                                zoom={15}
                            >
                            <Marker position={{"lat": lat, "lng" : lng}} />
                            </GoogleMap>      
                            </div>

                        ) : null}
                        <br></br>
                    </div>


                    <button className="btn btn-dark ml-3" onClick={closeModal}>Close</button>

                    
                </Modal>
                </div>

        </div>
    )

}

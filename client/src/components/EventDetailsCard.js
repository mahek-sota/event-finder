import React, { useState } from "react";
import CardEvents from "../components/CardEvents";
import CardArtist from "../components/CardArtist";
import CardVenue from "../components/CardVenue";
import $ from "jquery";
import axios from "axios";

export default function EventDeatailsCard(props) {

    const [showEvents, setShowEvents] = useState(true);
    const [showArtist, setShowArtist] = useState(false);
    const [showVenue, setShowVenue] = useState(false);
    // const [data, setData] = useState([]);

    const [propsForCards , setPropsForCards] = useState(props.rowSubmissionData);

    const [eventCardDisplayData, setEventCardDisplayData] = useState({
      date : "",
      icon : "",
      event : "",
      genre : "",
      venue : "",
      eventId : "",
      artist : "", 
      priceRanges : "",
      seatmap : "",
      ticketStatus : "",
      buyTickets : ""});

    const [date, setDate] = useState("");
    const [icon, setIcon] = useState("");
    const [event, setEvent] = useState("");
    const [genre, setGenre] = useState("");
    const [venue, setVenue] = useState("");
    const [eventId, setEventId] = useState("");
    const [artist, setArtist] = useState("");
    const [priceRanges, setPriceRanges] = useState("");
    const [seatmap, setSeatmap] = useState("");
    const [ticketStatus, setTicketStatus] = useState("");
    const [buyTickets, setBuyTickets] = useState("");
    const [eventDetails, setEventDetails] = useState({});

    const [eventIsFavourite, setEventIsFavourite] = useState(false);

    const [cardArtistLoaded, setCardArtistLoaded] = useState(null);


    React.useEffect(() => {

      console.log(props)

      const getData = setTimeout(async () => {
          const response = await axios.get(`/api/getCardEventDetails?id=${props.rowSubmissionData.eventId}`);
          const apiResponse = response.data;
          setEventDetails(apiResponse);
          
          setDate(apiResponse[0].date || "");
          setIcon(apiResponse[0].icon || "");
          setEvent(apiResponse[0].event || "");
          setGenre(apiResponse[0].genre || "");
          setVenue(apiResponse[0].venue || "");
          setEventId(apiResponse[0].eventId || "");
          setArtist(apiResponse[0].artist || "");
          setPriceRanges(apiResponse[0].priceRanges || "");
          setSeatmap(apiResponse[0].seatmap || "");
          setTicketStatus(apiResponse[0].ticketStatus || "");
          setBuyTickets(apiResponse[0].buyTickets || "");

          // for (var i = 0; i < localStorage.length; i++) {
          //   var x = localStorage.key(i);
          //   try{
              
          //     var localStorageInfo = JSON.parse(localStorage.getItem(x))
          //     console.log(x, localStorageInfo)
          //   }
          //   catch{
          //   }
          // }

          if (localStorage.getItem(apiResponse[0].eventId) === null) {
              setEventIsFavourite(false);
          }
          else{
              setEventIsFavourite(true);
          }


        }, 10)
  
      return () => clearTimeout(getData)
      }, [])


    const handleBack = (rowData) => {
        props.onBackPressed(true)
    }; 

    const handleClickedEvents = () => {
        setShowEvents(true);
        setShowArtist(false);
        setShowVenue(false);
    }; 

    const handleClickedArtist = () => {
      setShowEvents(false);
      setShowArtist(true);
      setShowVenue(false);
    };

    const handleClickedVenue = () => {
      setShowEvents(false);
      setShowArtist(false);
      setShowVenue(true);
    };

    const addToFav = () => {

      localStorage.setItem(eventId, JSON.stringify([event, genre,date, venue, eventId]))
      //console.log(localStorage.getItem(eventId))
      alert("Event Added to Favorites!")
      setEventIsFavourite(true);

    }

    const delFromFav = () => {

      localStorage.removeItem(eventId);
      alert("Removed from favorites!");
      setEventIsFavourite(false);

    }


    return (<div>
              <br></br>
              <br></br>
              <div className="container-fluid" style={{margin: '0'}}>
                <div className="row">
                  <div className="col-md-2"></div>
                  <div className="col-md-8 blur text-left"style={{padding: '0px 0px 0px 0px', margin: '0'}} >
                    <button className = "btn" style = {{color : "white", fontSize : 12, }}onClick={handleBack}>&lt;<u>Back</u></button>
                    <br></br>
                    <br></br>

                    <div className="text-center">
                        <h4 className="text-light">{props.rowSubmissionData.event} 
                        {eventIsFavourite && (<i className="fa-solid fa-heart ml-3" style = {{border : "0px solid", borderRadius: "50%", padding : "1%", backgroundColor :"white", color: "red", fontSize: "0.73em" }} onClick = {delFromFav}></i>)}
                        {!eventIsFavourite && (<i className="fa-regular fa-heart ml-3" style = {{border : "1px solid", borderRadius: "50%", padding : "1%", backgroundColor :"white", color: "#c4c6ca",fontSize: "0.73em" }} onClick = {addToFav}></i>)}
 
                        </h4>             
                                  
                    </div>
   
                    <div className = "text-center" style = {{backgroundColor : "#479989"}}>
                        <div className="row" >
                          <div className="col-md-2" ></div>
                          <div className="col-md-8" >
                            {showEvents && (<div>
                            <button className = "btn pr-4 pl-4" style = {{color : "white" , borderBottom : "2px solid #21618C", borderRadius : 0}} onClick={handleClickedEvents}>Events</button>
                            <button className = "btn pr-4 pl-4" style = {{color : "#D0D3D4"}} onClick={handleClickedArtist}>Artist/Teams</button>
                            <button className = "btn pr-4 pl-4" style = {{color : "#D0D3D4"}} onClick={handleClickedVenue}>Venue</button>
                            </div>)}

                            {showArtist && (<div>
                            <button className = "btn pr-4 pl-4" style = {{color : "#D0D3D4" }} onClick={handleClickedEvents}>Events</button>
                            <button className = "btn pr-4 pl-4" style = {{color : "white", borderBottom : "2px solid #21618C", borderRadius : 0}} onClick={handleClickedArtist}>Artist/Teams</button>
                            <button className = "btn pr-4 pl-4" style = {{color : "#D0D3D4"}} onClick={handleClickedVenue}>Venue</button>
                            </div>)}

                            {showVenue && (<div>
                            <button className = "btn pr-4 pl-4" style = {{color : "#D0D3D4"}} onClick={handleClickedEvents}>Events</button>
                            <button className = "btn pr-4 pl-4" style = {{color : "#D0D3D4"}} onClick={handleClickedArtist}>Artist/Teams</button>
                            <button className = "btn pr-4 pl-4" style = {{color : "white", borderBottom : "2px solid #21618C", borderRadius : 0}} onClick={handleClickedVenue} data-target="#myCarousel" data-slide-to="2">Venue</button>
                            </div>)}
                          </div>
                          <div className="col-md-2"></div>
                        </div>
                    </div>

                    <div style={{ display: showEvents ? 'block' : 'none' }}>
                        {(< CardEvents props = {propsForCards}/>)}
                    </div>

                    <div style={{ display: showArtist ? 'block' : 'none' }}>
                        {(< CardArtist props = {propsForCards}/>)}
                    </div>

                    <div style={{ display: showVenue ? 'block' : 'none' }}>
                        {(< CardVenue props = {propsForCards}/>)}
                    </div>

                    {/* <div id="myCarousel" class="carousel slide" data-interval="false" data-ride="carousel">

                      <div class="carousel-inner">
                        <div class="carousel-item active">
                            {(< CardEvents props = {propsForCards}/>)}
                            <p>p1</p>
                        </div>

                        <div class="carousel-item">
                            <p>p2</p>

                        </div>
                      
                        <div class="carousel-item">
                            {(< CardVenue props = {propsForCards}/>)}
                            <p>p3</p>

                        </div>
                      </div>
                    </div> */}

                    {/* <div>                      
                        {showEvents && (< CardEvents props = {propsForCards}/>)}
                        {showArtist && (< CardArtist props = {propsForCards}/>)}
                        {showVenue && (< CardVenue props = {propsForCards}/>)}
                    </div> */}
                  </div>
                  <div className="col-md-2"></div>
                </div>
              </div>
            <br></br>
            <br></br>
            <br></br>
         </div>)
  }

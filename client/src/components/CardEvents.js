import React, { useState, useEffect } from "react";
import './event.css'
import axios from "axios";


export default function CardEvents(props) {

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


    React.useEffect(() => {

        const getData = setTimeout(async () => {
            const response = await axios.get(`/api/getCardEventDetails?id=${props.props.eventId}`);
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
    
        }, 10)
    
        return () => clearTimeout(getData)
        }, [])

        // useEffect (()=>{
        //     props.getDataValue(eventDetails)
        // })


    var urlFaceBook = "https://www.facebook.com/sharer/sharer.php?u=" + buyTickets +"&amp;src=sdkpreparse"

    var urlTwitter = "http://twitter.com/share?text= Check "+ event +"&url="+ buyTickets;
    return (
        <div>

            <div className="container-fluid">
                <div className="row">

                    <div className="col-md-6 text-center"> 
                    {date && <div className="m-3"> <div style = {{color : "#73f9df", fontWeight : "bold"}}>Date</div> <div style={{color : "#ECF0F1"}}> {date}</div></div>}
                    {artist && <div className="m-3"> <div style = {{color : "#73f9df", fontWeight : "bold"}}>Artist/Team</div> <div style={{color : "#ECF0F1"}}> {artist}</div></div>}
                    {genre && <div className="m-3"> <div style = {{color : "#73f9df", fontWeight : "bold"}}>Genre</div> <div style={{color : "#ECF0F1"}}> {genre}</div></div>}
                    {priceRanges && <div className="m-3"> <div style = {{color : "#73f9df", fontWeight : "bold"}}>Price Range</div> <div style={{color : "#ECF0F1"}}> {priceRanges}</div></div>}
                    {ticketStatus && <div className="m-3" > <div style = {{color : "#73f9df", fontWeight : "bold"}}>Ticket Status</div><button className={ticketStatus}> {ticketStatus}</button></div>}
                    {buyTickets && <div className="m-3"> <div style = {{color : "#73f9df", fontWeight : "bold"}}>Buy Tickets At:</div> <a target="_blank" href={buyTickets}>Ticketmaster</a></div>}

                    </div>

                    <div className="col-md-6 text-center"> 
                        <img className = "mt-5" src={seatmap} style= {{width : "75%"}} alt="" />
                    </div>

                </div>

            </div>

            
            <br></br>
            {(date || artist || genre || ticketStatus) && (<div className="text-center">
                <span style={{color : "#ECF0F1"}}>Share On : </span>
                <a target="_blank" href={urlTwitter}><i className="fa-brands fa-twitter fa-lg m-1" style={{color : "#00acee"}}></i></a>
                <a target="_blank" href={urlFaceBook}><i className="fa-brands fa-facebook  fa-lg m-1"></i></a>
            </div>)}
            <br></br>
            <br></br>
        </div>
    )

}
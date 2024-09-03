import React, { useState, useEffect } from "react";
import axios from "axios";
import './artist.css'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";


export default function CardArtist(props) {
  const [artist, setArtist] = useState([]);

  React.useEffect(() => {

    const getData = setTimeout(async () => {
        const response = await axios.get(`/api/searchArtist?id=${props.props.eventId}&genre=${props.props.genre}`);
        const apiResponse = response.data;

        setArtist(apiResponse)

    }, 1000)

    return () => clearTimeout(getData)
    }, [])

  console.log(props);



  return (
    <div>

      {props.props.genre === "Music" && (
        <div id="artist-carousel" className="carousel slide" data-bs-ride="carousel">
          
          <div className="container-fluid">
          <div className="carousel-inner">
            {artist.map((item, index) => (
              <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>

                <div className="row" style={{marginLeft: '60px', marginRight: "60px"}}>
                  <div className="col-md-3 text-center"> 
                    <div className="m-3">
                      <img src={item[Object.keys(item)].artistImage} className="rounded-circle img-fluid"/>
                      <p style={{color:"#73f9df"}}>{item[Object.keys(item)].name}</p>
                    </div>
                  </div>
                  <div className="col-md-3 text-center" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}> 
                    <p style={{color:"#73f9df"}}><b>Popularity</b></p>
                    <div style={{height : "35px", width : "35px"}}>
                      <CircularProgressbar styles={buildStyles({pathColor: 'red', trailColor: "transparent", textColor : "white", textSize: '40px'})} value={Math.min(Math.max(parseFloat(item[Object.keys(item)].popularity), 0), 100)} text={`${Math.min(Math.max(parseFloat(item[Object.keys(item)].popularity), 0), 100)}`} />;

                    </div>

                  </div>
                  <div className="col-md-3 text-center" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}> 
                    <p style={{color:"#73f9df"}}><b>Followers</b></p><p style={{color:"#fff"}}>{item[Object.keys(item)].followerCount.toLocaleString()}</p>
                  </div>
                  <div className="col-md-3 text-center pt-2" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <a target="_blank" href={item[Object.keys(item)].externalUrl} style={{color:"#73f9df"}}><b>Spotify Link</b></a>
                    <br></br>
                    <FontAwesomeIcon icon={faSpotify} style={{ color: "#1db954", fontSize:'40px' }} />
                  </div>
                </div>


                <div className="justify-content-center" style={{marginLeft: '60px', marginRight: "60px"}}>
                  {console.log("2nd Row", item[Object.keys(item)].image)}
                  {/* {index === 1 && item[Object.keys(item)].albumImages && item[Object.keys(item)].albumImages.map((album, albumIndex) => (
                    <div key={albumIndex} className="col-md-4 text-center" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <img src={album.url} className="img-fluid"/>
                    </div>
                  ))}  */}
                  <br></br> 
                  <div >
                  <p style={{color:"#73f9df", textAlign : "center"}}><b>Album featuring {item[Object.keys(item)].name}</b></p>
                  </div>
                  <div className="d-md-flex justify-content-center">
                      {item[Object.keys(item)].image.map((image, index) => (
                          <div className="p-3"> <img src={image} className="img-fluid" style= {{width : 250}} /> </div>
                      ))}
                  </div>

                  <br></br>
                  <br></br>
                  
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#artist-carousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#artist-carousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
          </button>
        </div>
        </div>
      )}

      {props.props.genre !== "Music" && (<div className="container text-center">
          <br></br><br></br><br></br>
           <div className="container p-5"> <p style={{background : "white", color : "red"}}> No music related artist details to show</p></div>
           <br></br><br></br><br></br>
           </div>)
        }
  </div>
        
  );
}


// {myList.length === 0  && (<div className="container text-center">
//         <div> <p style={{background : "white", color : "red"}}> No favorite events to show</p></div>
//         </div>)}

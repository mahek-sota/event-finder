const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios')
const SpotifyWebApi = require('spotify-web-api-node');
const geohash = require('ngeohash');
const cors = require('cors');

const app = express();
app.use(cors());


const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

process.on('uncaughtException', (error)  => {
  console.log('Error ',  error);
  process.exit(1); // exit application 

})

process.on('unhandledRejection', (error, promise) => {
  console.log(' The error was: ', error );
});

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Not Express' });
  console.log("Hello")

});


app.get('/api/getAutoSuggestions', async (req, res) =>{
  console.log("Hello api suggestions")
  try{
    keywordInput = req.query.keyword
    const result = await axios.get("https://app.ticketmaster.com/discovery/v2/suggest?apikey=HRj17zI6WyeFfw0Y1j0FOmPY0C7v4CD9&keyword=" + keywordInput, {
    });

    
    if ("_embedded" in result.data && "events" in result.data._embedded)
    {
      const eventsSection = result.data._embedded.events
      const newArray = eventsSection.map(({ id, name }) => ({ id, name }));
      console.log(newArray)
      res.send(newArray);
    }
    else{
      const newArray = []
      res.send(newArray);
    }


  } catch (error) {
    console.error("This the error", error);
    res.send([])
    //res.status(500).send('Something went wrong in autocomplete api call');
  }
});

app.get('/api/getLocationCoordinates', async (req, res) =>{
  locationInput = req.query.location
  const result = await axios.get("https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyByU0eQL7mxd2hAA9H42KnlcScPDtStfuk&address="+locationInput, {
  });

  //console.log("Inside Google Call", result.data.results[0].geometry.location.lng)

  if (result.data.results.length != 0  && "geometry" in result.data.results[0])
  {
    const locationJson = result.data.results[0].geometry.location
    const newArray = [{lat : locationJson.lat , lng : locationJson.lng}]
    res.send(newArray);
  }
  else{
    const newArray = ["", ""]
    res.send(newArray);
  }
});

//http://localhost:5000/api/getResultsTable?lat=34.0030&lng=-118.2863&radius=10&keyword=Los%20Angels

app.get('/api/getResultsTable', async (req, res) =>{
  
  try{
    keyword = req.query.keyword
    category = req.query.category
    radius = req.query.radius
    lat = req.query.lat
    lng = req.query.lng
  
    let segmentId; // declare segmentId outside of the if statement
  
    if (category !== 'Default') {
      if (category === 'Music') {
        segmentId = 'KZFzniwnSyZfZ7v7nJ';
      }
      if (category === 'Sports') {
        segmentId = 'KZFzniwnSyZfZ7v7nE';
      }
      if (category === 'Arts' || category === 'Theatre') {
        segmentId = 'KZFzniwnSyZfZ7v7na';
      }
      if (category === 'Film') {
        segmentId = 'KZFzniwnSyZfZ7v7nn';
      }
      if (category === 'Miscellaneous') {
        segmentId = 'KZFzniwnSyZfZ7v7n1';
      }
    }
    else{
      segmentId = "";
    }
  
    const result = await axios.get("https://app.ticketmaster.com/discovery/v2/events.json?apikey=HRj17zI6WyeFfw0Y1j0FOmPY0C7v4CD9&keyword="+keyword+"&radius="+radius+"&unit=miles&latlong="+ lat +","+lng+'&segmentId='+segmentId,{
    });
    console.log("https://app.ticketmaster.com/discovery/v2/events.json?apikey=HRj17zI6WyeFfw0Y1j0FOmPY0C7v4CD9&keyword="+keyword+"&radius="+radius+"&unit=miles&latlong="+ lat +","+lng+'&segmentId='+segmentId);
  
    if ("_embedded" in result.data && "events" in result.data._embedded)
    {
      const eventsSection = result.data._embedded.events
      const newArray = []
      
      for(let i = 0; i < eventsSection.length && i < 20; i++){

        try{
          var dateToAdd = eventsSection[i].dates.start.localDate + " " +eventsSection[i].dates.start.localTime
          }
          catch{
              var dateToAdd = ""
          }

        try{
          var iconToAdd = eventsSection[i].images[0].url
          }
          catch{
              var iconToAdd = ""
          }

          try{
            var eventToAdd = eventsSection[i].name
          }
          catch{
              var eventToAdd = ""
          }

          try{
            var genreToAdd = (eventsSection[i].classifications[0].segment.name !== 'Undefined') ? eventsSection[i].classifications[0].segment.name : ""
          }
          catch{
              var genreToAdd = ""
          }
          try{
            var venueToAdd = eventsSection[i]._embedded.venues[0].name
          }
          catch{
            var venueToAdd = ""
          }

          newArray.push({id : i,
                        date : dateToAdd,
                        icon : iconToAdd,
                        event : eventToAdd,
                        genre : genreToAdd,
                        venue : venueToAdd,
                        eventId : eventsSection[i].id
                      })
      }
  
      res.send(newArray);
    }
    else{
      const newArray = []
      res.send(newArray);
    }
  } catch(err){
    console.error(error);
    const newArray = []
    res.send(newArray);
    //res.status(500).send('Something went wrong in result table api call');
  }

});


app.get('/api/getAutoLocationCoordinates', async (req, res) =>{
  const result = await axios.get("https://ipinfo.io/?token=549f78bcd28462", {
  });
  const splited = result.data.loc.split(",")
  const newArray = [{lat : splited[0] , lng : splited[1]}]
  //console.log("Inside Auto Call", result.data.loc)
  res.send(newArray)
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

//http://localhost:5000/api/getCardEventDetails?id=Z7r9jZ1Adp33p
app.get('/api/getCardEventDetails', async (req, res) =>{
  try{
    id = req.query.id

    const result = await axios.get("https://app.ticketmaster.com/discovery/v2/events.json?apikey=HRj17zI6WyeFfw0Y1j0FOmPY0C7v4CD9&id=" + id , {
    });
  
    const eventsSection = result.data._embedded.events
    
    if ("attractions" in eventsSection[0]._embedded)
    {
      attractionsLength = eventsSection[0]._embedded.attractions.length
      artistList = "";
      for(let i = 0; i < attractionsLength; i++){
        console.log(eventsSection[0]._embedded.attractions[i].name)
        artistList = artistList.concat(eventsSection[0]._embedded.attractions[i].name, " | ")
      }
      artistList = artistList.slice(0, -3)
  
    }
    else{
        artistList = ""
    }
    
    
    var eventGenre = ""
    if ("classifications" in eventsSection[0] ){
      if("subGenre" in eventsSection[0].classifications[0]){
          if(eventsSection[0].classifications[0].subGenre.name !== 'Undefined'){
          eventGenre = eventGenre.concat(eventsSection[0].classifications[0].subGenre.name, ' | ' );
        }
      }
        if("genre" in eventsSection[0].classifications[0]){
          if(eventsSection[0].classifications[0].genre.name !== 'Undefined'){
          eventGenre = eventGenre.concat( eventsSection[0].classifications[0].genre.name, ' | ' );
        }
      }
        if("segment" in eventsSection[0].classifications[0]){
          if(eventsSection[0].classifications[0].segment.name !== 'Undefined'){
          eventGenre = eventGenre.concat(eventsSection[0].classifications[0].segment.name, ' | ' );
        }
      }
        if("subType" in eventsSection[0].classifications[0]){
          if(eventsSection[0].classifications[0].subType.name !== 'Undefined'){
          eventGenre = eventGenre.concat( eventsSection[0].classifications[0].subType.name, ' | ' );
        }
      }
        if("type" in eventsSection[0].classifications[0]){
          if(eventsSection[0].classifications[0].type.name !== 'Undefined'){
          eventGenre = eventGenre.concat( eventsSection[0].classifications[0].type.name, ' | ');
        }
      }
    }

    eventGenre = eventGenre.slice(0, -3)
  
    var eventPriceRanges = "";
    if(eventsSection[0].hasOwnProperty('priceRanges')){
      eventPriceRanges = eventsSection[0].priceRanges[0].min + '-' + eventsSection[0].priceRanges[0].max + " " + eventsSection[0].priceRanges[0].currency;   
    }
    
    var eventSeatmap = ""
    if(eventsSection[0].hasOwnProperty('seatmap')){
      eventSeatmap = eventsSection[0].seatmap.staticUrl;
    }
    
    var eventTicketStaus = ""
    try {
      eventTicketStaus = eventsSection[0].dates.status.code;
    }
    catch{
      eventTicketStaus = ""
    }

    var eventBuyTickets ="";
    try {
      eventBuyTickets = eventsSection[0].url;
    }
    catch{
      eventBuyTickets = ""
    }

    try{
      var dateToAdd = eventsSection[0].dates.start.localDate
    }
    catch{
        var dateToAdd = ""
    }

    try{
      var iconToAdd = eventsSection[0].images[0].url
      }
      catch{
          var iconToAdd = ""
      }

      try{
        var eventToAdd = eventsSection[0].name
    }
    catch{
        var eventToAdd = ""
    }

    try{
      var genreToAdd = (eventsSection[0].classifications[0].segment.name !== 'Undefined') ? eventsSection[i].classifications[0].segment.name : ""
    }
    catch{
        var genreToAdd = ""
    }
    try{
      var venueToAdd = eventsSection[0]._embedded.venues[0].name
    }
    catch{
      var venueToAdd = ""
    }
  
    const newArray = [{date : dateToAdd,
      icon : iconToAdd,
      event : eventToAdd,
      genre : genreToAdd,
      venue : venueToAdd,
      eventId : eventsSection[0].id,
      artist : artistList,
      genre : eventGenre,
      priceRanges : eventPriceRanges,
      seatmap : eventSeatmap,
      ticketStatus : eventTicketStaus,
      buyTickets : eventBuyTickets
    }]
  
    res.send(newArray)
  } catch(err){
    console.error(error);
    const newArray = [{date : "",
      icon : "",
      event : "",
      genre : "",
      venue : "",
      eventId : "",
      artist : "",
      genre : "",
      priceRanges : "",
      seatmap : "",
      ticketStatus : "",
      buyTickets : ""
    }]

    res.send(newArray)

    //res.status(500).send('Something went wrong in event card api call');
  }

});
// G5vzZ98HqTJVv -- This id has all info required
app.get('/api/getCardVenueDetails', async (req, res) =>{
  try{
    id = req.query.id

    const result = await axios.get("https://app.ticketmaster.com/discovery/v2/events.json?apikey=HRj17zI6WyeFfw0Y1j0FOmPY0C7v4CD9&id=" + id , {
    });
  
    var name = "";
    var address = "";
    var city = "";
    var state = "";
    var phoneNumber = "";
    var openHours = "";
    var generalRule = "";
    var childRule = "";
    var lng = "";
    var lat = "";
  
    const eventsSection = result.data._embedded.events
    const venueSection = result.data._embedded.events[0]._embedded.venues[0]
  
  
    if("name" in venueSection){
      name = venueSection.name;
    }
  
    if("address" in venueSection && "line1" in venueSection.address){
      address = venueSection.address.line1;
    }
  
    if("city" in venueSection && "name" in venueSection.city){
      city = venueSection.city.name;
    }
  
    if("state" in venueSection && "name" in venueSection.state){
      state = venueSection.state.name;
    }
  
    if("location" in venueSection && "longitude" in venueSection.location){
      lng = venueSection.location.longitude;
    }
  
    if("location" in venueSection && "latitude" in venueSection.location){
      lat = venueSection.location.latitude;
    }
  
    
    if("boxOfficeInfo" in venueSection){
        if("phoneNumberDetail" in venueSection.boxOfficeInfo){
            phoneNumber = venueSection.boxOfficeInfo.phoneNumberDetail
        }
        if("openHoursDetail" in venueSection.boxOfficeInfo){
            openHours = venueSection.boxOfficeInfo.openHoursDetail
        }
    }
  
    if("generalInfo" in venueSection){
        if("generalRule" in venueSection.generalInfo){
            generalRule = venueSection.generalInfo.generalRule
        }
        if("childRule" in venueSection.generalInfo){
            childRule = venueSection.generalInfo.childRule
        }
    }
  
  
    const newArray = [{ name: name,
      address : address,
      city : city,
      state : state,
      phoneNumber : phoneNumber,
      openHours : openHours,
      generalRule : generalRule,
      childRule : childRule,
      lat : lat,
      lng : lng
    }]
  
    res.send(newArray)
  } catch(err){
    console.error(error);
    const newArray = [{ name: "",
      address : "",
      city : "",
      state : "",
      phoneNumber : "",
      openHours : "",
      generalRule : "",
      childRule : "",
      lat : "",
      lng : ""
    }]
    
    res.send(newArray)

    //res.status(500).send('Something went wrong in venue card api call');
  }

});


const { ClientId, ClientSecret } = process.env;
const spotifyApi = new SpotifyWebApi({
  clientId: '811382ebbfaa4b65904a518b327080ed',
  clientSecret: 'c00b954406794301abdd11b9f735e1aa',
  // redirectUri: 'http://localhost:8888/callback'
});

const getAccessToken = async () => {
  const data = await spotifyApi.clientCredentialsGrant();
  return data.body.access_token;
}

app.get('/api/searchArtist', async (req, res) => {

  try{
    id = req.query.id
    genre = req.query.genre
  
    console.log("GENRE -- ", genre)
  
    if (genre === "Music"){
  
      const accessToken = await getAccessToken();
      spotifyApi.setAccessToken(accessToken);
  
      const result = await axios.get("https://app.ticketmaster.com/discovery/v2/events.json?apikey=HRj17zI6WyeFfw0Y1j0FOmPY0C7v4CD9&id=" + id , {
      });  
      
      if ("_embedded" in result.data && "events" in result.data._embedded){
        const artistSection = result.data._embedded.events
        const artistList = artistSection[0]._embedded.attractions.map(attraction => attraction.name);
        
        const artistDetails = [];
        for(const artist of artistList){
          const response = await spotifyApi.searchArtists(artist);
          artistDetails.push(response.body.artists.items[0]);
        }
    
        const artistId = artistDetails.map(artist => artist.id);
        const nameOfArtist = await Promise.all(artistId.map(async (id) => {
          const response = await spotifyApi.getArtist(id);
          return response.body.name;
        }));
        const artistFollowers = await Promise.all(artistId.map(async (id) => {
          const response = await spotifyApi.getArtist(id);
          return response.body.followers.total;
        }));
        const artistPopularity = await Promise.all(artistId.map(async (id) => {
          const response = await spotifyApi.getArtist(id);
          return response.body.popularity;
        }));
        const externalURL = await Promise.all(artistId.map(async (id) => {
          const response = await spotifyApi.getArtist(id);
          return response.body.external_urls.spotify;
        }));
    
        const newArray = [];
        for(let i = 0; i < artistDetails.length; i++) {
          const artist = artistDetails[i];
          const response = await spotifyApi.getArtistAlbums(artist.id, {limit: 3});
          const topThreeAlbums = response.body.items.slice(0, 3).map(album => album.name);
          const albumImages = await Promise.all(response.body.items.slice(0, 3).map(async album => {
            const albumDetails = await spotifyApi.getAlbum(album.id);
            return albumDetails.body.images[0].url;
          }));
          newArray.push({
            [artist.name]: {
              name: nameOfArtist[i],
              followerCount: artistFollowers[i],
              popularity: artistPopularity[i],
              externalUrl: externalURL[i],
              artistImage: artist.images[0].url,
              // topThreeAlbums,
              image: albumImages
            },
          });
        }
    
        console.log(newArray)
        res.send(newArray); 
      }
    }
    else{
  
      res.send([])
    }
  } catch(err){
    console.error(error);
    
    res.send([])
    //res.status(500).send('Something went wrong in spotify api call');
  }

});


app.set('trust proxy', true);
app.listen(port, () => console.log(`Listening on port ${port}`));
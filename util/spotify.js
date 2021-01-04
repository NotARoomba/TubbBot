var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});
spotifyApi.clientCredentialsGrant()
      .then( (data) => {
        let TOKEN;
          console.log('The access token expires in ' + data.body['expires_in']);
          console.log('The access token is ' + data.body['access_token']);
          // Save the access token so that it's used in future calls
          TOKEN = data.body['access_token']
          spotifyApi.setAccessToken(TOKEN);
      }, function (err) {
          console.log('Something went wrong when retrieving an access token', err.message);
      });
// var spotifyApi = new SpotifyWebApi({
//     clientId: process.env.SPOTIFY_CLIENT_ID,
//     clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
//   });
//   spotifyApi.clientCredentialsGrant()
//         .then(async function (data) {
//             spotifyApi.setAccessToken(data.body['access_token']);
//         })
  // spotifyApi.clientCredentialsGrant().then( (data) => {
  //   console.log('The access token is ' + data.body['access_token']);
  //   spotifyApi.setAccessToken(data.body['access_token']);
  //   spotifyApi.setRefreshToken(data.body['refresh_token']);
  // },  (err) =>  {
  //   console.log('Something went wrong!', err);
  // })
  
  // exports.spotifyApi = spotifyApi
  // const spotifyApi = () => {
  //   spotifyApi2.clientCredentialsGrant().then(
  //     data => {
  //       console.log('The access is ' + data.body['access_token']);
  //       console.log('The access token expires in ' + data.body['expires_in']);
  //       spotifyApi2.setAccessToken(data.body['access_token']);
  //       setTimeout(() => spotifyApi(), (data.body['expires_in'] - 20) * 1000);
  //     },
  //     err => {
  //       console.log('Something went wrong when retrieving an access token', err);
  //       process.exit(1);
  //     }
  //   );
  // }
  // spotifyApi();


    
 
        
        // spotifyApi.clientCredentialsGrant()
        //     .then( (data) => {
        //       let TOKEN;
        //         console.log('The access token expires in ' + data.body['expires_in']);
        //         console.log('The access token is ' + data.body['access_token']);
        //         // Save the access token so that it's used in future calls
        //         TOKEN = data.body['access_token']
        //         spotifyApi.setAccessToken(TOKEN);
        //     }, function (err) {
        //         console.log('Something went wrong when retrieving an access token', err.message);
        //     });
    
          
      
            
        
  
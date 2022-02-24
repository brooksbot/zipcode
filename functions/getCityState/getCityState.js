const fetch = require('node-fetch')

const USER_ID = process.env.REACT_APP_USERID;
const BASE_URI =
  "http://production.shippingapis.com/ShippingAPITest.dll?API=CityStateLookup&XML=";
  const config = {
    headers: {
      "Content-Type": "text/xml",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Methods": "GET",
    },
    method: "get",
  };


  exports.handler = async function (event, context) {
    // The zipcode is sent by the frontend application. This is where we use it.
    const zipcode = event.queryStringParameters.zipcode;
    
    // The xml variable is the string we are going to send to the USPS to request the information
    const xml = `<CityStateLookupRequest USERID="${USERID}"><ZipCode ID="0"><Zip5>${zipcode}</Zip5></ZipCode></CityStateLookupRequest>`;
    try {
      // Using (async/await) we send a fetch request with all the required information to the USPS
      const response = await fetch(`${BASE_URI}${xml}`, config);
      // First check if we got a good response.  response.ok is asking did we receive a good response?
      if (!response.ok) {
        // If we get a good response, we store the reponse in the variable. 
        return { statusCode: response.status, body: response };
      }
      // Format the response as text because the USPS is xml, not JSON.
      const data = await response.text();
      // Return the response to the frontend where it will be used.
      return {
        statusCode: 200,
        body: data,
      };
      // Error checking is important because if we don't get a response, this is how we will troubleshoot any errors
    } catch (err) {
      console.log("Error: ", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ msg: err.message }),
      };
    }
  };

























// const handler = async function () {
//   try {
//     const response = await fetch('https://icanhazdadjoke.com', {
//       headers: { Accept: 'application/json' },
//     })
//     if (!response.ok) {
//       // NOT res.status >= 200 && res.status < 300
//       return { statusCode: response.status, body: response.statusText }
//     }
//     const data = await response.json()

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ msg: data.joke }),
//     }
//   } catch (error) {
//     // output to netlify function log
//     console.log(error)
//     return {
//       statusCode: 500,
//       // Could be a custom message or object i.e. JSON.stringify(err)
//       body: JSON.stringify({ msg: error.message }),
//     }
//   }
// }

module.exports = { handler }

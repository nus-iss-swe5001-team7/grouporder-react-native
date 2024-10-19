// constants/projUrl.ts

export let projEnv = 'production'; // Declare specific environment types
export let projUrl: string = ''; // Initialize projUrl with a default value

if (projEnv === 'development') {
    //Remote Mock endpoint
    // projUrl = "https://0vl43.wiremockapi.cloud";
    //Local microservice endpoint, change to your dev pc own local ip
    projUrl = "http://192.168.50.148:8765";
} else if (projEnv === 'production') {
    projUrl = "http://group-order-lb-621478777.ap-southeast-1.elb.amazonaws.com";
}

export default projUrl;


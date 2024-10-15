// constants/projUrl.ts

export let projEnv: 'development' | 'production' = 'development'; // Declare specific environment types
export let projUrl: string = ''; // Initialize projUrl with a default value

if (projEnv === 'development') {
    //Remote Mock endpoint
    projUrl = "https://0vl43.wiremockapi.cloud";
    //Local microservice endpoint, change to your dev pc own local ip
    // projUrl = "http://192.168.50.148:8765";
} else if (projEnv === 'production') {
    projUrl = "https://aws02161231237123638.com";
}

export default projUrl;


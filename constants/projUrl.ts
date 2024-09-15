// constants/projUrl.ts

export let projEnv: 'development' | 'production' = 'development'; // Declare specific environment types
export let projUrl: string = ''; // Initialize projUrl with a default value

if (projEnv === 'development') {
    projUrl = "https://0vl43.wiremockapi.cloud";
} else if (projEnv === 'production') {
    projUrl = "https://aws02161231237123638.com";
}

export default projUrl;


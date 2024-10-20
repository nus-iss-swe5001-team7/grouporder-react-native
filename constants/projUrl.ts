// constants/projUrl.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

export let projEnv = 'development'; // Default environment
export let projUrl: string = '';

export const getProjUrl = async (): Promise<string> => {
    const storedEnv = await AsyncStorage.getItem('projEnv');
    projEnv = storedEnv || projEnv;  // Use stored environment if available, otherwise default to 'development'

    if (projEnv === 'development') {
        projUrl = "https://0vl43.wiremockapi.cloud";
        //Local microservice endpoint, change to your dev pc own local ip
        // projUrl = "http://192.168.50.148:8765";
    } else if (projEnv === 'production') {
        projUrl = "http://group-order-lb-621478777.ap-southeast-1.elb.amazonaws.com";
    }

    return projUrl;
};

export default getProjUrl;



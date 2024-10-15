import axios from 'axios';
import { GetPoolsInfoApiResponse } from '../types';
const BASE_API_URL = 'https://api-v3.raydium.io/';

export const getPoolsInfo = async (ids: string): Promise<GetPoolsInfoApiResponse> => {
    try {
        const response = await axios.get<GetPoolsInfoApiResponse>(
            `${BASE_API_URL}pools/info/ids?ids=${encodeURIComponent(ids)}`,
            {
                headers: {
                    accept: 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        return {
            id: '',
            success: false,
            data: [],
        };
    }
};

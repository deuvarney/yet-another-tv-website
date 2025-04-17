import { IdAppendToResponseRequest, ShowResponse, TrendingRequest, TrendingResponse, TvSeasonRequest, TvSeasonResponse } from "@/modules/moviedb-promise-main/dist";
import { AxiosRequestConfig } from "axios";
import { TMDBInstance } from "./tmdbInstanceImpl";

export class TMDBInstanceLocalImpl extends TMDBInstance {

    constructor(apiKey: string) {
        super(apiKey, 'http://localhost:3006/');}

    

    // trending(params: TrendingRequest, axiosConfig?: AxiosRequestConfig): Promise<TrendingResponse> {
    //     const reqParams = new URLSearchParams(params as unknown as Record<string, string>);
    //     return fetch(`http://localhost:3006/tv-shows?${reqParams}`, { method: 'GET', }).then(res => res.json())

    // }

    // seasonInfo(params: TvSeasonRequest, axiosConfig?: AxiosRequestConfig): Promise<TvSeasonResponse> {
    //     return fetch(`http://localhost:3006/tv-shows/${params.id}/season/${params.season_number}`, { method: 'GET', }).then(res => res.json())

    // }

    // tvInfo(params: string | number | IdAppendToResponseRequest, axiosConfig?: AxiosRequestConfig): Promise<ShowResponse> {
    //     return fetch(`http://localhost:3006/tv-shows/${params.id}`, { method: 'GET', }).then(res => res.json())

    // }

    // trending(params: TrendingRequest, axiosConfig?: AxiosRequestConfig): Promise<TrendingResponse> {
    //         return this.movieDB.trending(params, axiosConfig);
    //     }


}
import { SearchTvRequest, TvResultsResponse, TvSeasonRequest, TvSeasonImagesResponse, TvSeasonResponse, VideosResponse, TrendingRequest, TrendingResponse, IdAppendToResponseRequest, ShowResponse, PagedRequestParams, MovieDb, RequestParams, GenresResponse, ConfigurationResponse, EpisodeRequest, EpisodeVideosResponse } from "@/modules/moviedb-promise-main/src";
import { AxiosRequestConfig } from "axios";
import { TMDBInstanceInterface } from "./interface/tmdbInstance";

export class TMDBInstance implements TMDBInstanceInterface {

    apiKey: string;

    movieDB: MovieDb;

    constructor(apiKey: string, baseUrl: string = 'https://api.themoviedb.org/3/') {
        this.apiKey = apiKey;
        this.movieDB = new MovieDb(apiKey, baseUrl);
    }

    configuration(axiosConfig?: AxiosRequestConfig): Promise<ConfigurationResponse> {
        return this.movieDB.configuration(axiosConfig);
    }

    episodeVideos(params: EpisodeRequest, axiosConfig?: AxiosRequestConfig): Promise<EpisodeVideosResponse> {
        return this.movieDB.episodeVideos(params, axiosConfig);
    }

    genreTvList(params?: RequestParams, axiosConfig?: AxiosRequestConfig): Promise<GenresResponse> {
        return this.movieDB.genreTvList(params, axiosConfig);
    }
    
    
    searchTv(params: SearchTvRequest, axiosConfig?: AxiosRequestConfig): Promise<TvResultsResponse> {
        return this.movieDB.searchTv(params, axiosConfig);
    }

    seasonImages(params: TvSeasonRequest, axiosConfig?: AxiosRequestConfig): Promise<TvSeasonImagesResponse> {
        return this.movieDB.seasonImages(params, axiosConfig);
    }

    seasonInfo(params: TvSeasonRequest, axiosConfig?: AxiosRequestConfig): Promise<TvSeasonResponse> {
        return this.movieDB.seasonInfo(params, axiosConfig);
    }

    seasonVideos(params: TvSeasonRequest, axiosConfig?: AxiosRequestConfig): Promise<VideosResponse> {
        return this.movieDB.seasonVideos(params, axiosConfig);
    }

    trending(params: TrendingRequest, axiosConfig?: AxiosRequestConfig): Promise<TrendingResponse> {
        return this.movieDB.trending(params, axiosConfig);
    }

    tvInfo(params: string | number | IdAppendToResponseRequest, axiosConfig?: AxiosRequestConfig): Promise<ShowResponse> {
        return this.movieDB.tvInfo(params, axiosConfig);
    }

    tvPopular(params: PagedRequestParams, axiosConfig?: AxiosRequestConfig): Promise<TvResultsResponse> {
        return this.movieDB.tvPopular(params, axiosConfig);
    }
    
}
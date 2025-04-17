
import { ConfigurationResponse, EpisodeRequest, EpisodeVideosResponse, GenresResponse, IdAppendToResponseRequest, PagedRequestParams, RequestParams, SearchTvRequest, ShowResponse, TrendingRequest, TrendingResponse, TvResultsResponse, TvSeasonImagesResponse, TvSeasonRequest, TvSeasonResponse, VideosResponse } from "@/modules/moviedb-promise-main/src";
import { AxiosRequestConfig } from 'axios';


export interface TMDBInstanceInterface {

    configuration(axiosConfig?: AxiosRequestConfig): Promise<ConfigurationResponse>

    episodeVideos(params: EpisodeRequest, axiosConfig?: AxiosRequestConfig): Promise<EpisodeVideosResponse>

    genreTvList(params?: RequestParams, axiosConfig?: AxiosRequestConfig): Promise<GenresResponse>

    searchTv(params: SearchTvRequest, axiosConfig?: AxiosRequestConfig): Promise<TvResultsResponse>

    seasonImages(params: TvSeasonRequest, axiosConfig?: AxiosRequestConfig): Promise<TvSeasonImagesResponse>

    seasonInfo(params: TvSeasonRequest, axiosConfig?: AxiosRequestConfig): Promise<TvSeasonResponse>

    seasonVideos(params: TvSeasonRequest, axiosConfig?: AxiosRequestConfig): Promise<VideosResponse>

    trending(params: TrendingRequest, axiosConfig?: AxiosRequestConfig
    ): Promise<TrendingResponse>

    tvInfo(params: string | number | IdAppendToResponseRequest, axiosConfig?: AxiosRequestConfig): Promise<ShowResponse>

    tvPopular(params: PagedRequestParams, axiosConfig?: AxiosRequestConfig
    ): Promise<TvResultsResponse>



}
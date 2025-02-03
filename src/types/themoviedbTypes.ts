// TODO: Check if this file is actually being used

import {
    Episode as MovieDBEpisode,
    GuestStar as MovieDBGuestStar,
    Crew as MovieDBCrew,
} from '@/modules/moviedb-promise-main/dist/request-types';


export interface CreatedBy {
    credit_id: string;
    gender: number;
    id: number;
    name: string;
    original_name: string;
    profile_path: string;
  }

export interface Crew extends MovieDBCrew {

}

export interface GuestStar extends MovieDBGuestStar {
    // gender: number;
    // original_name: string;
}

interface Network {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }

export type Show = {
    backdrop_path: string;
    created_by: CreatedBy[];
    first_air_date: string;
    genre_ids: number[];
    homepage: string;
    id: number;
    last_episode_to_air?: Episode;
    name: string;
    networks: Network[];
    next_episode_to_air?: Episode;
    number_of_seasons: number;
    origin_country: string[];
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string;
    vote_average: number;
    vote_count: number;
    year: number;
    seasons: Season[];
    status: string;
    tagline?: string;
}

export type Season = {
    air_date?: string;
    id?: number;
    name?: string;
    season_number?: number;
    episodes?: Episode[];
    vote_average?: number;
}

export type Episode = MovieDBEpisode & {
    // air_date: string;
    // episode_number: number;
    // id: string;
    // name: string;
    // overview: string;
    // season_number: number;
    // still_path: string;
    // vote_average: number;
    guest_stars?: GuestStar[];
}

export enum SHOW_FILTER_TYPE {
    SHOW_TYPE_POPULAR,
    SHOW_TYPE_TRENDING,
}

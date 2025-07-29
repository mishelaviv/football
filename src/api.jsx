import axios from "axios";

export const getLeagues  = ()                => axios.get("https://app.seker.live/fm1/leagues");
export const getTeams    = (lid)             => axios.get(`https://app.seker.live/fm1/teams/${lid}`);
export const getHistory  = (lid)             => axios.get(`https://app.seker.live/fm1/history/${lid}`);
export const getRound    = (lid, r)          => axios.get(`https://app.seker.live/fm1/round/${lid}/${r}`);
export const getSquad    = (lid, tid)        => axios.get(`https://app.seker.live/fm1/squad/${lid}/${tid}`);
export const getTeamHist = (lid, tid)        => axios.get(`https://app.seker.live/fm1/history/${lid}/${tid}`);

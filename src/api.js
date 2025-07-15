import axios from "axios";
const BASE = "https://app.seker.live/fm1";

export const getLeagues  = ()              => axios.get(`${BASE}/leagues`);
export const getTeams    = (lid)           => axios.get(`${BASE}/teams/${lid}`);
export const getHistory  = (lid)           => axios.get(`${BASE}/history/${lid}`);
export const getRound    = (lid,r)         => axios.get(`${BASE}/round/${lid}/${r}`);
export const getSquad    = (lid,tid)       => axios.get(`${BASE}/squad/${lid}/${tid}`);
export const getTeamHist = (lid,tid)       => axios.get(`${BASE}/history/${lid}/${tid}`);

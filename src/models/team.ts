import { ObjectId } from "mongodb";

export default class Team {
  constructor(
    public team: string,
    public grandFrix: string,
    public date: string,
    public year: number,
    public points: number,
    public position?: number,
    public _id?: ObjectId) { }
}

export interface ITeam {
  team: string,
  grandFri: string,
  year: number,
  date: string,
  position?: number,
  points: number,
  _id?: ObjectId
};

export interface ITeamGroup {
  team: string,
  year: number,
  position?: number,
  points: number
};
import { ObjectId } from "mongodb";

export default class Race {
  constructor(
    public position: string,
    public no: number,
    public year: number,
    public grandFrix: string,
    public driver: string,
    public date: string,
    public car: string,
    public laps: number,
    public time: string,
    public points: number,
    public _id?: ObjectId) { }
}

export interface IRace {
  position: string,
  no: number,
  year: number,
  grandFrix: string,
  driver: string,
  date: string,
  car: string,
  laps: number,
  time: string,
  points: number,
  _id?: ObjectId
};
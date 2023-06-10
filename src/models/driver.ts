import { ObjectId } from "mongodb";

export default class Driver {
  constructor(
    public position: number,
    public nationality: string,
    public year: number,
    public driver: string,
    public car: string,
    public points: number,
    public _id?: ObjectId) { }
}

export interface IDriver {
  position: number,
  nationality: string,
  year: number,
  driver: string,
  car: string,
  points: number,
  _id?: ObjectId
};
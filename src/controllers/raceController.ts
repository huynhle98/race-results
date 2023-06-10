import { Get, Route, Response, Tags, Request, Query, FormField, Queries, Path } from "tsoa";
import { IRace } from "../models/race";
import { collections } from "../services/database.service";
import express from 'express';

@Route("races")
@Tags("Races")
export default class RaceController {
  @Response(404, "Not Found")
  // @Get("/all")
  public async getRaces(): Promise<Array<IRace>> {
    const racesData = (await collections.races?.find({}).toArray()) as Array<IRace>;
    return racesData;
  }

  @Tags("Race results - Grand Frix")
  @Response(404, "Not Found")
  @Get("/grand/{year}")
  public async getRacesWithGrand(
    @Request() request: express.Request,
    @Path() year: string,
    @Query() grand?: string
  ): Promise<Array<IRace>> {
    const regex = new RegExp(["^", grand, "$"].join(""), "i");
    if (grand) {
      return (await collections.races?.find({ year: parseInt(request.params.year), grandFrix: regex }).toArray()) as Array<IRace>;
    }
    return (await collections.races?.find({ year: parseInt(request.params.year), position: "1" }).toArray()) as Array<IRace>;
  }
}
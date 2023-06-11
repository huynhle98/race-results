import { Get, Route, Response, Tags, Request, Query, FormField, Queries, Path } from "tsoa";
import express from 'express';

import { IRace } from "../models/race";
import { collections } from "../services/database.service";
import { IDriver } from "../models/driver";
import { ITeam, ITeamGroup } from "../models/team";

@Route("races")
// @Tags("Races")
export default class RaceController {
  @Response(404, "Not Found")
  // @Get("/all")
  public async getRaces(): Promise<Array<IRace>> {
    const racesData = (await collections.races?.find({}).toArray()) as Array<IRace>;
    return racesData;
  }

  @Tags("Search data by year")
  @Response(404, "Not Found")
  @Get("/{year}")
  public async getDataByYear(
    @Request() request: express.Request,
    @Path() year: string
  ): Promise<Array<IRace>> {
    return (await collections.races?.find({ year: parseInt(request.params.year) }).toArray()) as Array<IRace>;
  }

  @Tags("Search data by driver")
  @Response(404, "Not Found")
  @Get("/drivername/{driver}")
  public async getDataByDriver(
    @Request() request: express.Request,
    @Path() driver: string
  ): Promise<Array<IRace>> {
    const regex = new RegExp(["^", request.params.driver, "$"].join(""), "i");
    return (await collections.races?.find({ driver: regex }).toArray()) as Array<IRace>;
  }

  @Tags("Search data by team")
  @Response(404, "Not Found")
  @Get("/teamname/{team}")
  public async getDataByTeam(
    @Request() request: express.Request,
    @Path() team: string
  ): Promise<Array<IRace>> {
    const regex = new RegExp(["^", request.params.team, "$"].join(""), "i");
    return (await collections.races?.find({ car: regex }).toArray()) as Array<IRace>;
  }

  @Tags("Search data by race")
  @Response(404, "Not Found")
  @Get("/race/{race}")
  public async getDataByRace(
    @Request() request: express.Request,
    @Path() race: string
  ): Promise<Array<IRace>> {
    const regex = new RegExp(["^", request.params.race, "$"].join(""), "i");
    return (await collections.races?.find({ grandFrix: regex }).toArray()) as Array<IRace>;
  }

  @Tags("Race results by Year & Grand Frix(optional)")
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

  @Tags("Race results by Year & Driver(optional)")
  @Response(404, "Not Found")
  @Get("/driver/{year}")
  public async getRacesWithDriver(
    @Request() request: express.Request,
    @Path() year: string,
    @Query() driver?: string,
  ): Promise<Array<IRace | IDriver>> {
    const regex = new RegExp(["^", driver, "$"].join(""), "i");
    if (driver) {
      return (await collections.races?.find({ year: parseInt(request.params.year), driver: regex }).toArray()) as Array<IRace>;
    }
    return (await collections.drivers?.find({ year: parseInt(request.params.year) }).toArray()) as Array<IDriver>;
  }

  @Tags("Race results by Year & Team(optional)")
  @Response(404, "Not Found")
  @Get("/team/{year}")
  public async getRacesWithTeam(
    @Request() request: express.Request,
    @Path() year: string,
    @Query() team?: string,
  ): Promise<Array<ITeam | ITeamGroup>> {
    const regex = new RegExp(["^", team, "$"].join(""), "i");
    if (team) {
      return (await collections.teams?.find({ year: parseInt(request.params.year), team: regex }).toArray()) as Array<ITeam>;
    }
    const teamList = (await collections.teams?.find({ year: parseInt(request.params.year) }).toArray()) as Array<ITeam>;
    let teamGroups: Array<ITeamGroup> = [];
    for (const [index, team] of teamList.entries()) {
      if (index === 0) {
        teamGroups.push({
          team: team.team,
          year: team.year,
          points: team.points
        });
      } else {
        const index = teamGroups.findIndex(teamGr => teamGr.team === team.team)
        if (index !== -1) {
          teamGroups[index].points += team.points;
        } else {
          teamGroups.push({
            team: team.team,
            year: team.year,
            points: team.points
          });
        }
      }
    }
    teamGroups = (teamGroups.sort((a, b) => b.points - a.points)).map((teamGr, index) => ({ ...teamGr, position: index + 1 }))
    return teamGroups;
  }
}
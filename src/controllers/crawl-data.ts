
import axios from 'axios';
import * as cheerio from 'cheerio';
import Race from '../models/race';
import { collections } from "../services/database.service";
import Driver from '../models/driver';
import Team from '../models/team';

export default class CrawlDataController {
  public async setCrawlData(): Promise<any> {
    let races: Array<Race> = [
      ...await this.getRacesData(2023),
      ...await this.getRacesData(2022)];
    let drivers: Array<Driver> = [
      ...await this.getDriversData(2023),
      ...await this.getDriversData(2022)];
    let teams: Array<Team> = [
      ...await this.getTeamsData(2023),
      ...await this.getTeamsData(2022)];
    console.log("Crawling data successfully");
    try {
      await this.saveDataToDB(races, 'races');
      console.log("Save races data to DB successfully");
      await this.saveDataToDB(drivers, 'drivers');
      console.log("Save drivers data to DB successfully");
      await this.saveDataToDB(teams, 'teams');
      console.log("Save teams data to DB successfully");
      return {
        message: "Crawling data successfully",
      };
    } catch (error) {
      console.error(error);
      // res.status(400).send(error.message);
    }
  }

  async saveDataToDB(data: any, collectionName: string) {
    for (const item of data) {
      switch (collectionName) {
        case 'races':
          const racesResult = await collections.races?.findOne(item);
          racesResult ? await collections.races?.updateOne({}, { $set: item }) : await collections.races?.insertOne(item);
          break;
        case 'drivers':
          const driversResult = await collections.drivers?.findOne(item);
          driversResult ? await collections.drivers?.updateOne({}, { $set: item }) : await collections.drivers?.insertOne(item);
          break;
        case 'teams':
          const teamsResult = await collections.teams?.findOne({ year: item.year, team: item.team, grandFrix: item.grandFrix });
          teamsResult ? await collections.teams?.updateOne({}, { $set: item }) : await collections.teams?.insertOne(item);
          break;
        default:
          break;
      }
    }
  }

  async getTeamsData(year: number) {
    const urlList = await this.getUrlForTeam(year);
    console.log(urlList)
    const teams: Array<Team> = [];
    for (const val of urlList) {
      if (val?.url) {
        const response = await axios.get(val.url);
        const html = response.data;
        const $ = cheerio.load(html);
        const grands = $('.resultsarchive-table tbody td:nth-child(2) > a').get();
        const dates = $('.resultsarchive-table tbody td:nth-child(3)').get();
        const points = $('.resultsarchive-table tbody td:nth-child(4)').get();
        grands.forEach((value, index) => {
          console.log("Crawling data");
          const team: Team = {
            year: year,
            team: val.value,
            grandFrix: $(grands[index]).text().trim(),
            date: $(dates[index]).text().trim(),
            points: parseInt($(points[index]).text().trim()),
          }
          teams.push(team);
        })
      }
    }
    return teams;
  }

  async getUrlForTeam(year: number) {
    const allUrl = `https://www.formula1.com/en/results.html/${year}/team.html`;
    const responseAll = await axios.get(allUrl);
    const html = responseAll.data;
    const $ = cheerio.load(html);
    const urls = $('li.resultsarchive-filter-item > a[data-name="teamKey"]').get();
    let urlList = urls.map(url => $(url).attr('data-value'));
    urlList = urlList.filter(url => url !== 'all');

    const values = $('li.resultsarchive-filter-item > a[data-name="teamKey"] > span').get();
    let valueList = values.map(val => $(val).text().trim());

    valueList = valueList.filter(val => val !== 'All');
    const finalList = urlList.map((url, index) => {
      return {
        url: `https://www.formula1.com/en/results.html/${year}/team/${url}.html`,
        value: valueList[index]
      };
    });
    return finalList;
  }

  async getDriversData(year: number) {
    const url = `https://www.formula1.com/en/results.html/${year}/drivers.html`;
    const drivers: Array<Driver> = [];
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const positions = $('.resultsarchive-table tbody td:nth-child(2)').get();
    const drivers1 = $('.resultsarchive-table tbody td:nth-child(3) span:nth-child(1)').get();
    const drivers2 = $('.resultsarchive-table tbody td:nth-child(3) span:nth-child(2)').get();
    const nationalities = $('.resultsarchive-table tbody td:nth-child(5)').get();
    const cars = $('.resultsarchive-table tbody td:nth-child(5)').get();
    const points = $('.resultsarchive-table tbody td:nth-child(6)').get();
    positions.forEach((pos, index) => {
      console.log("Crawling data");
      const driver: Driver = {
        position: parseInt($(pos).text().trim()),
        nationality: $(nationalities[index]).text().trim(),
        year: year,
        driver: $(drivers1[index]).text().trim() + ' ' + $(drivers2[index]).text().trim(),
        car: $(cars[index]).text().trim(),
        points: parseInt($(points[index]).text().trim())
      }
      drivers.push(driver);
    })
    return drivers;
  }

  async getRacesData(year: number) {
    const urlList = await this.getUrlForGrand(year);
    const races: Array<Race> = [];
    for (const val of urlList) {
      if (val?.url) {
        const response = await axios.get(val.url);
        const html = response.data;
        const $ = cheerio.load(html);
        const positions = $('.resultsarchive-table tbody td:nth-child(2)').get();
        const numeroSigns = $('.resultsarchive-table tbody td:nth-child(3)').get();
        const drivers1 = $('.resultsarchive-table tbody td:nth-child(4) > span:nth-child(1)').get();
        const drivers2 = $('.resultsarchive-table tbody td:nth-child(4) > span:nth-child(2)').get();
        const cars = $('.resultsarchive-table tbody td:nth-child(5)').get();
        const laps = $('.resultsarchive-table tbody td:nth-child(6)').get();
        const times = $('.resultsarchive-table tbody td:nth-child(7)').get();
        const points = $('.resultsarchive-table tbody td:nth-child(8)').get();
        const date = $('.date .full-date').get();
        positions.forEach((pos, index) => {
          console.log("Crawling data");
          const race: Race = {
            year: year,
            grandFrix: val.value,
            position: $(positions[index]).text().trim(),
            no: parseInt($(numeroSigns[index]).text().trim()),
            driver: $(drivers1[index]).text().trim() + ' ' + $(drivers2[index]).text().trim(),
            car: $(cars[index]).text().trim(),
            laps: parseInt($(laps[index]).text().trim()),
            time: $(times[index]).text().trim(),
            points: parseInt($(points[index]).text().trim()),
            date: $(date).text().trim()
          }
          races.push(race);
        })
      }
    }
    return races;
  }

  async getUrlForGrand(year: number) {
    const allUrl = `https://www.formula1.com/en/results.html/${year}/races.html`;
    const responseAll = await axios.get(allUrl);
    const html = responseAll.data;
    const $ = cheerio.load(html);
    const urls = $('li.resultsarchive-filter-item > a[data-name="meetingKey"]').get();
    let urlList = urls.map(url => $(url).attr('data-value'));
    urlList = urlList.filter(url => url !== 'all');

    const values = $('li.resultsarchive-filter-item > a[data-name="meetingKey"] > span').get();
    let valueList = values.map(val => $(val).text().trim());
    valueList = valueList.filter(val => val !== 'All');

    const finalList = urlList.map((url, index) => {
      return {
        url: `https://www.formula1.com/en/results.html/${year}/races/${url}/race-result.html`,
        value: valueList[index]
      };
    });
    return finalList;
  }
}

import axios from 'axios';
import * as cheerio from 'cheerio';
import Race from '../models/race';
import { collections } from "../services/database.service";

export default class CrawlDataController {
  public async setCrawlData(): Promise<any> {
    let races: Race[] = [
      ...await this.getRacesData(2023),
      ...await this.getRacesData(2022)];
    console.log("Crawling data successfully");
    try {
      await this.saveDataToDB(races);
      console.log("Save data to DB successfully");
      return {
        message: "Crawling data successfully",
      };
    } catch (error) {
      console.error(error);
      // res.status(400).send(error.message);
    }
  }

  async saveDataToDB(data: any) {
    for (const item of data) {
      const exist = await collections.races?.findOne(item);
      exist ? await collections.races?.updateOne({}, { $set: item }) : await collections.races?.insertOne(item);
    }
  }

  async getRacesData(year: number) {
    const urlList = await this.getUrlForGrand(year);
    const races: Race[] = [];
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
        console.log("Crawling data");
        positions.forEach((pos, index) => {
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
    urlList = urlList.filter(url => url);

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
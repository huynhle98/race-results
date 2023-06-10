import express from "express";
import path from "path";
import PingController from "../controllers/ping";
import CrawlDataController from "../controllers/crawl-data";
import RaceController from "../controllers/raceController";

const router = express.Router();

router.get("/ping", async (_req, res) => {
  const controller = new PingController();
  const response = await controller.getMessage();
  return res.send(response);
});

router.get("/races", async (_req, res) => {
  const controller = new RaceController();
  const response = await controller.getRaces();
  if (response) {
    return res.send(response);
  } else {
    return res.status(500).send('error');
  }
});

router.get("/races/grand/:year", async (_req, res) => {
  const controller = new RaceController();
  const response = await controller.getRacesWithGrand(_req, _req.query['year'] as string, _req.query['grand'] as string);
  if (response) {
    return res.send(response);
  } else {
    return res.status(500).send('error');
  }
});

router.get("/crawl-data", async (_req, res) => {

  return res.sendFile(path.join(__dirname, '/crawl/crawler.html'));
});

router.post("/crawl-data", async (_req, res) => {
  console.log(_req.body);
  const controller = new CrawlDataController();
  const response = await controller.setCrawlData();
  return res.send(response);
});

export default router;
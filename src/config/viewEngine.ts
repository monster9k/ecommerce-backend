import express from "express";
import { Express } from "express";

let configViewEngine = (app: Express) => {
  app.use(express.static("./src/public")); // static -> muon lay anh thi thong qa public
};

export default configViewEngine;

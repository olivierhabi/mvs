import { Router } from "express";

import moviesRouter from "./movies";
import Authentication from "./authentication";

const appRouter = Router();
appRouter.use("/movies", moviesRouter);
appRouter.use("/auth", Authentication);

export default appRouter;

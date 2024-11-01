import { NextFunction } from "express";

export function logger(req: Request, res: Response, next: NextFunction) {
    console.log("Funtional Middleware");
    next();
}
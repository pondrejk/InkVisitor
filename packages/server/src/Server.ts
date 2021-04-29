import morgan from "morgan";
import helmet from "helmet";
import {
  IError,
  InternalServerError,
  UnknownRoute,
  UnauthorizedError,
} from "@shared/types/errors";
import express, { Request, Response, NextFunction, Router } from "express";
import cors from "cors";
import logger from "@common/Logger";
import { apiPath } from "./common/constants";
import ActantsRouter from "@modules/actants";
import TerritoriesRouter from "@modules/territories";
import MetaRouter from "@modules/meta";
import UsersRouter from "@modules/users";
import ActionsRouter from "@modules/actions";
import StatementsRouter from "@modules/statements";
import TreeRouter from "@modules/tree";

const server = express();
server.use(cors());

server.use(express.json());

server.use(express.urlencoded({ extended: true }));

// Show routes called in console during development
if (process.env.NODE_ENV === "devel") {
  server.use(morgan("dev"));
}

// Securing
if (process.env.NODE_ENV === "prod") {
  server.use(helmet());
}

server.get("/health", function (req, res) {
  console.log("health route");
  res.send("ok");
});

import { validateJwt } from "@common/auth";
import { UnauthorizedError as JwtUnauthorizedError } from "express-jwt";
import { IResponseGeneric, errorTypes } from "@shared/types/response-generic";

// uncomment this to enable auth
server.use(validateJwt().unless({ path: [/api\/v1\/users\/signin/] }));

// Routing
const routerV1 = Router();

server.use(apiPath, routerV1);

//routerV1.use('/statements', StatementRouter);.
routerV1.use("/users", UsersRouter);
routerV1.use("/actants", ActantsRouter);
routerV1.use("/actions", ActionsRouter);
routerV1.use("/territories", TerritoriesRouter);
routerV1.use("/meta", MetaRouter);
routerV1.use("/statements", StatementsRouter);
routerV1.use("/tree", TreeRouter);

export const unknownRouteError = new UnknownRoute("route does not exist");
export const unauthorizedError = new UnauthorizedError("unauthorized");
export const internalServerError = new InternalServerError(
  "unknown error occured"
);

// unknown paths (after jwt check) should return 404
server.all("*", function (req, res, next) {
  const genericResponse: IResponseGeneric = {
    result: false,
    error: unknownRouteError.constructor.name as errorTypes,
    message: unknownRouteError.message,
  };

  res.status(unknownRouteError.statusCode()).json(genericResponse);
});

// Errors
server.use(
  (err: IError | Error, req: Request, res: Response, next: NextFunction) => {
    // should expect customized errors, unknown unhandled errors, or errors thrown from some lib
    const isCustomError = typeof (err as IError).statusCode === "function";

    if (!isCustomError) {
      if (err instanceof JwtUnauthorizedError) {
        // customized unauthorized error
        err = unauthorizedError;
      } else {
        // unknown unhandled error - should log the message
        logger.error(err.message, err);
        err = internalServerError;
      }
    }

    // in any case, the error should be wrapper in IResponseGeneric
    const genericResponse: IResponseGeneric = {
      result: false,
      error: err.constructor.name as errorTypes,
      message: err.message,
    };

    return res.status((err as IError).statusCode()).json(genericResponse);
  }
);

export default server;

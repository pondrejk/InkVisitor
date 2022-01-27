import { Request } from "express";
import { UserRoleMode } from "@shared/enums";
import {
  IActant,
  IAction,
  IEntity,
  IResource,
  IResponseActant,
  IResponseDetail,
  IStatement,
  ITerritory,
} from "@shared/types";
import { Connection } from "rethinkdb-ts";
import Actant from "./actant";
import Statement from "@models/statement/statement";

export class ResponseActant extends Actant implements IResponseActant {
  right: UserRoleMode = UserRoleMode.Read;

  constructor(actant: IActant) {
    super(actant);
  }

  async prepare(request: Request) {
    this.right = this.getUserRoleMode(request.getUserOrFail());
  }
}

export class ResponseActantDetail
  extends ResponseActant
  implements IResponseDetail
{
  entities: { [key: string]: IActant };
  usedInStatement?: IStatement[] | undefined;
  usedInStatementProps?: IStatement[] | undefined;
  data:
    | IActant["data"]
    | IAction["data"]
    | IEntity["data"]
    | ITerritory["data"]
    | IResource["data"]
    | IStatement["data"];

  constructor(actant: IActant) {
    super(actant);
    this.data = actant.data;
    this.entities = {};
  }

  async prepare(req: Request): Promise<void> {
    super.prepare(req);

    this.usedInStatement = await Statement.findDependentStatements(
      req.db.connection,
      this.id
    );

    const entities = await this.getEntities(req.db.connection as Connection);
    this.entities = Object.assign({}, ...entities.map((x) => ({ [x.id]: x })));
  }
}

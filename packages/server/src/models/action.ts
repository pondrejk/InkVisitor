import { fillFlatObject, UnknownObject, IModel } from "./common";
import {
  ActantType,
  EntityActantType,
  ActantStatus,
  ActantLogicalType,
} from "@shared/enums";
import { IEntity } from "@shared/types/entity";
import Actant from "./actant";
import { IAction } from "@shared/types";
import { ActionEntity, ActionValency } from "@shared/types/action";

class ActionData implements IModel {
  valencies: ActionValency = {
    a1: "",
    a2: "",
    s: "",
  };
  entities: ActionEntity = {
    a1: [],
    a2: [],
    s: [],
  };
  properties: any[] = [];

  constructor(data: UnknownObject) {
    if (!data) {
      return;
    }
  }

  isValid(): boolean {
    return true;
  }
}

class Action extends Actant implements IAction {
  static table = "actants";

  id = "";
  class: ActantType.Action = ActantType.Action; // just default
  data = new ActionData({});

  label: string = "";
  detail: string = "";
  status: ActantStatus = "0";
  language: string[] = ["eng"];
  notes: string[] = [];

  constructor(data: UnknownObject) {
    super();

    if (!data) {
      return;
    }

    fillFlatObject(this, data);

    this.data = new ActionData(data.data as UnknownObject);
  }

  isValid(): boolean {
    if (this.class !== ActantType.Action) {
      return false;
    }

    return this.data.isValid();
  }
}

export default Action;

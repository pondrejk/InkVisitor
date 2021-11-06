import { fillFlatObject, UnknownObject, IModel } from "./common";
import {
  ActantType,
  EntityActantType,
  ActantStatus,
  EntityLogicalType,
} from "@shared/enums";
import Actant from "./actant";
import { IActant } from "@shared/types";

class ConceptData implements IModel {
  constructor(data: UnknownObject) {
    if (!data) {
      return;
    }
  }

  isValid(): boolean {
    return true;
  }
}

class Concept extends Actant implements IActant {
  static table = "actants";

  class: ActantType.Concept = ActantType.Concept; // just default
  data: ConceptData;

  constructor(data: UnknownObject) {
    super(data);

    if (!data) {
      data = {};
    }

    this.data = new ConceptData({} as UnknownObject);
  }

  isValid(): boolean {
    const alloweedClasses = [ActantType.Concept];

    console.log();
    if (alloweedClasses.indexOf(this.class) === -1) {
      return false;
    }

    return this.data.isValid();
  }
}

export default Concept;

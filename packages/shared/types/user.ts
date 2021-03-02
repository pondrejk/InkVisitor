import { IResponseActant } from "./";
import { userRoleDict } from "./../dictionaries";

const userRoleValues = userRoleDict.map((i) => i.value);
export interface IUser {
  id: string;
  email: string;
  name: string;
  password?: string;
  role: typeof userRoleValues[number];
  bookmarks: IBookmarkFolder[];
  storedTerritories: IStoredTerritory[];
  rights: IUserRight[];
}

export interface IUserRight {
  territory: string;
  mode: string; // probably write | read | admin...
}

export interface IUserOptions {
  defaultTerritory: string;
  defaultLanguage: string;
  searchLanguages: string[];
}

interface IStoredTerritory {
  id: string;
  order: number;
  territory: string;
}

interface IBookmarkFolder {
  id: string;
  name: string;
  actantIds: string[]; // list of ids are stored in the db, for response type see IResponseBookmarks
}

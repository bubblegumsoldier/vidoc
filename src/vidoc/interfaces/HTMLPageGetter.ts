import { Vidoc } from "../model/Vidoc";

export interface HTMLPageGetter {
  getHTML(vidoc: Vidoc): Promise<string>;
}

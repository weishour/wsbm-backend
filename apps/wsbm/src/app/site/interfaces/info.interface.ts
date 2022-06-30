import { Icon } from "./icon.interface";

export interface SiteInfo {
  protocol?: string;
  origin?: string;
  title?: string;
  description?: string;
  icons?: Icon[];
}

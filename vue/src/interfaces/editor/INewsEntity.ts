import { IPermission } from "../user/IPermission";

interface INewsEntity {
  id: number;
  ref: string;
  permission: IPermission;
  title: string;
  subtitle: string;
  content: string;
  bgImage: string;
}

export type { INewsEntity };

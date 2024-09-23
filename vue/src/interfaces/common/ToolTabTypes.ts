import { TPermissionGroup } from "../user/UserTypes";

interface Tool {
  id: number;
  name: string;
  href: string;
  icon: string;
  image: string;
  meta: {
    group: TPermissionGroup;
    baseHref: string;
  };
}

interface ISubSubTab {
  id: number;
  title: string;
  name: string;
  icon: string | undefined;
}

interface ISubTab {
  id: number;
  title: string;
  name: string;
  icon: string | undefined;
  children?: ISubSubTab[];
}

interface ToolTab {
  id: number;
  name: string;
  icon: string | undefined;
  meta: {
    group: string;
    subgroup: string;
  };
  children?: ISubTab[];
}

export type { Tool, ToolTab };

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
  id: string;
  title: string;
  name: string;
  icon: string | undefined;
}

interface ISubTab {
  id: string;
  title: string;
  name: string;
  icon: string | undefined;
  children?: ISubSubTab[];
}

interface ToolTab {
  id: string;
  name: string;
  icon: string | undefined;
  meta: {
    group: string;
    subgroup: string;
  };
  children?: ISubTab[];
}

export type { Tool, ToolTab };

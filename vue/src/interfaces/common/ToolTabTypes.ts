interface Tool {
  id: number;
  name: string;
  href: string;
  icon: string;
  image: string;
  meta: {
    group: string;
    baseHref: string;
  };
}

interface ToolTab {
  id: number;
  name: string;
  icon: string;
  meta: {
    group: string;
    subgroup: string;
  };
}

export type { Tool, ToolTab };

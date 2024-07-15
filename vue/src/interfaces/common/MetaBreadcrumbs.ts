interface MetaBreadcrumbs {
  include: boolean;
  parent: string;
  name: string | Function;
  path: string;
  disabled: boolean;
}

export type { MetaBreadcrumbs };

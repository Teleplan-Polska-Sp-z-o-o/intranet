export namespace FileCardTypes {
  export type SubMenuItem = {
    subId: number;
    label: string;
    color?: string;
    icon: string;
  };

  export type FileMenuItem = {
    id: number;
    label: string;
    color?: string;
    icon: string;
    nested?: SubMenuItem[];
  };
}

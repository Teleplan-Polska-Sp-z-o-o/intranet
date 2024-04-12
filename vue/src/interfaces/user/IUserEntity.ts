interface IUserEntity {
  domain: string;
  id: number;
  permission: {
    read: boolean;
    write: boolean;
    control: boolean;
    id: number;
  };
  settings: {
    theme: string;
    language: string;
    id: number;
  };
  username: string;
}

export type { IUserEntity };

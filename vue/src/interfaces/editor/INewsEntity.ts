import { TConfidentiality } from "../user/UserTypes";

interface INewsEntity {
  id: number;
  ref: string;
  confidentiality: TConfidentiality;
  title: string;
  subtitle: string;
  content: string;
  bgImage: string;
}

export type { INewsEntity };

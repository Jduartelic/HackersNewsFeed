import {News} from '../entities';

export type NewsResponse = (query: string) => Promise<News>;

import { Token } from 'src/abstract';
import { NftToken } from 'src/coins/nfts';
import Transaction from 'src/explorers/Transaction';
import {
  dbTablesType,
  IDataBase,
  ITable,
  TableElement,
  TableElementKey,
  TableNames,
  TableTypes,
} from 'src/utils/db/types';

import { IAddrCacheElement } from '../types';

export class BaseTable<T> implements ITable<T> {
  async get(conditions: Partial<T>): Promise<Partial<T> | undefined> {
    console.log('Base DB used, `get` not implemented.');

    return Promise.resolve(undefined);
  }

  async getAll(conditions: Partial<T>): Promise<Partial<T>[]> {
    console.log('Base DB used, `getAll` not implemented.');

    return Promise.resolve([]);
  }

  async put(item: T): Promise<TableElementKey> {
    console.log('Base DB used, `put` not implemented.');

    return Promise.resolve('');
  }

  async update(id: TableElementKey, changes: Partial<T>): Promise<TableElementKey> {
    console.log('Base DB used, `update` not implemented.');

    return Promise.reject(new Error('Not implemented.'));
  }

  async delete(id: TableElementKey): Promise<void> {
    console.log('Base DB used, `delete` not implemented.');

    return Promise.resolve();
  }

  batchDelete(ids: TableElementKey[]): Promise<void> {
    console.log('Base DB used, `batchDelete` not implemented.');

    return Promise.resolve(undefined);
  }

  batchPut(items: T[]): Promise<TableElementKey | TableElementKey[]> {
    console.log('Base DB used, `batchPut` not implemented.');

    return Promise.reject(new Error('Not implemented.'));
  }

  batchUpdate(ids: TableElementKey[], changes: Partial<T>): Promise<T[]> {
    console.log('Base DB used, `batchUpdate` not implemented.');

    return Promise.resolve([]);
  }
}

export class DataBase implements IDataBase {
  tables: dbTablesType;

  constructor(tables: dbTablesType) {
    this.tables = tables;
  }

  table<T extends TableNames>(dbTable: T): ITable<TableTypes[T]> {
    return this.tables[dbTable];
  }
}

export class BaseDatabase implements DataBase {
  tables: {
    transactions: ITable<Transaction>;
    tokens: ITable<Token>;
    addrCache: ITable<IAddrCacheElement>;
    nfts: ITable<NftToken>;
    sentNfts: ITable<NftToken>;
    configs: ITable<TableElement>;
  };

  constructor(tables?: dbTablesType) {
    this.tables = {
      transactions: new BaseTable<Transaction>(),
      tokens: new BaseTable<Token>(),
      addrCache: new BaseTable<IAddrCacheElement>(),
      nfts: new BaseTable<NftToken>(),
      sentNfts: new BaseTable<NftToken>(),
      configs: new BaseTable<TableElement>(),
    };
  }

  table<T extends TableNames>(dbTable: T): ITable<TableTypes[T]> {
    return this.tables[dbTable] as ITable<TableTypes[T]>;
  }
}

export * from './types';

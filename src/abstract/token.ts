import BN from 'bn.js';
import { AbstractWallet, type Coin } from 'src/abstract';
import Transaction, { TransactionInfoFields } from 'src/explorers/Transaction';
import { GetFeeArgs, getTokenId } from 'src/utils';
import { IConfigManager } from 'src/utils/configManager';
import { IDataBase } from 'src/utils/db';
import { HISTORY_WALLET_UPDATED } from 'src/utils/eventTopics';

import type {
  CreateTxParams,
  RawTxBinary,
  RawTxHex,
  RawTxObject,
  TxHash,
  TokenCreationArgs,
  TokenSource,
  CoinConfigType,
} from './index';

const tokensNetworks = new Set(['BNB', 'TRX', 'ETH', 'MATIC', 'BSC', 'LUNA', 'BASE']);

export default abstract class Token extends AbstractWallet {
  #parent: Coin;
  #id: string;
  #contract: string;

  confirmed: boolean;
  visibility: boolean;
  source: TokenSource;
  config?: CoinConfigType;
  uniqueField: string;
  BN: typeof BN;

  fields = { paymentId: false };
  transactions: Transaction[];
  isSetBalance: boolean;
  notify: boolean;

  constructor(args: TokenCreationArgs, db?: IDataBase, configManager?: IConfigManager) {
    super(args, db, configManager);

    this.#parent = args.parent;
    this.#contract = args.contract;
    this.#id = getTokenId({
      contract: this.contract,
      parent: this.#parent.id,
      ticker: this.ticker,
    });

    this.source = args.source;
    this.visibility = args.visibility;
    this.confirmed = args.confirmed;
    this.uniqueField = args.uniqueField;

    this.decimal = args.decimal;

    if (args.config) {
      this.config = args.config;
    }

    this.BN = BN;
    this.balance = '';
    this.transactions = [];
    this.isSetBalance = false;
    this.notify = Boolean(args.notify);

    this.manageEvents();
  }

  get id(): string {
    return this.#id;
  }

  protected set id(id) {
    this.#id = id;
  }

  get contract(): string {
    return this.#contract;
  }

  protected set contract(contract) {
    this.#contract = contract;
  }

  get address(): string {
    return this.#parent.address;
  }

  get network(): string {
    return this.#parent.id;
  }

  get networkType() {
    return this.#parent.networkType;
  }

  get feeWallet() {
    return this.#parent;
  }

  get feeTicker() {
    return this.#parent.id;
  }

  /**
   * Should be removed
   */
  get deprecatedParent() {
    return this.#parent.id;
  }

  get parentTicker() {
    return this.#parent.id;
  }

  get txWebUrl() {
    return this.#parent.txWebUrl;
  }

  get coreLibrary() {
    return this.#parent.coreLibrary;
  }

  /**
   * Determines token custom source
   */
  get isCustom() {
    return this.source === 'custom';
  }

  getWebTransactionUrl(id: string) {
    return this.#parent.getWebTransactionUrl(id);
  }

  getTxLimit(): number | undefined {
    return this.#parent.getTxLimit();
  }

  async loadWallet(mnemonic: string) {
    return this;
  }

  async validateAddress(address: string) {
    return this.#parent.validateAddress(address);
  }

  createTransaction(args: CreateTxParams): Promise<RawTxHex | RawTxBinary | RawTxObject> {
    return this.#parent.createTokenTransaction({
      ...args,
      contract: this.contract,
    });
  }

  createRawTransactions(args: CreateTxParams) {
    return this.#parent.createTransaction(args);
  }

  sendTransaction(args: RawTxHex | RawTxObject | RawTxBinary) {
    return this.#parent.sendTransaction(args);
  }

  async getInfo() {
    if (this.#parent.getTokenInfo) {
      this.balance = await this.#parent.getTokenInfo({
        contract: this.contract,
      });
    }

    return {
      balance: this.balance,
    };
  }

  async availableBalance() {
    return this.divisibleBalance ? String(this.divisibleBalance) : '0';
  }

  async isAvailableForFee(fee: string) {
    return this.#parent.indivisibleBalance?.gte(new this.BN(fee));
  }

  getFee(args: Partial<GetFeeArgs>) {
    return this.#parent.getFee(args);
  }

  getGasPrice(withoutCoefficient: boolean, isToken?: boolean): Promise<BN | number | string> {
    return this.#parent.getGasPrice(withoutCoefficient, isToken);
  }

  estimateGas(
    amount: BN | string,
    address: string,
    contract: string,
    defaultGas?: BN | string | number,
  ): Promise<BN | number | string> {
    return this.#parent.estimateGas(amount, address, contract, defaultGas);
  }

  async getTokenTransactions() {
    try {
      const txs = await this.#parent.getTokenTransactions({ contract: this.contract });

      if (txs.length > 0) {
        const tokenTransactions = txs.filter((tx: any) => tx.walletId === this.#id);

        const db = this.getDbTable('transactions');

        await db.batchPut(tokenTransactions);

        const { topic, payload } = HISTORY_WALLET_UPDATED(this.id, tokenTransactions);

        this.eventEmitter.emit(topic, payload);
        this.transactions = tokenTransactions;
      }

      return txs;
    } catch (error) {
      return this.transactions;
    }
  }

  async getTransactions(offset: number, limit: number) {
    try {
      const txs = await this.#parent.getTransactions({
        contract: this.contract,
        offset,
        limit,
      });

      if (txs.length > 0) {
        const tokenTransactions = txs.filter((tx: any) => tx.walletId === this.#id);

        const db = this.getDbTable('transactions');

        await db.batchPut(tokenTransactions);

        const { topic, payload } = HISTORY_WALLET_UPDATED(this.id, tokenTransactions);

        this.eventEmitter.emit(topic, payload);
        this.transactions = tokenTransactions as Transaction[];
      }

      return txs;
    } catch (error) {
      return this.transactions;

      // @TODO should be implemented for all token types
      // by default returns empty array
      // throw new Error(`${this.constructor.name}: method \`getTokenTransactions\`
      // should be defined in ${this.#parent.constructor.name}`)
    }
  }

  checkTransaction(args: TransactionInfoFields) {
    return this.#parent.checkTransaction(args);
  }

  async getTransaction(txId: TxHash) {
    return this.#parent.getTransaction(txId);
  }

  /**
   * Update dynamic data set
   */
  updateTokenParamsFromServer(data: CoinConfigType) {
    if (!data?.feeData) {
      return;
    }
    Object.entries(data.feeData).forEach(([key, value]) => {
      if (
        typeof (this as { [key: string]: any })[key] !== 'undefined' &&
        typeof value !== 'undefined' &&
        key !== '__proto__'
      ) {
        (this as { [key: string]: any })[key] = value;
      }
    });
  }

  isTagShown() {
    return tokensNetworks.has(this.#parent.id);
  }

  manageEvents() {
    this.eventEmitter.on(`${this.#parent.id}-${this.id}::new-socket-tx`, ({ unconfirmedTx }) => {
      this.eventEmitter.emit(`${this.#parent.id}::new-token-tx`, {
        token: this,
        unconfirmedTx,
      });
    });
  }

  removeTokenFromDb(args: object[]) {
    return this.#parent.removeTokenFromDb(args);
  }
}

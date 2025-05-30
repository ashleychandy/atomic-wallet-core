import { type Token } from 'src/abstract';
import { ExplorerConfig } from 'src/explorers/types';
import type { LazyLoadedLib } from 'src/utils';

export type TokensObject = {
  [key: string]: Token;
};

export type CosmosCoinConfigType = {
  denom?: string;
  prefix?: string;
  derivation?: string;
};

export type EVMCoinConfigType = {
  network?: string;
  l2name?: string;
  chainId: number;
  isUseModeratedGasPrice?: boolean;
  isUseEIP1559?: boolean;
};

export type CoinConfigType = {
  id: string;
  name: string;
  ticker: string;
  decimal: number;
  features?: string[];
  coinData?: { [key: string]: unknown };
  unspendableBalance: string;
  feeData: { [key: string]: unknown };
  explorers: ExplorerConfig[];
  txWebUrl: string;
  submitUrl: string;
  coreLibrary?: unknown;
  coreLib?: unknown;
  dustAmount?: string;
  socket?: boolean;
  atomicId?: string;
  memoRegexp?: string;
  dependencies?: { [name: string]: LazyLoadedLib<unknown> };
} & CosmosCoinConfigType &
  EVMCoinConfigType;

export type Numeric = string | number;

// @TODO FeeDataType should be split to smaller specific types e.g. EVMGasTypes with gaslimit and etc
export type FeeDataType = {
  coefficient?: Numeric;
  feePerByte?: Numeric;
  defaultGasPrice?: Numeric;
  nftGasLimitCoefficient?: Numeric;
  nftGasPriceCoefficient?: Numeric;
  gasLimitCoefficient?: Numeric;
  gasPriceCoefficient?: Numeric;
  gasLimit?: Numeric;
  defaultMaxGasPrice?: Numeric;
  resendTimeout?: Numeric;
  stakingGasLimit?: Numeric;
  reStakingGasLimit?: Numeric;
  autoClaimGasLimit?: Numeric;
  reservedForStake?: Numeric;
  rewardsContract?: Numeric;
  gasPrice?: Numeric;
  reserveForStake?: Numeric;
  fee?: Numeric;
  feeTRC20?: Numeric;
  oneEnergyInTrx?: Numeric;
  oneBandwidthInTrx?: Numeric;
  defaultTrc20TransferEnergy?: Numeric;
  dynamicTrc20EnergyEnabled?: Numeric;
  storageLimit?: Numeric;
  constantPart?: Numeric;
  accountActivationSum?: Numeric;
  accountActivationAddress?: string;
  activation?: Numeric;
  maxFee?: Numeric;
  stakingContract?: string;
  stakingProxyContract?: string;
  sendFeeGas?: Numeric;
  stakingFeeGas?: Numeric;
  unstakingFeeGas?: Numeric;
  tokenFeeGas?: Numeric;
  claimFeeGas?: Numeric;
  gasSettings?: unknown;
  updateAccountFee?: Numeric;
  grpc?: unknown;
  stepLimit?: Numeric;
  freezeFee?: Numeric;
  tokenGasLimit?: Numeric;
  defaultFee?: Numeric;
  maxGasPriceL1?: Numeric;
  maxGasLimitL1?: Numeric;
  maxGasLimit?: Numeric;
  unspendableBalance?: Numeric;
};

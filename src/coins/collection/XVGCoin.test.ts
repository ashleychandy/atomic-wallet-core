import { generateWalletTests } from 'src/__tests__/crypto/crypto.utils';
import { createCoin } from 'src/coins';
import XVGCoin from 'src/coins/collection/XVGCoin';
import type { CoinDataConfig } from 'src/coins/createCoin';
import { getWalletConfig } from 'src/utils';

const id = 'XVG';
const config = getWalletConfig({ id });

if (!config) {
  throw new Error(`Missing ${id} config`);
}

const wallet = createCoin(XVGCoin, config as CoinDataConfig);

if (!wallet) {
  throw new Error(`Failed to initialize ${id} wallet`);
}

jest.spyOn(wallet, 'getFee').mockReturnValue(Promise.resolve(new wallet.BN('50000')));

// @ts-expect-error bitcore mixin overload
jest.spyOn(wallet, 'getTimestamp').mockReturnValue(1736518352);

generateWalletTests(wallet);

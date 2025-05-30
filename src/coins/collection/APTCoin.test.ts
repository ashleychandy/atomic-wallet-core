// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { generateWalletTests } from 'src/__tests__/crypto/crypto.utils';
import { createCoin } from 'src/coins';
import APTCoin from 'src/coins/collection/APTCoin';
import type { CoinDataConfig } from 'src/coins/createCoin';
import { getWalletConfig } from 'src/utils';

const id = 'APT';
const config = getWalletConfig({ id });

if (!config) {
  throw new Error(`Missing ${id} config`);
}

const wallet = createCoin(APTCoin, config as CoinDataConfig);

if (!wallet) {
  throw new Error(`Failed to initialize ${id} wallet`);
}

jest.spyOn(wallet, 'getAccount').mockReturnValue({
  sequence_number: '42',
});

jest.spyOn(wallet, 'getTransactionExpirationTimeout').mockReturnValue(BigInt(3472834780));

jest.spyOn(wallet, 'getGasParams').mockReturnValue({
  gasPrice: '100',
  gasLimit: '2000',
});

generateWalletTests(wallet);

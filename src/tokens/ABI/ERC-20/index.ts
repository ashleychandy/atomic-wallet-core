import FlareRewardsManager from 'src/tokens/ABI/ERC-20/FlareRewardsManagerContract';
import MaticValidatorsShare from 'src/tokens/ABI/ERC-20/MaticValidatorsShare';
import standard from 'src/tokens/ABI/ERC-20/standard';
import stETH from 'src/tokens/ABI/ERC-20/stETH';
import WFLR from 'src/tokens/ABI/ERC-20/WFLR';

export default {
  standard: {
    methods: {
      approve: {
        name: 'approve',
        params: ['address', 'amount'],
      },
      increaseAllowance: {
        name: 'increaseAllowance',
        params: ['address', 'amount'],
      },
    },
    abi: standard,
  },
  '0xf98864DA30a5bd657B13e70A57f5718aBf7BAB31': {
    methods: {
      stake: {
        name: 'buyVoucher',
        params: ['address', 'amount', 'heimdallFee', 'accept', 'signerPubkey'],
      },
      abi: MaticValidatorsShare,
    },
  },
  '0x85627d71921AE25769f5370E482AdA5E1e418d37': {
    methods: {
      getUnclaimedEpochs: {
        name: 'getEpochsWithUnclaimedRewards',
        params: ['address'],
      },
      getRewardsState: {
        name: 'getStateOfRewards',
        params: ['address', 'epoch'],
      },
      claim: {
        name: 'claim',
        params: ['address', 'address', 'epochs', 'wrap'],
      },
    },
    abi: FlareRewardsManager,
  },
  '0x1d80c49bbbcd1c0911346656b529df9e5c2f783d': {
    methods: {
      stake: {
        name: 'deposit',
        params: [],
      },
      unstake: {
        name: 'withdraw',
        params: ['amount'],
      },
      delegate: {
        name: 'delegate',
        params: ['address', 'bips'],
      },
      undelegate: {
        name: 'undelegateAll',
        params: [],
      },
    },
    abi: WFLR,
  },
  '0xae7ab96520de3a18e5e111b5eaab095312d7fe84': {
    methods: {
      stake: {
        name: 'submit',
        params: ['address'],
      },
    },
    abi: stETH,
  },
} as const;

// MY INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
// export const INFURA_ID = "7b0e75d38d424750b92791477924d133";
// export const INFURA_ID = "460f40a260564ac4a4f4b3fffb032dad";
export const INFURA_ID = "432d743bb1d944268c6e3725f243a7e0";

// MY ETHERSCAN_ID, SWAP IN YOURS FROM https://etherscan.io/myapikey
// export const ETHERSCAN_KEY = "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW";
export const ETHERSCAN_KEY = "D3XABZ6X45RPD3UWJ1HSVYFI1HPRE72SGJ";

// BLOCKNATIVE ID FOR Notify.js:
export const BLOCKNATIVE_DAPPID = "0b58206a-f3c0-4701-a62f-73c7243e8c77";

// export const ALCHEMY_KEY = "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";
export const ALCHEMY_KEY = "VgxRzTcjUpxCAKgVP7RWSaXasZW5dJ3L";

export const NETWORKS = {
  localhost: {
    name: "localhost",
    color: "#666666",
    chainId: 31337,
    blockExplorer: "",
    rpcUrl: "http://" + (global.window ? window.location.hostname : "localhost") + ":8545",
  },
  mainnet: {
    name: "mainnet",
    color: "#ff8b9e",
    chainId: 1,
    rpcUrl: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
    // rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
    blockExplorer: "https://etherscan.io/",
  },
  kovan: {
    name: "kovan",
    color: "#7003DD",
    chainId: 42,
    rpcUrl: `https://eth-kovan.alchemyapi.io/v2/${ALCHEMY_KEY}`,
    // rpcUrl: `https://kovan.infura.io/v3/${INFURA_ID}`,
    faucet: "https://gitter.im/kovan-testnet/faucet", 
    // faucet: "https://faucet.kovan.network/",
    blockExplorer: "https://kovan.etherscan.io/",
  },
  rinkeby: {
    name: "rinkeby",
    color: "#e0d068",
    chainId: 4,
    rpcUrl: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_KEY}`,
    // rpcUrl: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
    faucet: "https://faucet.rinkeby.io/",
    blockExplorer: "https://rinkeby.etherscan.io/",
  },
  ropsten: {
    name: "ropsten",
    color: "#F60D09",
    chainId: 3,
    rpcUrl: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_KEY}`,
    // rpcUrl: `https://ropsten.infura.io/v3/${INFURA_ID}`,
    faucet: "https://faucet.ropsten.be/",
    blockExplorer: "https://ropsten.etherscan.io/",
  },
  goerli: {
    name: "goerli",
    color: "#0975F6",
    chainId: 5,
    rpcUrl: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_KEY}`,
    // rpcUrl: `https://goerli.infura.io/v3/${INFURA_ID}`,
    faucet: "https://goerli-faucet.slock.it/",
    blockExplorer: "https://goerli.etherscan.io/",
  },
  xdai: {
    name: "xdai",
    color: "#48a9a6",
    chainId: 100,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://dai.poa.network",
    faucet: "https://xdai-faucet.top/",
    blockExplorer: "https://blockscout.com/poa/xdai/",
  },
  polygon: {
    name: "polygon",
    color: "#2bbdf7",
    chainId: 137,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://polygon-rpc.com/",
    blockExplorer: "https://polygonscan.com/",
  },
  mumbai: {
    name: "mumbai",
    color: "#92D9FA",
    chainId: 80001,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://rpc-mumbai.maticvigil.com",
    faucet: "https://faucet.polygon.technology/",
    blockExplorer: "https://mumbai.polygonscan.com/",
  },
  localArbitrum: {
    name: "localArbitrum",
    color: "#50a0ea",
    chainId: 153869338190755,
    rpcUrl: `http://localhost:8547`,
    blockExplorer: "",
  },
  localArbitrumL1: {
    name: "localArbitrumL1",
    color: "#50a0ea",
    chainId: 44010,
    rpcUrl: `http://localhost:7545`,
    blockExplorer: "",
  },
  rinkebyArbitrum: {
    name: "Arbitrum Testnet",
    color: "#50a0ea",
    chainId: 421611,
    rpcUrl: `https://rinkeby.arbitrum.io/rpc`,
    blockExplorer: "https://rinkeby-explorer.arbitrum.io/#/",
  },
  arbitrum: {
    name: "Arbitrum",
    color: "#50a0ea",
    chainId: 42161,
    rpcUrl: `https://arb1.arbitrum.io/rpc`,
    blockExplorer: "https://explorer.arbitrum.io/#/",
    gasPrice: 0,
  },
  localOptimismL1: {
    name: "localOptimismL1",
    color: "#f01a37",
    chainId: 31337,
    rpcUrl: "http://" + (global.window ? window.location.hostname : "localhost") + ":9545",
    blockExplorer: "",
  },
  localOptimism: {
    name: "localOptimism",
    color: "#f01a37",
    chainId: 420,
    rpcUrl: "http://" + (global.window ? window.location.hostname : "localhost") + ":8545",
    blockExplorer: "",
    gasPrice: 0,
  },
  kovanOptimism: {
    name: "kovanOptimism",
    color: "#f01a37",
    chainId: 69,
    rpcUrl: `https://kovan.optimism.io`,
    blockExplorer: "https://kovan-optimistic.etherscan.io/",
    gasPrice: 0,
  },
  optimism: {
    name: "optimism",
    color: "#f01a37",
    chainId: 10,
    rpcUrl: `https://mainnet.optimism.io`,
    blockExplorer: "https://optimistic.etherscan.io/",
  },
  localAvalanche: {
    name: "localAvalanche",
    color: "#666666",
    chainId: 43112,
    rpcUrl: `http://localhost:9650/ext/bc/C/rpc`,
    blockExplorer: "",
    gasPrice: 225000000000,
  },
  fujiAvalanche: {
    name: "fujiAvalanche",
    color: "#666666",
    chainId: 43113,
    rpcUrl: `https://api.avax-test.network/ext/bc/C/rpc`,
    blockExplorer: "https://cchain.explorer.avax-test.network/",
    gasPrice: 225000000000,
  },
  mainnetAvalanche: {
    name: "mainnetAvalanche",
    color: "#666666",
    chainId: 43114,
    rpcUrl: `https://api.avax.network/ext/bc/C/rpc`,
    blockExplorer: "https://cchain.explorer.avax.network/",
    gasPrice: 225000000000,
  },
  testnetHarmony: {
    name: "testnetHarmony",
    color: "#00b0ef",
    chainId: 1666700000,
    rpcUrl: `https://api.s0.b.hmny.io`,
    blockExplorer: "https://explorer.pops.one/",
    gasPrice: 1000000000,
  },
  mainnetHarmony: {
    name: "mainnetHarmony",
    color: "#00b0ef",
    chainId: 1666600000,
    rpcUrl: `https://api.harmony.one`,
    blockExplorer: "https://explorer.harmony.one/",
    gasPrice: 1000000000,
  },
  fantom: {
    name: "fantom",
    color: "#1969ff",
    chainId: 250,
    rpcUrl: `https://rpcapi.fantom.network`,
    blockExplorer: "https://ftmscan.com/",
    gasPrice: 1000000000,
  },
  testnetFantom: {
    name: "testnetFantom",
    color: "#1969ff",
    chainId: 4002,
    rpcUrl: `https://rpc.testnet.fantom.network`,
    faucet: "https://faucet.fantom.network/",
    blockExplorer: "https://testnet.ftmscan.com/",
    gasPrice: 1000000000,
  },
};

export const NETWORK = chainId => {
  for (const n in NETWORKS) {
    if (NETWORKS[n].chainId === chainId) {
      return NETWORKS[n];
    }
  }
};

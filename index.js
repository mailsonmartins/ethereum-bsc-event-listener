const ethers = require('ethers');
require("dotenv").config();

const uniswapv3PoolArtifact = require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json");
const pancakeswapv3PoolArtifact = require("@pancakeswap/v3-core/artifacts/contracts/PancakeV3Pool.sol/PancakeV3Pool.json");

const uniswapContractAddress = [
    '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
]

const pancakeSwapContractAddress = [
    '0x10ED43C718714eb63d5aA57B78B54704E256024E',
]

const providerEthereum = new ethers.JsonRpcProvider(process.env.ETH_RPC);
const providerBSC = new ethers.JsonRpcProvider(process.env.BSC_RPC);

uniswapContractAddress.map(async address => {
    const pool = new ethers.Contract(address, uniswapv3PoolArtifact.abi, providerEthereum)

    await pool.on('Mint', async (sender, owner, tickLower, tickUpper, amount, _amount0, _amount1) => {
        console.log('Nova liquidez adicionada no Uniswap na Ethereum:');
        console.log('Token0:', sender);
        console.log('Token1:', owner);
        console.log('Quantidade de LP:', amount.toString());

        const erc20ABI = [
            'function name() view returns (string)',
            'function symbol() view returns (string)'
        ];
    
        // Faça uma chamada para o contrato do token para obter o nome e o símbolo
        const token0Contract = new ethers.Contract(sender, erc20ABI, providerEthereum);

        // Obter o nome do token
        token0Contract.name().then(name => {
            console.log('Nome do token:', name);
        }).catch(err => {
            console.error('Não foi possível obter o nome do token');
        });

        // Obter o símbolo do token
        token0Contract.symbol().then(symbol => {
            console.log('Símbolo do token:', symbol);
            console.log('----------------------------------');
        }).catch(err => {
            console.error('Não foi possível obter o símbolo do token');
            console.log('----------------------------------');
        });
    
    });

})

pancakeSwapContractAddress.map(async address => {
    const pool = new ethers.Contract(address, pancakeswapv3PoolArtifact.abi, providerBSC)

    await pool.on('Mint', async (sender, owner, tickLower, tickUpper, amount, _amount0, _amount1) => {
        console.log('Nova liquidez adicionada no PancakeSwap na BSC:');
        console.log('Token0:', sender);
        console.log('Token1:', owner);
        console.log('Quantidade de LP:', amount.toString());

        const erc20ABI = [
            'function name() view returns (string)',
            'function symbol() view returns (string)'
        ];
    
        // Faça uma chamada para o contrato do token para obter o nome e o símbolo
        const token0Contract = new ethers.Contract(sender, erc20ABI, providerBSC);

        // Obter o nome do token
        token0Contract.name().then(name => {
            console.log('Nome do token:', name);
        }).catch(err => {
            console.error('Não foi possível obter o nome do token');
        });

        // Obter o símbolo do token
        token0Contract.symbol().then(symbol => {
            console.log('Símbolo do token:', symbol);
            console.log('----------------------------------');
        }).catch(err => {
            console.error('Não foi possível obter o símbolo do token');
            console.log('----------------------------------');
        });
    
    });

})

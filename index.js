const ethers = require('ethers');
require("dotenv").config();

const uniswapv2Pair = require("@uniswap/v2-core/build/UniswapV2Pair.json");
const pancakeswapv2Pair = require("@pancakeswap-libs/pancake-swap-core/build/PancakePair.json");

const uniswapContractAddress = [
    '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
]

const pancakeSwapContractAddress = [
    '0x10ED43C718714eb63d5aA57B78B54704E256024E',
]

const providerEthereum = new ethers.JsonRpcProvider(process.env.ETH_RPC);
const providerBSC = new ethers.JsonRpcProvider(process.env.BSC_RPC);

// Função para verificar se o endereço é um contrato
async function isContract(address,provider) {
    const code = await provider.getCode(address);
    return code !== '0x';
}

uniswapContractAddress.map(async address => {
    const pool = new ethers.Contract(address, uniswapv2Pair.abi, providerEthereum)

    await pool.on('Transfer', async (from, to, amount, event) => {

        if (await isContract(to,providerEthereum)) {
            // Obter os endereços dos tokens do par
            let contract = new ethers.Contract(to, uniswapv2Pair.abi, providerEthereum);
            
            try{
                const token0 = await contract.token0();
                const token1 = await contract.token1();

                // Verificar qual token não é WETH
                const erc20Token = token0 === '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' ? token1 : token0;
                let token0Contract = new ethers.Contract(erc20Token, uniswapv2Pair.abi, providerEthereum);

                // Obter o nome do token
                token0Contract.name().then(name => {
                    console.log('Ethereum chain');
                    console.log('CA: ', erc20Token);
                    console.log('Quantidade de LP:', amount.toString());
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
            }catch{
                console.error('Não foi possível obter os dados do token');
            }
            
        }    
    });

})

pancakeSwapContractAddress.map(async address => {
    const pool = new ethers.Contract(address, pancakeswapv2Pair.abi, providerBSC)

    await pool.on('Transfer', async (from, to, amount, event) => {

        if (await isContract(to,providerBSC)) {
            // Obter os endereços dos tokens do par
            let contract = new ethers.Contract(to, pancakeswapv2Pair.abi, providerBSC);
            
            try{
                const token0 = await contract.token0();
                const token1 = await contract.token1();

                // Verificar qual token não é WBNB
                const erc20Token = token0 === '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' ? token1 : token0;
                let token0Contract = new ethers.Contract(erc20Token, pancakeswapv2Pair.abi, providerBSC);

                // Obter o nome do token
                token0Contract.name().then(name => {
                    console.log('BSC chain');
                    console.log('CA: ', erc20Token);
                    console.log('Quantidade de LP:', amount.toString());
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
            }catch{
                console.error('Não foi possível obter os dados do token');
            }
            
        }    
    });

})

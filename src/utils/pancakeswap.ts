import { constants } from 'ethers';
import { PancakeswapPair } from 'simple-pancakeswap-sdk-with-multicall-fix';

export const getBNBPrice = async (): Promise<string> => {
  try {
    const pancakeswapPair = new PancakeswapPair({
      fromTokenContractAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', //WBNB Address
      toTokenContractAddress: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', //BUSD Address
      ethereumAddress: constants.AddressZero,
    });

    const pancakeswapPairFactory = await pancakeswapPair.createFactory();
    const result = await pancakeswapPairFactory.findBestRoute('1');
    return Number(result.bestRouteQuote.expectedConvertQuote).toFixed(2);
  } catch (error) {
    throw error;
  }
};

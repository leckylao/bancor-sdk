import { SDK } from '../src/index';
import * as eos from '../src/blockchains/eos';
import * as ethereum from '../src/blockchains/ethereum';

describe('paths test', () => {
    const sdk = new SDK();

    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('getShortestPath from eos token to eos token', async () => {
        const spyGetAnchorToken = jest
            .spyOn(eos, 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        const spyGetConvertibleTokens = jest
            .spyOn(eos, 'getConvertibleTokens')
            .mockImplementationOnce(() => ({ AAA: { AAACCC: 'aaacccaaaccc' } }))
            .mockImplementationOnce(() => ({ CCC: { AAACCC: 'aaacccaaaccc' } }));

        const spyGetSmartTokens = jest
            .spyOn(eos, 'getSmartTokens')
            .mockImplementationOnce(() => ({ }))
            .mockImplementationOnce(() => ({ }));

        const spyGetReservesFromCode = jest
            .spyOn(eos, 'getReservesFromCode')
            .mockResolvedValueOnce({
                rows: [{
                    contract: 'aaaaaaaaaaaa',
                    currency: '0.0 AAA'
                }]
            });

        const received = await sdk.getShortestPath(
            { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' },
            { blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }
        );

        const expected = [
            { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' },
            { blockchainType: 'eos', blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
            { blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }
        ];

        expect(received).toEqual(expected);
        expect(spyGetAnchorToken).toHaveBeenCalledTimes(1);
        expect(spyGetConvertibleTokens).toHaveBeenCalledTimes(2);
        expect(spyGetSmartTokens).toHaveBeenCalledTimes(2);
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
    });

    it('getShortestPath from eos token to ethereum token', async () => {
        const spyGetContractAddresses = jest
            .spyOn(ethereum, 'getContractAddresses')
            .mockImplementationOnce(() => ({ anchorToken: '0x3333333333333333333333333333333333333333' }));

        const spyGetGraph = jest
            .spyOn(ethereum, 'getGraph')
            .mockImplementationOnce(() => Promise.resolve({
               '0x1111111111111111111111111111111111111111' : ['0x2222222222222222222222222222222222222222'],
               '0x2222222222222222222222222222222222222222' : ['0x1111111111111111111111111111111111111111', '0x3333333333333333333333333333333333333333'],
               '0x3333333333333333333333333333333333333333' : ['0x2222222222222222222222222222222222222222']
            }));

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('18'))
            .mockImplementationOnce(() => Promise.resolve('18'));

        const spyGetRates = jest
            .spyOn(ethereum, 'getRates')
            .mockImplementationOnce(() => Promise.resolve(['0']));

        const spyGetAnchorToken = jest
            .spyOn(eos, 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }))
            .mockImplementationOnce(() => ({ blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        const spyGetConvertibleTokens = jest
            .spyOn(eos, 'getConvertibleTokens')
            .mockImplementationOnce(() => ({ AAA: { AAACCC: 'aaacccaaaccc' } }))
            .mockImplementationOnce(() => ({ CCC: { AAACCC: 'aaacccaaaccc' } }));

        const spyGetSmartTokens = jest
            .spyOn(eos, 'getSmartTokens')
            .mockImplementationOnce(() => ({ }))
            .mockImplementationOnce(() => ({ }));

        const spyGetReservesFromCode = jest
            .spyOn(eos, 'getReservesFromCode')
            .mockResolvedValueOnce({
                rows: [{
                    contract: 'aaaaaaaaaaaa',
                    currency: '0.0 AAA'
                }]
            });

        const received = await sdk.getShortestPath(
            { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' },
            { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' }
        );

        const expected = [
            { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' },
            { blockchainType: 'eos', blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
            { blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
            { blockchainType: 'ethereum', blockchainId: '0x3333333333333333333333333333333333333333' },
            { blockchainType: 'ethereum', blockchainId: '0x2222222222222222222222222222222222222222' },
            { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' }
        ];

        expect(received).toEqual(expected);
        expect(spyGetGraph).toHaveBeenCalledTimes(1);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetRates).toHaveBeenCalledTimes(1);
        expect(spyGetAnchorToken).toHaveBeenCalledTimes(2);
        expect(spyGetConvertibleTokens).toHaveBeenCalledTimes(2);
        expect(spyGetSmartTokens).toHaveBeenCalledTimes(2);
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetContractAddresses).toHaveBeenCalledTimes(1);
    });

    it('getShortestPath from ethereum token to eos token', async () => {
        const spyGetContractAddresses = jest
            .spyOn(ethereum, 'getContractAddresses')
            .mockImplementationOnce(() => ({ anchorToken: '0x3333333333333333333333333333333333333333' }));

        const spyGetGraph = jest
            .spyOn(ethereum, 'getGraph')
            .mockImplementationOnce(() => Promise.resolve({
               '0x1111111111111111111111111111111111111111' : ['0x2222222222222222222222222222222222222222'],
               '0x2222222222222222222222222222222222222222' : ['0x1111111111111111111111111111111111111111', '0x3333333333333333333333333333333333333333'],
               '0x3333333333333333333333333333333333333333' : ['0x2222222222222222222222222222222222222222']
            }));

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('18'))
            .mockImplementationOnce(() => Promise.resolve('18'));

        const spyGetRates = jest
            .spyOn(ethereum, 'getRates')
            .mockImplementationOnce(() => Promise.resolve(['0']));

        const spyGetAnchorToken = jest
            .spyOn(eos, 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }))
            .mockImplementationOnce(() => ({ blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        const spyGetConvertibleTokens = jest
            .spyOn(eos, 'getConvertibleTokens')
            .mockImplementationOnce(() => ({ AAA: { AAACCC: 'aaacccaaaccc' } }))
            .mockImplementationOnce(() => ({ CCC: { AAACCC: 'aaacccaaaccc' } }));

        const spyGetSmartTokens = jest
            .spyOn(eos, 'getSmartTokens')
            .mockImplementationOnce(() => ({ }))
            .mockImplementationOnce(() => ({ }));

        const spyGetReservesFromCode = jest
            .spyOn(eos, 'getReservesFromCode')
            .mockResolvedValueOnce({
                rows: [{
                    contract: 'aaaaaaaaaaaa',
                    currency: '0.0 AAA'
                }]
            });

        const received = await sdk.getShortestPath(
            { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' }
        );

        const expected = [
            { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: 'ethereum', blockchainId: '0x2222222222222222222222222222222222222222' },
            { blockchainType: 'ethereum', blockchainId: '0x3333333333333333333333333333333333333333' },
            { blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
            { blockchainType: 'eos', blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
            { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' }
        ];

        expect(received).toEqual(expected);
        expect(spyGetGraph).toHaveBeenCalledTimes(1);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetRates).toHaveBeenCalledTimes(1);
        expect(spyGetAnchorToken).toHaveBeenCalledTimes(2);
        expect(spyGetConvertibleTokens).toHaveBeenCalledTimes(2);
        expect(spyGetSmartTokens).toHaveBeenCalledTimes(2);
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetContractAddresses).toHaveBeenCalledTimes(1);
    });

    it('getShortestPath from ethereum token to ethereum token', async () => {
        const spyGetGraph = jest
            .spyOn(ethereum, 'getGraph')
            .mockImplementationOnce(() => Promise.resolve({
                '0x1111111111111111111111111111111111111111' : ['0x2222222222222222222222222222222222222222', '0x3333333333333333333333333333333333333333', '0x4444444444444444444444444444444444444444'],
                '0x2222222222222222222222222222222222222222' : ['0x3333333333333333333333333333333333333333', '0x4444444444444444444444444444444444444444', '0x1111111111111111111111111111111111111111'],
                '0x3333333333333333333333333333333333333333' : ['0x4444444444444444444444444444444444444444', '0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'],
                '0x4444444444444444444444444444444444444444' : ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222', '0x3333333333333333333333333333333333333333']
            }));

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('10'))
            .mockImplementationOnce(() => Promise.resolve('10'));

        const spyGetRates = jest
            .spyOn(ethereum, 'getRates')
            .mockImplementationOnce(() => Promise.resolve([
                '5555555555',
                '4444444444',
                '3333333333',
                '2222222222',
                '1111111111'
            ]));

        const received = await sdk.getShortestPath(
            { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: 'ethereum', blockchainId: '0x4444444444444444444444444444444444444444' }
        );

        const expected = [
            { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: 'ethereum', blockchainId: '0x4444444444444444444444444444444444444444' }
        ];

        expect(received).toEqual(expected);
        expect(spyGetGraph).toHaveBeenCalledTimes(1);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetRates).toHaveBeenCalledTimes(1);
    });

    it('getCheapestPath from eos token to eos token', async () => {
        const spyGetAnchorToken = jest
            .spyOn(eos, 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        const spyGetConvertibleTokens = jest
            .spyOn(eos, 'getConvertibleTokens')
            .mockImplementationOnce(() => ({ AAA: { AAACCC: 'aaacccaaaccc' } }))
            .mockImplementationOnce(() => ({ CCC: { AAACCC: 'aaacccaaaccc' } }));

        const spyGetSmartTokens = jest
            .spyOn(eos, 'getSmartTokens')
            .mockImplementationOnce(() => ({ }))
            .mockImplementationOnce(() => ({ }));

        const spyGetReservesFromCode = jest
            .spyOn(eos, 'getReservesFromCode')
            .mockResolvedValueOnce({
                rows: [{
                    contract: 'aaaaaaaaaaaa',
                    currency: '0.0 AAA'
                }]
            });

        const received = await sdk.getCheapestPath(
            { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' },
            { blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }
        );

        const expected = [
            { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' },
            { blockchainType: 'eos', blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
            { blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }
        ];

        expect(received).toEqual(expected);
        expect(spyGetAnchorToken).toHaveBeenCalledTimes(1);
        expect(spyGetConvertibleTokens).toHaveBeenCalledTimes(2);
        expect(spyGetSmartTokens).toHaveBeenCalledTimes(2);
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
    });

    it('getCheapestPath from eos token to ethereum token', async () => {
        const spyGetContractAddresses = jest
            .spyOn(ethereum, 'getContractAddresses')
            .mockImplementationOnce(() => ({ anchorToken: '0x3333333333333333333333333333333333333333' }));

        const spyGetGraph = jest
            .spyOn(ethereum, 'getGraph')
            .mockImplementationOnce(() => Promise.resolve({
               '0x1111111111111111111111111111111111111111' : ['0x2222222222222222222222222222222222222222'],
               '0x2222222222222222222222222222222222222222' : ['0x1111111111111111111111111111111111111111', '0x3333333333333333333333333333333333333333'],
               '0x3333333333333333333333333333333333333333' : ['0x2222222222222222222222222222222222222222']
            }));

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('18'))
            .mockImplementationOnce(() => Promise.resolve('18'));

        const spyGetRates = jest
            .spyOn(ethereum, 'getRates')
            .mockImplementationOnce(() => Promise.resolve(['0']));

        const spyGetAnchorToken = jest
            .spyOn(eos, 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }))
            .mockImplementationOnce(() => ({ blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        const spyGetConvertibleTokens = jest
            .spyOn(eos, 'getConvertibleTokens')
            .mockImplementationOnce(() => ({ AAA: { AAACCC: 'aaacccaaaccc' } }))
            .mockImplementationOnce(() => ({ CCC: { AAACCC: 'aaacccaaaccc' } }));

        const spyGetSmartTokens = jest
            .spyOn(eos, 'getSmartTokens')
            .mockImplementationOnce(() => ({ }))
            .mockImplementationOnce(() => ({ }));

        const spyGetReservesFromCode = jest
            .spyOn(eos, 'getReservesFromCode')
            .mockResolvedValueOnce({
                rows: [{
                    contract: 'aaaaaaaaaaaa',
                    currency: '0.0 AAA'
                }]
            });

        const received = await sdk.getCheapestPath(
            { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' },
            { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' }
        );

        const expected = [
            { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' },
            { blockchainType: 'eos', blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
            { blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
            { blockchainType: 'ethereum', blockchainId: '0x3333333333333333333333333333333333333333' },
            { blockchainType: 'ethereum', blockchainId: '0x2222222222222222222222222222222222222222' },
            { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' }
        ];

        expect(received).toEqual(expected);
        expect(spyGetGraph).toHaveBeenCalledTimes(1);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetRates).toHaveBeenCalledTimes(1);
        expect(spyGetAnchorToken).toHaveBeenCalledTimes(2);
        expect(spyGetConvertibleTokens).toHaveBeenCalledTimes(2);
        expect(spyGetSmartTokens).toHaveBeenCalledTimes(2);
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetContractAddresses).toHaveBeenCalledTimes(1);
    });

    it('getCheapestPath from ethereum token to eos token', async () => {
        const spyGetContractAddresses = jest
            .spyOn(ethereum, 'getContractAddresses')
            .mockImplementationOnce(() => ({ anchorToken: '0x3333333333333333333333333333333333333333' }));

        const spyGetGraph = jest
            .spyOn(ethereum, 'getGraph')
            .mockImplementationOnce(() => Promise.resolve({
               '0x1111111111111111111111111111111111111111' : ['0x2222222222222222222222222222222222222222'],
               '0x2222222222222222222222222222222222222222' : ['0x1111111111111111111111111111111111111111', '0x3333333333333333333333333333333333333333'],
               '0x3333333333333333333333333333333333333333' : ['0x2222222222222222222222222222222222222222']
            }));

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('18'))
            .mockImplementationOnce(() => Promise.resolve('18'));

        const spyGetRates = jest
            .spyOn(ethereum, 'getRates')
            .mockImplementationOnce(() => Promise.resolve(['0']));

        const spyGetAnchorToken = jest
            .spyOn(eos, 'getAnchorToken')
            .mockImplementationOnce(() => ({ blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }))
            .mockImplementationOnce(() => ({ blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' }));

        const spyGetConvertibleTokens = jest
            .spyOn(eos, 'getConvertibleTokens')
            .mockImplementationOnce(() => ({ AAA: { AAACCC: 'aaacccaaaccc' } }))
            .mockImplementationOnce(() => ({ CCC: { AAACCC: 'aaacccaaaccc' } }));

        const spyGetSmartTokens = jest
            .spyOn(eos, 'getSmartTokens')
            .mockImplementationOnce(() => ({ }))
            .mockImplementationOnce(() => ({ }));

        const spyGetReservesFromCode = jest
            .spyOn(eos, 'getReservesFromCode')
            .mockResolvedValueOnce({
                rows: [{
                    contract: 'aaaaaaaaaaaa',
                    currency: '0.0 AAA'
                }]
            });

        const received = await sdk.getCheapestPath(
            { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' }
        );

        const expected = [
            { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: 'ethereum', blockchainId: '0x2222222222222222222222222222222222222222' },
            { blockchainType: 'ethereum', blockchainId: '0x3333333333333333333333333333333333333333' },
            { blockchainType: 'eos', blockchainId: 'aaaaaaaaaaaa', symbol: 'AAA' },
            { blockchainType: 'eos', blockchainId: 'aaacccaaaccc', symbol: 'AAACCC' },
            { blockchainType: 'eos', blockchainId: 'cccccccccccc', symbol: 'CCC' }
        ];

        expect(received).toEqual(expected);
        expect(spyGetGraph).toHaveBeenCalledTimes(1);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetRates).toHaveBeenCalledTimes(1);
        expect(spyGetAnchorToken).toHaveBeenCalledTimes(2);
        expect(spyGetConvertibleTokens).toHaveBeenCalledTimes(2);
        expect(spyGetSmartTokens).toHaveBeenCalledTimes(2);
        expect(spyGetReservesFromCode).toHaveBeenCalledTimes(1);
        expect(spyGetContractAddresses).toHaveBeenCalledTimes(1);
    });

    it('getCheapestPath from ethereum token to ethereum token', async () => {
        const spyGetGraph = jest
            .spyOn(ethereum, 'getGraph')
            .mockImplementationOnce(() => Promise.resolve({
                '0x1111111111111111111111111111111111111111' : ['0x2222222222222222222222222222222222222222', '0x3333333333333333333333333333333333333333', '0x4444444444444444444444444444444444444444'],
                '0x2222222222222222222222222222222222222222' : ['0x3333333333333333333333333333333333333333', '0x4444444444444444444444444444444444444444', '0x1111111111111111111111111111111111111111'],
                '0x3333333333333333333333333333333333333333' : ['0x4444444444444444444444444444444444444444', '0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'],
                '0x4444444444444444444444444444444444444444' : ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222', '0x3333333333333333333333333333333333333333']
            }));

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('10'))
            .mockImplementationOnce(() => Promise.resolve('10'));

        const spyGetRates = jest
            .spyOn(ethereum, 'getRates')
            .mockImplementationOnce(() => Promise.resolve([
                '5555555555',
                '4444444444',
                '3333333333',
                '2222222222',
                '1111111111'
            ]));

        const received = await sdk.getCheapestPath(
            { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: 'ethereum', blockchainId: '0x4444444444444444444444444444444444444444' }
        );

        const expected = [
            { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: 'ethereum', blockchainId: '0x2222222222222222222222222222222222222222' },
            { blockchainType: 'ethereum', blockchainId: '0x3333333333333333333333333333333333333333' },
            { blockchainType: 'ethereum', blockchainId: '0x4444444444444444444444444444444444444444' }
        ];

        expect(received).toEqual(expected);
        expect(spyGetGraph).toHaveBeenCalledTimes(1);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetRates).toHaveBeenCalledTimes(1);
    });

    it('getAllPathsAndRates from ethereum token to ethereum token', async () => {
        const spyGetGraph = jest
            .spyOn(ethereum, 'getGraph')
            .mockImplementationOnce(() => Promise.resolve({
                '0x1111111111111111111111111111111111111111' : ['0x2222222222222222222222222222222222222222', '0x3333333333333333333333333333333333333333', '0x4444444444444444444444444444444444444444'],
                '0x2222222222222222222222222222222222222222' : ['0x3333333333333333333333333333333333333333', '0x4444444444444444444444444444444444444444', '0x1111111111111111111111111111111111111111'],
                '0x3333333333333333333333333333333333333333' : ['0x4444444444444444444444444444444444444444', '0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222'],
                '0x4444444444444444444444444444444444444444' : ['0x1111111111111111111111111111111111111111', '0x2222222222222222222222222222222222222222', '0x3333333333333333333333333333333333333333']
            }));

        const spyGetDecimals = jest
            .spyOn(ethereum, 'getDecimals')
            .mockImplementationOnce(() => Promise.resolve('10'))
            .mockImplementationOnce(() => Promise.resolve('10'));

        const spyGetRates = jest
            .spyOn(ethereum, 'getRates')
            .mockImplementationOnce(() => Promise.resolve([
                '5555555555',
                '4444444444',
                '3333333333',
                '2222222222',
                '1111111111'
            ]));

        const received = await sdk.getAllPathsAndRates(
            { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' },
            { blockchainType: 'ethereum', blockchainId: '0x4444444444444444444444444444444444444444' }
        );

        const expected = [
            {
                path: [
                    { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' },
                    { blockchainType: 'ethereum', blockchainId: '0x2222222222222222222222222222222222222222' },
                    { blockchainType: 'ethereum', blockchainId: '0x3333333333333333333333333333333333333333' },
                    { blockchainType: 'ethereum', blockchainId: '0x4444444444444444444444444444444444444444' }
                ],
                rate: '0.5555555555'
            },
            {
                path: [
                    { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' },
                    { blockchainType: 'ethereum', blockchainId: '0x2222222222222222222222222222222222222222' },
                    { blockchainType: 'ethereum', blockchainId: '0x4444444444444444444444444444444444444444' }
                ],
                rate: '0.4444444444'
            },
            {
                path: [
                    { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' },
                    { blockchainType: 'ethereum', blockchainId: '0x3333333333333333333333333333333333333333' },
                    { blockchainType: 'ethereum', blockchainId: '0x4444444444444444444444444444444444444444' }
                ],
                rate: '0.3333333333'
            },
            {
                path: [
                    { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' },
                    { blockchainType: 'ethereum', blockchainId: '0x3333333333333333333333333333333333333333' },
                    { blockchainType: 'ethereum', blockchainId: '0x2222222222222222222222222222222222222222' },
                    { blockchainType: 'ethereum', blockchainId: '0x4444444444444444444444444444444444444444' }
                ],
                rate: '0.2222222222'
            },
            {
                path: [
                    { blockchainType: 'ethereum', blockchainId: '0x1111111111111111111111111111111111111111' },
                    { blockchainType: 'ethereum', blockchainId: '0x4444444444444444444444444444444444444444' }
                ],
                rate: '0.1111111111'
            }
        ];

        expect(received).toEqual(expected);
        expect(spyGetGraph).toHaveBeenCalledTimes(1);
        expect(spyGetDecimals).toHaveBeenCalledTimes(2);
        expect(spyGetRates).toHaveBeenCalledTimes(1);
    });
});

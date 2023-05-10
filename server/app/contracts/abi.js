contractAbi = [
    {
        inputs: [
            {
                internalType: 'address',
                name: '_owner',
                type: 'address',
            },
            {
                internalType: 'string',
                name: '_cid',
                type: 'string',
            },
            {
                internalType: 'string',
                name: '_fileName',
                type: 'string',
            },
            {
                internalType: 'string',
                name: '_encryptedKey',
                type: 'string',
            },
        ],
        name: 'createEHR',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'idx',
                type: 'uint256',
            },
        ],
        name: 'deleteEHR',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'ehrs',
        outputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'string',
                name: 'cid',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'fileName',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'encryptedKey',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'numberOfRecords',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'idx',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: '_owner',
                type: 'address',
            },
            {
                internalType: 'string',
                name: '_cid',
                type: 'string',
            },
            {
                internalType: 'string',
                name: '_fileName',
                type: 'string',
            },
            {
                internalType: 'string',
                name: '_encryptedKey',
                type: 'string',
            },
        ],
        name: 'updateEHR',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];

module.exports = contractAbi;

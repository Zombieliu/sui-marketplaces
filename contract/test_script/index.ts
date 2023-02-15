import {Ed25519Keypair, JsonRpcProvider, RawSigner, TypeTag} from '@mysten/sui.js';
import {fromExportedKeypair} from "@mysten/sui.js";
import {ExportedKeypair} from "@mysten/sui.js/src/cryptography/keypair";
import {marketplaceObjectId, packageObjectId} from "./constants";
const provider = new JsonRpcProvider();
const schema = new Ed25519Keypair().getKeyScheme();
const private_key = 'QVg8OT8vnrT/JdXLHpV3wiBhR1FcdHmamoac5IE2PF+15p+mCrEzOnYixuwiaUOCyUl9emkEbvYoXka++RHEQQ=='
const key_pair_struct:ExportedKeypair = {
    schema,
    privateKey:private_key
}
const keypair = fromExportedKeypair(key_pair_struct)





const create = async (signer:any) => {
    const moveCallTxn = await signer.executeMoveCall({
        packageObjectId,
        module: 'marketplace',
        function: 'create',
        typeArguments: [
            '0x2::sui::SUI'
        ],
        arguments: [],
        gasBudget: 10000,
    });
    console.log(moveCallTxn);
}

const list = async (signer:any) => {
    const item = '0x489518c8b02882733bc041c8c62cb87408bd9793'
    const ask = "10000000"
    const moveCallTxn = await signer.executeMoveCall({
        packageObjectId,
        module: 'marketplace',
        function: 'list',
        typeArguments: [
            '0x2::devnet_nft::DevNetNFT',
            '0x2::sui::SUI'
        ],
        arguments: [
            marketplaceObjectId,
            item,
            ask
        ],
        gasBudget: 10000,
    });
    console.log(moveCallTxn);
}

const buy_and_take = async (signer:any) => {
    const item = '0x04cc63e86988772f160faef3524fe92864244560'
    const ask = '1000'
    const paid = ['0x2d652fe16774ec7aa7a8e617b3e097332f271fcb']
    const moveCallTxn = await signer.executeMoveCall({
        packageObjectId,
        module: 'marketplace',
        function: 'buy_and_take',
        typeArguments: [
            '0x2::devnet_nft::DevNetNFT',
            '0x2::sui::SUI'
        ],
        arguments: [
            marketplaceObjectId,
            item,
            ask,
            paid
        ],
        gasBudget: 10000,
    });
    console.log(moveCallTxn);
}

const delist_and_take = async (signer:any) => {
    const item = '0x04cc63e86988772f160faef3524fe92864244560'
    const moveCallTxn = await signer.executeMoveCall({
        packageObjectId,
        module: 'marketplace',
        function: 'delist_and_take',
        typeArguments: [
            '0x2::devnet_nft::DevNetNFT',
            '0x2::sui::SUI'
        ],
        arguments: [
            marketplaceObjectId,
            item,
        ],
        gasBudget: 10000,
    });
    console.log(moveCallTxn);
}

const split = async (signer:any)=>{
    const splitTxn = await signer.splitCoin({
        coinObjectId: '0x0a40200c1a11c50d399b9d8e1e58efcdb3b26ea0',
        // Say if the original coin has a balance of 100,
        // This function will create three new coins of amount 10, 20, 30,
        // respectively, the original coin will retain the remaining balance(40).
        splitAmounts: [10000000],
        gasBudget: 1000,
    });
    console.log('SplitCoin txn', splitTxn);
}

const query_marketplace = async () => {
    const marketplace_listening_list = await provider.getDynamicFields(marketplaceObjectId)
}

const query_pay = async () =>{
    const result = await provider.selectCoinSetWithCombinedBalanceGreaterThanOrEqual(
        '0xb56267e2916adf8f1b7cf4d528fe046e338ea9a9',
        BigInt("10000000")
    )
    console.log(result)
}

const main = async() =>{
    const signer = new RawSigner(keypair, provider);
    // console.log(signer.mergeCoin())
    await create(signer);
    // await list(signer);
    // await delist_and_take(signer);
    // await split(signer);
    // await buy_and_take(signer);
    // await query_marketplace()
    // await query_pay()
}

main()
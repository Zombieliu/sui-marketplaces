import {Ed25519Keypair, JsonRpcProvider, RawSigner, TypeTag} from '@mysten/sui.js';
import {fromExportedKeypair} from "@mysten/sui.js";
import {ExportedKeypair} from "@mysten/sui.js/src/cryptography/keypair";
const provider = new JsonRpcProvider();
const schema = new Ed25519Keypair().getKeyScheme();
const private_key = 'QVg8OT8vnrT/JdXLHpV3wiBhR1FcdHmamoac5IE2PF+15p+mCrEzOnYixuwiaUOCyUl9emkEbvYoXka++RHEQQ=='
const key_pair_struct:ExportedKeypair = {
    schema,
    privateKey:private_key
}
const keypair = fromExportedKeypair(key_pair_struct)
const packageObjectId = '0x5b53b2e30d52aee862f78bcdb2f59d1c7bde7f25'
const marketplaceObjectId = '0x79ab9e748f4bed00356e3719c5f680a9b8d439d6'



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
    const paid = '0x2d652fe16774ec7aa7a8e617b3e097332f271fcb'
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

// const split = async (signer:any)=>{
//     const splitTxn = await signer.splitCoin({
//         coinObjectId: '0x0a40200c1a11c50d399b9d8e1e58efcdb3b26ea0',
//         // Say if the original coin has a balance of 100,
//         // This function will create three new coins of amount 10, 20, 30,
//         // respectively, the original coin will retain the remaining balance(40).
//         splitAmounts: [10000000],
//         gasBudget: 1000,
//     });
//     console.log('SplitCoin txn', splitTxn);
// }

const query_marketplace = async () => {

    // // @ts-ignore
    // console.log(txn.details.reference.digest);
    // // @ts-ignore
    // const details = await provider.getTransactionWithEffects(txn.details.reference.digest);
    // console.log(details);
    // const a = await provider.getTransactionsForAddress(marketplaceObjectId,true)
    // const b = await provider.getTransactionWithEffects(a[0])
    // const c = b.effects.events
    // const d = await provider.getObject(
    //     '0x5beb445750cb71e1806444bb1f5b402c27ff9232',
    // );
    // // @ts-ignore
    // console.log(d.details)
    // @ts-ignore
    // console.log(c[7])
    // const a = await provider.getDynamicFields(marketplaceObjectId)
    const e = await provider.getObject('0x2dffaf94da0aa341f943a0638fecc381104ac492')
    // const e = await provider.getDynamicFieldObject('0x2::object::ID {bytes: 0x489518c8b02882733bc041c8c62cb87408bd9793}',"0x5beb445750cb71e1806444bb1f5b402c27ff9232")
    // @ts-ignore
    console.log(e.details.data.fields)


}




const main = async() =>{
    const signer = new RawSigner(keypair, provider);
    // await create(signer);
    // await list(signer);
    // await delist_and_take(signer);
    // await split(signer);
    // await buy_and_take(signer);
    await query_marketplace()

}
main()
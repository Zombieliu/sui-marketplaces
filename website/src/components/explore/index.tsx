import { Tab } from "@headlessui/react"
import React, {useEffect, useState} from "react";
import {ethos} from "ethos-connect";
import {JsonRpcProvider} from "@mysten/sui.js";
import {marketplaceObjectId, packageObjectId} from "../constants";
import {LoadingState} from "../../jotai";
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const  Explore = () =>{
    let [categories] = useState({
        Listings: [],
    })
    const {status, wallet } = ethos.useWallet();
    // const [openLoading,setOpenLoading] =useAtom(LoadingState)
    const [NFTListData,setNFTListData] = useState([])
    const provider = new JsonRpcProvider();
    useEffect(()=>{
        const result = async ()=>{
            // provider.c
            // console.log(coins)
            // console.log(wallet)
            // const tx_object = await provider.selectCoinSetWithCombinedBalanceGreaterThanOrEqual(
            //     "0x5061ea92790e4b7a96703e15cc75a332e85caa6f",
            //     BigInt("10000000"),
            // )
            console.log(wallet)
            //拿到市场所有出价
            const allList = await provider.getDynamicFields(marketplaceObjectId);
            // console.log(allList)
            let NFTList = []
            for (let i = 0; i < allList.data.length; i++) {
                if (allList.data[i].objectType == `${packageObjectId}::marketplace::Listing`) {
                    const ask = await provider.getObject(allList.data[i].objectId)
                    // @ts-ignore
                    const price = (ethos.formatBalance(ask.details.data.fields.ask))
                    // @ts-ignore
                    const owner = ask.details.data.fields.owner
                    const getDynamicFields = await provider.getDynamicFields(allList.data[i].objectId)
                    const NFTDetails = await provider.getObject(getDynamicFields.data[0].objectId)
                    // @ts-ignore
                    const objectId = NFTDetails.details.data.fields.id.id
                    // @ts-ignore
                    const name = NFTDetails.details.data.fields.name
                    // @ts-ignore
                    const url = NFTDetails.details.data.fields.url
                    let NFTData = {
                        price,
                        owner,
                        objectId,
                        name,
                        url
                    }
                    NFTList.push(NFTData)
                }
            }
            setNFTListData(NFTList)
        }
        result()

    },[])

    const BuyNFT = async (objectID) => {
        const tx_object = await provider.selectCoinSetWithCombinedBalanceGreaterThanOrEqual(
            wallet.address,
            BigInt("10000000"),
        )
        // @ts-ignore
        console.log(tx_object[0].details.data.fields.id.id)
        // @ts-ignore
        console.log(tx_object[1].details.data.fields.id.id)

        try {
            const signableTransaction = {
                kind: 'mergeCoins' as const,
                data: {
                    // @ts-ignore
                    primary_coin:tx_object[0].details.data.fields.id.id,
                    // @ts-ignore
                    coin_to_merge:tx_object[1].details.data.fields.id.id,
                    // @ts-ignore
                    gas:tx_object[1].details.data.fields.id.id,
                    gasBudget: 1000,
                },
            }

            // @ts-ignore
            const result = await wallet.signAndExecuteTransaction(signableTransaction)
            console.log(result)
        } catch (error) {
            console.log(error)
        }
        // console.log(wallet?.getAccounts)
        // try {
        //     const item = objectID
        //     const signableTransaction = {
        //         kind: 'moveCall' as const,
        //         data: {
        //             packageObjectId,
        //             module: 'marketplace',
        //             function: 'buy_and_take',
        //             typeArguments: [
        //                 '0x2::devnet_nft::DevNetNFT',
        //                 '0x2::sui::SUI'
        //             ],
        //             arguments: [
        //                 marketplaceObjectId,
        //                 item,
        //                 // paid
        //             ],
        //             gasBudget: 1000000,
        //         },
        //     }
        //     const result = await wallet.signAndExecuteTransaction(signableTransaction)
        //     console.log(result)
        //     // @ts-ignore
        //     const tx_status = result.effects.status.status;
        //     if (tx_status == "success") {
        //
        //         console.log("成功了")
        //     } else {
        //
        //     }
        // } catch (error) {
        //     console.log(error)
        // }

    }
    return(
        <>
            <div className="flex pt-18">

                <div className="text-black w-2/12 fixed">
                    <div className="border-b border-black py-3 pl-10 font-semibold text-xl w-full">
                        Filter
                    </div>
                </div>
                <div className="ml-56 2xl:ml-64  ">
                    <div className="pl-10  w-full ">
                        <Tab.Group>
                            <Tab.List className=" fixed w-full bg-white mx-auto  flex justify-between border-b z-10  border-black">
                                <div>
                                    {Object.keys(categories).map((category) => (
                                        <Tab
                                            key={category}
                                            className={({ selected }) =>
                                                classNames(
                                                    'w-24 py-4  font-medium  pb-2.5 outline-none',
                                                    selected
                                                        ? ' text-black  border-b-2   border-indigo-500 '
                                                        : 'text-gray-400 hover:text-black')}>
                                            {category}
                                        </Tab>
                                    ))}
                                </div>
                            </Tab.List>
                            {/*Recent*/}
                            <Tab.Panels className=" pt-20">
                                <Tab.Panel
                                    className={classNames(' rounded-xl p-1 ')}>

                                    <div className="p-5 mx-auto">

                                        <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4 ">
                                            {NFTListData.map(item=>(
                                            <div key={item.objectId} className="rounded-xl p-4 shadow hover:bg-gray-200 hover:-translate-y-3  transform transition duration-500">
                                                <img className='rounded-lg w-80' src={item.url} alt=""/>
                                                <div className="my-3 flex justify-between items-center">
                                                    <div className="text-black font-semibold ">
                                                        {item.name}
                                                    </div>

                                                        <button onClick={()=>BuyNFT(item.objectId)} className="px-4 py-1 bg-indigo-600 rounded-xl text-sm  text-white">
                                                            Buy
                                                        </button>


                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <div className="flex items-center">
                                                            <img  className="rounded-2xl w-10" src="https://gravatar.com/avatar/63e46c3b96a867ec108f133d?f=y&d=identicon&size=50" alt=""/>
                                                            <div className="ml-2">
                                                                <div className="text-sm text-gray-600 font-light">
                                                                    Sell by
                                                                </div>
                                                                <div className="text-sm font-semibold">
                                                                    {ethos.truncateMiddle(item.owner,4)}
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-600 font-light">
                                                            Current Price
                                                        </div>
                                                        <div className="text-right font-semibold">
                                                            {item.price} SUI
                                                        </div>

                                                    </div>

                                                </div>


                                            </div>

                                            ))}
                                        </div>
                                    </div>


                                </Tab.Panel>
                                {/*Popular*/}
                                <Tab.Panel className={classNames('text-gray-300 rounded-xl p-1 md:w-97')}>

                                    {/*<Popular/>*/}

                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>
                    </div>
                </div>

            </div>

        </>
    )
}

export default Explore

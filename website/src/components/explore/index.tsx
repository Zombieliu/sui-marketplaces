import { Tab } from "@headlessui/react"
import React, {useEffect, useState} from "react";
import {ethos} from "ethos-connect";
import {JsonRpcProvider} from "@mysten/sui.js";
import {marketplaceObjectId, packageObjectId} from "../constants";
import {LoadingState, SellPop_up_boxState, SellState} from "../../jotai";
import {useAtom} from "jotai";
import Loading from "../loading";
import Link from "next/link";
import Pop_up_box from "../pop_up_box";
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const  Explore = () =>{
    let [categories] = useState({
        Listings: [],
    })
    const [openLoading,setOpenLoading] =useAtom(LoadingState)
    const {status, wallet } = ethos.useWallet();
    const [queryDataState,setQueryDataState] = useState(false)
    const [NFTListData,setNFTListData] = useState([])
    const [sellState,setSellState] =useAtom(SellState)
    const [,setSellPop_up_boxState] = useAtom(SellPop_up_boxState)
    const provider = new JsonRpcProvider();
    useEffect(()=>{
        query()

    },[])
    const query = async ()=>{
        setQueryDataState(true)
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
                const price = (ask.details.data.fields.ask)
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
        setQueryDataState(false)
    }
    const BuyNFT = async (objectID,price) => {
        setOpenLoading(true)
        const tx_object = await provider.selectCoinSetWithCombinedBalanceGreaterThanOrEqual(
            wallet.address,
            BigInt(price),
        )
        let pay_list_object = []
        for (let i=0;i<tx_object.length;i++){
            // @ts-ignore
            pay_list_object.push(tx_object[i].details.data.fields.id.id)
        }

        try {
            const item = objectID
            const signableTransaction = {
                kind: 'moveCall' as const,
                data: {
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
                        price,
                        pay_list_object
                        // paid
                    ],
                    gasBudget: 10000,
                },
            }
            const result = await wallet.signAndExecuteTransaction(signableTransaction)
            console.log(result)
            // @ts-ignore
            const tx_status = result.effects.status.status;
            if (tx_status == "success") {
                await query()
                setSellState({state:true,type:"购买",hash: result.certificate.transactionDigest})
                setSellPop_up_boxState(true)
            } else {
                setSellState({state:false,type:"购买",hash: ""})
                setSellPop_up_boxState(true)
            }
        } catch (error) {
            console.log(error)
        }
        setOpenLoading(false)

    }
    return(
        <>
            <Loading/>
            <Pop_up_box/>
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
                            <Tab.Panels className=" pt-20 ">
                                <Tab.Panel
                                    className={classNames(' rounded-xl p-1  ')}>
                                    <div className={queryDataState?"absolute justify-center right-1/2  top-1/2":"hidden"}>
                                        <div className="animate-spin text-black   ">
                                            <i className="fa fa-spinner f-spin fa-2x fa-fw"></i>
                                        </div>
                                    </div>

                                    <div className={queryDataState?"hidden":"p-5"}>
                                        <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4 ">
                                            {NFTListData.map(item=>(
                                            <div key={item.objectId} className="rounded-xl p-4 shadow hover:bg-gray-200 hover:-translate-y-3  transform transition duration-500">
                                                <img className='rounded-lg w-80' src={item.url} alt=""/>
                                                <div className="my-3 flex justify-between items-center">
                                                    <div className="text-black font-semibold ">
                                                        {item.name}
                                                    </div>

                                                        <button onClick={()=>BuyNFT(item.objectId,item.price)} className="px-4 py-1 bg-indigo-600 rounded-xl text-sm  text-white">
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
                                                                <Link legacyBehavior href={`https://explorer.sui.io/address/${item.owner}?network=devnet`} className="text-sm font-semibold">
                                                                    <a target="_Blank">
                                                                        {ethos.truncateMiddle(item.owner,4)}
                                                                    </a>
                                                                </Link>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-600 font-light">
                                                            Current Price
                                                        </div>
                                                        <div className="text-right font-semibold">
                                                            {(ethos.formatBalance(item.price))} SUI
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

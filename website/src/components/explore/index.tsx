import { Tab } from "@headlessui/react"
import React, {useEffect, useState} from "react";
import {ethos} from "ethos-connect";
import {JsonRpcProvider} from "@mysten/sui.js";
import {marketplaceObjectId} from "../constants";
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const  Explore = () =>{
    let [categories] = useState({
        Listings: [],
    })
    const {status, wallet } = ethos.useWallet();
    const provider = new JsonRpcProvider();
    useEffect(()=>{

        const result = async ()=>{
         const data = await provider.getTransactionsForAddress(marketplaceObjectId)
            const data_1 = await provider.getTransactionWithEffects(data[0])
            const data_2 = await provider.getTransactionWithEffects(data[1])
            console.log(data_1)
            console.log(data_2)
        }

        result()
        // console.log(wallet?.contents)


    },[wallet?.address])
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

                                    <div className="p-5 ">

                                        <div className="grid md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-4 ">
                                            <div className="rounded-xl p-4 shadow hover:bg-gray-200 hover:-translate-y-3  transform transition duration-500">
                                                <img className='rounded-lg' src="https://nft-collections.s3.amazonaws.com/keepsake/character-2.png" alt=""/>
                                                <div className="my-3 flex justify-between items-center">
                                                    <div className="text-black font-semibold ">
                                                        Keepsake Noot
                                                    </div>
                                                    <div className="px-4 py-1 bg-indigo-600 rounded-xl text-sm  text-white">
                                                        <button className="">
                                                            Buy
                                                        </button>
                                                    </div>

                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <div className="flex items-center">
                                                            <img  className="rounded-2xl w-10" src="https://gravatar.com/avatar/63e46c3b96a867ec108f133d?f=y&d=identicon&size=50" alt=""/>
                                                            <div className="ml-2">
                                                                <div className="text-sm text-gray-600 font-light">
                                                                    Created by
                                                                </div>
                                                                <div className="text-sm font-semibold">
                                                                    Oxeb...6378
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-600 font-light">
                                                            Current Price
                                                        </div>
                                                        <div className="text-right font-semibold">
                                                            0.01 SUI
                                                        </div>

                                                    </div>

                                                </div>


                                            </div>
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

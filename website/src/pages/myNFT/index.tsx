import {Dialog, Disclosure, Tab, Transition} from "@headlessui/react";
import {useAtom} from "jotai";
import {

    LoadingState, SellPop_up_boxState, SellState,
} from "../../jotai";

import React, {Fragment, useEffect, useState} from "react";

import {ethos} from "ethos-connect";
import {gamePackageObjectId, marketplaceObjectId, packageObjectId} from "../../components/constants";
import Loading from "../../components/loading";
import {JsonRpcProvider} from "@mysten/sui.js";
import Pop_up_box from "../../components/pop_up_box";
import Header from "../../components/header";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const MyNFTList = () =>{
    const [openLoading,setOpenLoading] =useAtom(LoadingState)
    const {status, wallet } = ethos.useWallet();
    const [selectBurnInput,setSelectBurnInput] = useState(false)
    const [selectSellInput,setSelectSellInput] = useState(false)
    const [sellState,setSellState] =useAtom(SellState)
    const [,setSellPop_up_boxState] = useAtom(SellPop_up_boxState)
    const [sellNFT,setSellNFT] =useState(
        {
            url:"",
            name:"",
            objectID:""
        })

    const [MyNFTList,setMyNFTList] = useState([])
    const [queryDataState,setQueryDataState] = useState(false)
    useEffect(()=>{
        if(wallet?.address){
            query()
        }


    },[wallet?.address])
    const check = async (e) => {
        e.target.value = e.target.value.toString().match(/^\d+(?:\.\d{0,6})?/)
        if (e.target.value.indexOf('.') < 0 && e.target.value != '') {
            e.target.value = parseFloat(e.target.value);
        }
        e.target.value.replace(/\D/g, '')

    }

    const query = async () =>{
        setQueryDataState(true)
        let  NFTList = []
        if(wallet?.address){
            const data = wallet?.contents?.nfts
            for(let i = 0; i < data?.length; i++){
                let NFTData = {
                    url:data[i].imageUri,
                    name:data[i].name,
                    objectId:data[i].objectId,
                }
                NFTList.push(NFTData)
            }
            console.log(data)

            setMyNFTList(NFTList)
            setQueryDataState(false)
        }

    }
    const  sell = async () => {
        setOpenLoading(true)
        const number = (document.getElementById("token_input")as HTMLInputElement).value
        const ask = (Number(number) * Math.pow(10, 9)).toString()
        console.log(ask)
        try {
            const item = sellNFT.objectID
            const signableTransaction = {
                kind: 'moveCall' as const,
                data: {
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
                    gasBudget: 1000000,
                },
            }
            const result = await wallet.signAndExecuteTransaction(signableTransaction)
            console.log(result)
            // @ts-ignore
            const tx_status = result.effects.status.status;
            if (tx_status == "success") {
                await query()
                setSellState({state:true,type:"上架",hash: result.certificate.transactionDigest})
                setSellPop_up_boxState(true)
            } else {
                setSellState({state:false,type:"上架",hash: ""})
                setSellPop_up_boxState(true)
            }
        } catch (error) {
            console.log(error)
        }
        setSelectSellInput(false)
        setOpenLoading(false)
    }

    const  Burn = async () => {
        setOpenLoading(true)
        const address = (document.getElementById("address_input")as HTMLInputElement).value
        console.log("item",sellNFT.objectID)
        console.log("address",address)
        try {
            const item = sellNFT.objectID
            const signableTransaction = {
                kind: 'moveCall' as const,
                data: {
                    packageObjectId:gamePackageObjectId,
                    module: 'player',
                    function: 'sell_items',
                    typeArguments: [],
                    arguments: [
                       item,
                       address
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
                setSellState({state:true,type:"销毁",hash: result.certificate.transactionDigest})
                setSellPop_up_boxState(true)
            } else {
                setSellState({state:false,type:"销毁",hash: ""})
                setSellPop_up_boxState(true)
            }
        } catch (error) {
            console.log(error)
        }
        setSelectBurnInput(false)
        setOpenLoading(false)
    }
    return(
        <>
            <div className={queryDataState?"absolute justify-center right-1/2  top-1/2":"hidden"}>
                <div className="animate-spin text-black   ">
                    <i className="fa fa-spinner f-spin fa-2x fa-fw"></i>
                </div>
            </div>

            <div className={queryDataState?"hidden":"p-5 "}>
                <div className={MyNFTList.length==0?"hidden":"grid md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-5"}>
                    {MyNFTList.map(item=>(
                        <div key={item.objectId} className="rounded-xl p-4 shadow hover:bg-gray-200 hover:-translate-y-3  transform transition duration-500 ">
                            <img className='rounded-lg' src={item.url} alt=""/>
                            <div className="py-3 flex justify-between items-center border-b">
                                <div className="text-black font-semibold ">
                                    {item.name}
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <button onClick={()=>{setSelectSellInput(true),setSellNFT({
                                    url:item.url,
                                    name:item.name,
                                    objectID:item.objectId
                                })}} className="px-4 w-full py-1 mr-4 bg-indigo-600 rounded-xl text-sm  text-center text-white">
                                    Sell
                                </button>
                                <button onClick={()=>{setSelectBurnInput(true),setSellNFT({
                                    url:item.url,
                                    name:item.name,
                                    objectID:item.objectId
                                })}} className="px-4 w-full py-1 bg-indigo-600 rounded-xl text-sm  text-center text-white">
                                    Burn
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={queryDataState?"absolute justify-center right-1/2  top-1/2":"hidden"}>
                    <div className="animate-spin text-black   ">
                        <i className="fa fa-spinner f-spin fa-2x fa-fw"></i>
                    </div>
                </div>
                <div className={MyNFTList.length==0?"absolute justify-center right-1/2  top-1/2":"hidden"}>
                    暂无NFT
                </div>
            </div>

            <Transition.Root show={selectSellInput} as={Fragment}>
                <Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto " onClose={setSelectSellInput}>
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center shadow-2xl   sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-80 transition-opacity" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;
          </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="inline-block align-bottom p-0.5 rounded-lg  w-11/12 md:w-5/12 2xl:w-3/12  rounded-lg  text-left overflow-hidden shadow-xl transform transition-all sm:y-8 sm:align-middle   ">
                                <div className="bg-white px-4 py-5 sm:px-6 lg:px-12 rounded-md">
                                    <div className='flex justify-end text-xl font-light text-black 	mb-5 items-centers'>
                                        <button   onClick={() => setSelectSellInput(false)}
                                                  className="fa fa-times  outline-none" aria-hidden="true"></button>
                                    </div>
                                    <div className="flex justify-center">
                                        <div>
                                            <img className="w-36 " src={sellNFT.url} alt=""/>
                                            <div className="text-center font-semibold">
                                                {sellNFT.name}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center mt-2">
                                        输入你上架此NFT的价格
                                    </div>
                                    <input
                                        onKeyUp={check}
                                        className=" my-5  text-xs md:text-sm text-black  rounded-md p-2 w-full   border outline-none"
                                        placeholder="0.0"
                                        id="token_input"
                                        maxLength={16}
                                        autoComplete="off"
                                    />
                                    <div className="flex justify-between mt-5">
                                        <button onClick={()=>setSelectSellInput(false)} className="bg-red-100 text-red-500 px-4 py-1 rounded-lg ">
                                            取消
                                        </button>
                                        <button onClick={sell} className="bg-green-100 text-green-500 px-4 py-1 rounded-lg ">
                                            确认
                                        </button>

                                    </div>

                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            <Transition.Root show={selectBurnInput} as={Fragment}>
                <Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto " onClose={setSelectBurnInput}>
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center shadow-2xl   sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-80 transition-opacity" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;
          </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="inline-block align-bottom p-0.5 rounded-lg  w-11/12 md:w-5/12 2xl:w-3/12  rounded-lg  text-left overflow-hidden shadow-xl transform transition-all sm:y-8 sm:align-middle   ">
                                <div className="bg-white px-4 py-5 sm:px-6 lg:px-12 rounded-md">
                                    <div className='flex justify-end text-xl font-light text-black 	mb-5 items-centers'>
                                        <button   onClick={() => setSelectBurnInput(false)}
                                                  className="fa fa-times  outline-none" aria-hidden="true"></button>
                                    </div>
                                    <div className="flex justify-center">
                                        <div>
                                            <img className="w-36 " src={sellNFT.url} alt=""/>
                                            <div className="text-center font-semibold">
                                                {sellNFT.name}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center mt-2">
                                        输入你的游戏角色ID
                                    </div>
                                    <input
                                        className=" my-5  text-xs md:text-sm text-black  rounded-md p-2 w-full   border outline-none"
                                        placeholder="0x...."
                                        id="address_input"
                                        autoComplete="off"
                                    />
                                    <div className="flex justify-between mt-5">
                                        <button onClick={()=>setSelectBurnInput(false)} className="bg-red-100 text-red-500 px-4 py-1 rounded-lg ">
                                            取消
                                        </button>
                                        <button onClick={Burn} className="bg-green-100 text-green-500 px-4 py-1 rounded-lg ">
                                            确认
                                        </button>

                                    </div>

                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}

const ShelvesList = () =>{
    const [openLoading,setOpenLoading] =useAtom(LoadingState)
    const [queryDataState,setQueryDataState] = useState(false)
    const {status, wallet } = ethos.useWallet();
    const [selectInput,setSelectInput] = useState(false)
    const [sellState,setSellState] =useAtom(SellState)
    const [,setSellPop_up_boxState] = useAtom(SellPop_up_boxState)
    const [sellNFT,setSellNFT] =useState(
        {
            url:"",
            name:"",
            objectID:""
        })

    const [MyNFTList,setMyNFTList] = useState([])
    const provider = new JsonRpcProvider();
    useEffect(()=>{
        query()

    },[wallet?.address])
    const query = async () =>{
        setQueryDataState(true)
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

                if(owner == wallet.address){
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
        }
        setMyNFTList(NFTList)

        setQueryDataState(false)
    }
    const TakeOff = async () => {
        setOpenLoading(true)

        try {
            const item = sellNFT.objectID
            const signableTransaction = {
                kind: 'moveCall' as const,
                data: {
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
                },
            }
            const result = await wallet.signAndExecuteTransaction(signableTransaction)
            console.log(result)
            // @ts-ignore
            const tx_status = result.effects.status.status;
            if (tx_status == "success") {
                setSellState({state:true,type:"下架",hash: result.certificate.transactionDigest})
                setSellPop_up_boxState(true)
            } else {
                setSellState({state:false,type:"下架",hash: ""})
                setSellPop_up_boxState(true)
            }
        } catch (error) {
            console.log(error)
        }
        await query()
        setSelectInput(false)
        setOpenLoading(false)

    }


    return(
        <>
            <div className={queryDataState?"absolute justify-center right-1/2  top-1/2":"hidden"}>
                <div className="animate-spin text-black   ">
                    <i className="fa fa-spinner f-spin fa-2x fa-fw"></i>
                </div>
            </div>

            <div className={queryDataState?"hidden":"p-5 "}>

                <div className={MyNFTList.length==0?"hidden":"grid md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-5"}>
                    {MyNFTList.map(item=>(
                        <div key={item.objectId} className="relative rounded-xl p-4 shadow hover:bg-gray-200 hover:-translate-y-3  transform transition duration-500 ">
                            <div className="absolute bg-white px-2 py-0.5 shadow rounded-full text-xs right-5 top-5">
                                On Sale
                            </div>
                            <img className='rounded-lg' src={item.url} alt=""/>
                            <div className="py-3 flex justify-between items-center border-b">
                                <div className="text-black font-semibold ">
                                    {item.name}
                                </div>
                            </div>
                            <div className="flex justify-between py-2 items-center">
                                <div className="text-sm text-gray-600 font-light">
                                    Current Price
                                </div>
                                <div className="text-right font-semibold">
                                    {item.price} SUI
                                </div>
                            </div>
                            <div className="flex justify-center items-center mt-2">
                                <button onClick={()=>{setSelectInput(true),setSellNFT({
                                    url:item.url,
                                    name:item.name,
                                    objectID:item.objectId
                                })}}className="px-4 w-full py-1 bg-indigo-600 rounded-xl text-sm  text-center text-white">
                                    Take off
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={MyNFTList.length==0?"absolute justify-center right-1/2  top-1/2":"hidden"}>
                    暂无上架的NFT
                </div>

            </div>
            <Transition.Root show={selectInput} as={Fragment}>
                <Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto " onClose={setSelectInput}>
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center shadow-2xl   sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-80 transition-opacity" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;
          </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="inline-block align-bottom p-0.5 rounded-lg  w-11/12 md:w-5/12 2xl:w-3/12  rounded-lg  text-left overflow-hidden shadow-xl transform transition-all sm:y-8 sm:align-middle   ">
                                <div className="bg-white px-4 py-5 sm:px-6 lg:px-12 rounded-md">
                                    <div className='flex justify-end text-xl font-light text-black 	mb-5 items-centers'>
                                        <button   onClick={() => setSelectInput(false)}
                                                  className="fa fa-times  outline-none" aria-hidden="true"></button>
                                    </div>
                                    <div className="flex justify-center">
                                        <div>
                                            <img className="w-36 " src={sellNFT.url} alt=""/>
                                            <div className="text-center font-semibold">
                                                {sellNFT.name}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center mt-2">
                                        确定下架此NFT？
                                    </div>
                                    <div className="flex justify-between mt-5">
                                        <button onClick={()=>setSelectInput(false)} className="bg-red-100 text-red-500 px-4 py-1 rounded-lg ">
                                            取消
                                        </button>
                                        <button onClick={TakeOff}  className="bg-green-100 text-green-500 px-4 py-1 rounded-lg ">
                                            确认
                                        </button>

                                    </div>

                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}


const MyNFT = () =>{
    let [categories] = useState({
        MyNFT: [],
        Shelves :[],
    })

    const {status, wallet } = ethos.useWallet();

    return (
        <div className="">
            <Header/>
            <Loading/>
            <Pop_up_box/>

                <div className="w-full fixed   z-10" >
                    <img className="absolute  w-full h-80" src="User_bg.png" alt=""/>
                    <div className="absolute z-20 ">
                        <div className=" mt-48 flex mx-20 ">
                            <img className="w-14 rounded-full mr-2" src="" alt=""/>
                            <div className="flex flex-col justify-between">
                                <div className="font-semibold">
                                    User
                                </div>
                                <div className="text-sm bg-gray-300 flex justify-center rounded-full py-0.5 px-3">
                                    {ethos.truncateMiddle(wallet?.address, 5)}
                                </div>
                            </div>

                        </div>

                    </div>
                </div>

                <div className="flex mx-10 pt-80 ">

                    <div className="text-black w-2/12 fixed">
                        <div className="border-b border-black py-3 pl-10 font-semibold text-xl w-full">
                            Status
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
                                        className={classNames(' ')}>

                                       <MyNFTList/>


                                    </Tab.Panel>
                                    {/*Popular*/}
                                    <Tab.Panel className={classNames('')}>

                                      <ShelvesList/>

                                    </Tab.Panel>
                                </Tab.Panels>
                            </Tab.Group>
                        </div>
                    </div>

                </div>
        </div>

    )

}

export default MyNFT



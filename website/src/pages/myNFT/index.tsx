import {Dialog, Disclosure, Tab, Transition} from "@headlessui/react";
import {useAtom} from "jotai";
import {

    LoadingState,
} from "../../jotai";

import React, {Fragment, useEffect, useState} from "react";

import {ethos} from "ethos-connect";
import {Header} from "../../components/header";
import {marketplaceObjectId, packageObjectId} from "../../components/constants";
import Loading from "../../components/loading";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
const MyNFT = () =>{
    let [categories] = useState({
        Listings: [],
    })
    const [openLoading,setOpenLoading] =useAtom(LoadingState)
    const {status, wallet } = ethos.useWallet();
    const [selectInput,setSelectInput] = useState(false)
    const [sellNFT,setSellNFT] =useState(
        {
            url:"",
            name:"",
            objectID:""
    })
    const myNFTList = [{
        url:"",
        name:"",
        objectId:"",
    }]
    const [MyNFTList,setMyNFTList] = useState(myNFTList)
    useEffect(()=>{

        const query = async () =>{
            let  NFTList = []
            const data = wallet?.contents?.nfts
            for(let i = 0; i < data?.length; i++){
                let NFTData = {
                    url:data[i].imageUri,
                    name:data[i].name,
                    objectId:data[i].objectId,
                }
                NFTList.push(NFTData)
            }

            setMyNFTList(NFTList)
            console.log(wallet?.contents?.nfts)
        }

        query()

    },[wallet?.address])
    const check = async (e) => {
        e.target.value = e.target.value.toString().match(/^\d+(?:\.\d{0,6})?/)
        if (e.target.value.indexOf('.') < 0 && e.target.value != '') {
            e.target.value = parseFloat(e.target.value);
        }
        e.target.value.replace(/\D/g, '')
        // if(Number(e.target.value) > Number(swapTokenTop.data)){
        //     e.target.value=  swapTokenTop.data;
        //     (document.getElementById('token_input') as HTMLInputElement).value = e.target.value
        //
        // }
        // console.log(e.target.value)
    }
    const  sell = async () => {
        setOpenLoading(true)
        const number = (document.getElementById("token_input")as HTMLInputElement).value
        const ask = (Number(number) * Math.pow(10, 8)).toString()
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

                console.log("成功了")
            } else {

            }
        } catch (error) {
            console.log(error)
        }
        setOpenLoading(false)
    }
    return (
        <div className="">
            <Header/>
            <Loading/>

                <div className="w-full fixed   z-10" >
                    <img className="absolute  w-full h-80" src="User_bg.png" alt=""/>
                    <div className="absolute z-20 ">
                        <div className=" mt-48 flex mx-20 ">
                            <img className="w-14 rounded-full mr-2" src="user_logo.PNG" alt=""/>
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
                                                        'w-24 py-4  font-medium  pb-2.5',
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

                                            <div className="grid md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-5">
                                                {MyNFTList.map(item=>(
                                                <div key={item.objectId} className="rounded-xl p-4 shadow hover:bg-gray-200 hover:-translate-y-3  transform transition duration-500">
                                                    <img className='rounded-lg' src={item.url} alt=""/>
                                                    <div className="py-3 flex justify-between items-center border-b">
                                                        <div className="text-black font-semibold ">
                                                            {item.name}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-center items-center mt-2">
                                                        <button onClick={()=>{setSelectInput(true),setSellNFT({
                                                            url:item.url,
                                                            name:item.name,
                                                            objectID:item.objectId
                                                        })}} className="px-4 w-full py-1 bg-indigo-600 rounded-xl text-sm  text-center text-white">
                                                                Sell
                                                        </button>
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

            <Transition.Root show={selectInput} as={Fragment}>
                <Dialog as="div" className="fixed z-30 inset-0 overflow-y-auto " onClose={setSelectInput}>
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
                                        <button onClick={()=>setSelectInput(false)} className="bg-red-100 text-red-500 px-4 py-1 rounded-lg ">
                                            取消
                                        </button>
                                        <button  onClick={sell} className="bg-green-100 text-green-500 px-4 py-1 rounded-lg ">
                                            确认
                                        </button>

                                    </div>

                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

        </div>

    )

}

export default MyNFT



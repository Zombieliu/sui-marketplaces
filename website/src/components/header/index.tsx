import Link from 'next/link'
import { Popover } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Logo } from '../Logo'
import {useState} from "react";
import {ethos} from "ethos-connect";
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function MenuIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <path
                d="M5 6h14M5 18h14M5 12h14"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function ChevronUpIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <path
                d="M17 14l-5-5-5 5"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export function Header() {
    const { status, wallet } = ethos.useWallet();
    const [scroll,setScroll]=useState(false)
    const navigation = [
        { id:1 ,name: 'Export', href: '/home' },
        { id:2 ,name: 'MyNFT', href: '/myNFT' },
        // { id:5 ,name: 'Job Fair', href: '/JobFair/开发' },

    ]
    if(typeof window !== "undefined"){
        window.onscroll = function() {myFunction()};
    }
    function myFunction() {
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            setScroll(true)
        } else {
            setScroll(false)
        }
    };

    return (
        <header >
            <nav >
                <div className={classNames(scroll?"":"",
                    " flex backdrop-blur-sm  bg-white/55 fixed z-40 inset-x-0  transition duration-700  pl-5  mx-auto items-center  p-3 justify-between   sm:px-6  lg:px-10 xl:px-20  items-center ")}>
                <div className="relative z-10 flex items-center gap-16">
                        <a href="/" >
                            <Logo className="h-10 w-auto" />
                        </a>
                        <div className="hidden lg:flex lg:gap-10">
                            {navigation.map((item) => (
                                    <a key={item.name} href={item.href}
                                        className="text-base font-medium text-gray-900    transition duration-700 "
                                    >
                                        {item.name}
                                    </a>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <Popover className="lg:hidden">
                            {({ open }) => (
                                <>
                                    <Popover.Button
                                        className="relative z-10 -m-2 inline-flex items-center rounded-lg stroke-gray-900 p-2 hover:bg-gray-200/50 hover:stroke-gray-600 active:stroke-gray-900 [&:not(:focus-visible)]:focus:outline-none"
                                        aria-label="Toggle site navigation"
                                    >
                                        {({ open }) =>
                                            open ? (
                                                <ChevronUpIcon className="h-6 w-6" />
                                            ) : (
                                                <MenuIcon className="h-6 w-6" />
                                            )
                                        }
                                    </Popover.Button>
                                    <AnimatePresence initial={false}>
                                        {open && (
                                            <>
                                                <Popover.Overlay
                                                    static
                                                    as={motion.div}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="fixed inset-0 z-0 bg-gray-300/60 backdrop-blur"
                                                />
                                                <Popover.Panel
                                                    static
                                                    as={motion.div}
                                                    initial={{ opacity: 0, y: -32 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{
                                                        opacity: 0,
                                                        y: -32,
                                                        transition: { duration: 0.2 },
                                                    }}
                                                    className="absolute inset-x-0 top-0 z-0 origin-top rounded-b-2xl bg-gray-50 px-6 pb-6 pt-32 shadow-2xl shadow-gray-900/20"
                                                >
                                                    <div className="space-y-4">
                                                        {/*<MobileNavLink href="#features">*/}
                                                        {/*  Features*/}
                                                        {/*</MobileNavLink>*/}
                                                    </div>
                                                </Popover.Panel>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}
                        </Popover>
                        {/*<Button href="/login" variant="outline" className="hidden lg:block">*/}
                        {/*  Log in*/}
                        {/*</Button>*/}
                        <div className="hidden lg:block">
                        <ethos.components.AddressWidget />
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

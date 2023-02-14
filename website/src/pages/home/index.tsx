import {ethos,} from "ethos-connect";
import React, {useEffect} from "react";
import {useRouter} from "next/router";
import {useAtom} from "jotai";
import {MonsterDetails, RoleDetails, Select_LoginState, Select_RoleList} from "../../jotai";
import Pop_up_box from "../../components/pop_up_box";
import {Header} from "../../components/header";
import Explore from "../../components/explore";

const Home = () =>{

        return (
            <>

                <Pop_up_box/>
              <Header/>
                <main>
                    <Explore/>




                </main>
            </>

        )

}

export default Home



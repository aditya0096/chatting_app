import { Avatar, Button, Flex, FormControl, Heading, Input, Text } from "@chakra-ui/react"
import Head from "next/head"
import Sidebar from "../../components/Sidebar"
import { useRouter } from "next/router";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { collection, doc, onSnapshot, orderBy, query ,getDoc, onSnapshotsInSync, addDoc, serverTimestamp} from "firebase/firestore";
import { auth, db } from "../../firebaseconfig";
import {useAuthState} from 'react-firebase-hooks/auth'
import getOtherEmail from "../../utils/getOtherEmail";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
const Topbar = ({email}) =>{
    return (
        <Flex p={3} h="60px" w="100%" align="center" borderBottom="1px solid"  borderColor="gray.200">
            <Avatar  marginEnd={3}/>
            <Heading size="md">{email}</Heading>
        </Flex>
    )
}

const BottomBar = ({id,user}) => {
    const [input,setInput] = useState("");
    // console.log(input);
    const sendMessage = async (e) => {
        e.preventDefault();
        await addDoc(collection(db,`chats/${id}/messages`), {
            text: input,
            sender: user.email,
            timestamp: serverTimestamp()
        })
        setInput("");
    }
    return (
        <FormControl p={3} onSubmit={sendMessage} as="form">
           <Input placeholder="Type your message" autoComplete="off" onChange={e => setInput(e.target.value)} value={input} />
           <Button type="submit" hidden >submit</Button>
        </FormControl>
    )
}

export default function Chat(){
    const router = useRouter();
    const {id} = router.query;
    const [user] = useAuthState(auth);
    const q = query(collection(db,"chats",id,"messages"),orderBy("timestamp"));
    const [messages] = useCollectionData(q);
    const [chat] = useDocumentData(doc(db,"chats",id));
    const bottomOfChat = useRef();

    useEffect(() =>
    setTimeout(
      bottomOfChat.current.scrollIntoView({
      behavior: "smooth",
      block: 'start',
    }), 100)
  , [messages])

    const getMessages = () =>
    messages?.map(msg => {
      const sender = msg.sender === user.email;
      return (
        <Flex key={Math.random()} alignSelf={sender ? "flex-end" : "flex-start"} bg={sender ? "blue.100" : "green.100"} w="fit-content" minWidth="50px" borderRadius="5px" p={3} m={1}>
          <Text>{msg.text}</Text>
        </Flex>
      )
    })

    return (
        <Flex height = "100vh">
            <Head>
                <title>Chats</title>
            </Head>
            <Sidebar/>
            <Flex flex={1} direction="column" >
                {/* Topbar */}
                <Topbar email={getOtherEmail(chat?.users,user)}/>
                {/* CHat section */}
                <Flex flex={1} direction="column" pt={2} mx={2} overflowX="scroll" css={{ '&::-webkit-scrollbar': {width: '0px',} }}>
                    {getMessages()}
                    <div ref={bottomOfChat}></div>
                </Flex>

                {/* BottomBar */}
                <BottomBar id={id} user={user}/>

            </Flex>
        </Flex>   
    )

}
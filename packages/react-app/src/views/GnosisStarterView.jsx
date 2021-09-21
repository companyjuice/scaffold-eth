import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch, notification } from "antd";
import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import Safe, { EthersAdapter, SafeFactory, SafeTransaction, TransactionOptions } from '@gnosis.pm/safe-core-sdk'
import SafeServiceClient from '@gnosis.pm/safe-service-client'
import { Address, Balance, EtherInput, AddressInput } from "../components";
import { usePoller, useLocalStorage, useBalance } from "../hooks";
import { EthSignSignature } from './EthSignSignature'
import WalletConnect from "@walletconnect/client";

const serviceClient = new SafeServiceClient('https://safe-transaction.rinkeby.gnosis.io')

export default function GnosisStarterView({
  purpose,
  userSigner,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
  blockExplorer,
  targetNetwork
}) {
  const [to, setTo] = useState('')
  const [currentThreshold, setCurrentThreshold] = useState([])
  const [threshold, setThreshold] = useState(0)
  const [owners, setOwners] = useState([])
  const [transactions, setTransactions] = useState([])
  const [value, setValue] = useState(0)
  const [selector, setSelector] = useState('')
  const [params, setParams] = useState([])
  const [data, setData] = useState('0x00')

  const OWNERS = [
    "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    "0xa81a6a910FeD20374361B35C451a4a44F86CeD46"
  ]

  const THRESHOLD = 2

  const [safeAddress, setSafeAddress] = useLocalStorage("deployedSafe")

  const [ deploying, setDeploying ] = useState()

  const safeBalance = useBalance(localProvider, safeAddress);

  const [ safeSdk, setSafeSdk ] = useState()

  const [ safeFactory, setSafeFactory ] = useState()

  const deploySafe = useCallback(async (owners, threshold) => {
    if (!safeFactory) return
    setDeploying(true)
    const safeAccountConfig = { owners, threshold }
    const safe = await safeFactory.deploySafe(safeAccountConfig)
    const safeAddress = ethers.utils.getAddress(safe.getAddress())
    console.log("SAFE", safe, safeAddress)
    setSafeAddress(safeAddress)
    setDeploying(false)
  }, [safeFactory])

  const proposeSafeTransaction = useCallback(async (transaction) => {
    if (!safeSdk || !serviceClient) return
    console.log("BUTTON CLICKED PROPOSING:", transaction)
    const safeTransaction = await safeSdk.createTransaction(transaction)
    console.log('SAFE TX', safeTransaction)
    const safeTxHash = await safeSdk.getTransactionHash(safeTransaction)
    console.log('HASH', safeTxHash)
    const safeSignature = await safeSdk.signTransactionHash(safeTxHash)
    await serviceClient.proposeTransaction(
      safeAddress,
      safeTransaction.data,
      safeTxHash,
      safeSignature
    )
  }, [safeSdk, serviceClient, safeAddress])

  const confirmTransaction = useCallback(async (transaction) => {
    if (!safeSdk || !serviceClient) return
    const hash = transaction.safeTxHash
    const signature = await safeSdk.signTransactionHash(hash)
    await serviceClient.confirmTransaction(hash, signature.data)
  }, [safeSdk, serviceClient])

  const executeSafeTransaction = useCallback(async (transaction) => {
    if (!safeSdk) return
    console.log(transaction)
    const safeTransactionData = {
      to: transaction.to,
      value: transaction.value,
      data: transaction.data || '0x',
      operation: transaction.operation,
      safeTxGas: transaction.safeTxGas,
      baseGas: transaction.baseGas,
      gasPrice: Number(transaction.gasPrice),
      gasToken: transaction.gasToken,
      refundReceiver: transaction.refundReceiver,
      nonce: transaction.nonce
    }
    const safeTransaction = await safeSdk.createTransaction(safeTransactionData)
    transaction.confirmations.forEach(confirmation => {
      const signature = new EthSignSignature(confirmation.owner, confirmation.signature)
      safeTransaction.addSignature(signature)
    })
    const executeTxResponse = await safeSdk.executeTransaction(safeTransaction)
    const receipt = executeTxResponse.transactionResponse && (await executeTxResponse.transactionResponse.wait())
    console.log(receipt)
  }, [safeSdk])

  useEffect(async () => {
    if (!userSigner) return
    const ethAdapter = new EthersAdapter({ ethers, signer: userSigner })

    try {
      const safeFactory = await SafeFactory.create({ ethAdapter })
      setSafeFactory(safeFactory)

      if (!safeAddress) return
      /*
      // If the Safe contracts are not deployed in the current network, you can deploy them and pass the addresses to the SDK:
      const id = await ethAdapter.getChainId()
      const contractNetworks = {
        [id]: {
          multiSendAddress: <MULTI_SEND_ADDRESS>,
          safeMasterCopyAddress: <MASTER_COPY_ADDRESS>,
          safeProxyFactoryAddress: <PROXY_FACTORY_ADDRESS>
        }
      }
      */
      const safeSdk = await Safe.create({ ethAdapter, safeAddress /*, contractNetworks*/ })
      setSafeSdk(safeSdk)
    } catch (error) {
      console.log(error)
    }
  }, [userSigner, safeAddress]);

  usePoller(async () => {
    if(safeAddress){
      setSafeAddress(ethers.utils.getAddress(safeAddress))
      try{
        if(safeSdk){
          const owners = await safeSdk.getOwners()
          const threshold = await safeSdk.getThreshold()
          setOwners(owners)
          setThreshold(threshold)
          console.log("owners",owners,"threshold",threshold)
        }
        console.log("CHECKING TRANSACTIONS....",safeAddress)
        const transactions = await serviceClient.getPendingTransactions(safeAddress)
        console.log("Pending transactions:", transactions)
        const currentThreshold = [];
        for (let i = 0; i < transactions.results.length; i++) {
          const signers = [];
          currentThreshold.push(transactions.results[i].confirmations.length)
          for (let j = 0; j < transactions.results[i].confirmations.length; j ++) {
            signers.push(transactions.results[i].confirmations[j].owner)
          }
          transactions.results[i].signers = signers;
        }

        setCurrentThreshold(currentThreshold)
        setTransactions(transactions.results)
      }catch(e){
        console.log("ERROR POLLING FROM SAFE:",e)
      }
    }
  },3333);

  const [ walletConnectUrl, setWalletConnectUrl ] = useState()
  const [ connected, setConnected ] = useState()

  useEffect(()=>{
    //walletConnectUrl
    if(walletConnectUrl){



      const connector = new WalletConnect(
        {
          // Required
          uri: walletConnectUrl,
          // Required
          clientMeta: {
            description: "Gnosis Safe Starter Kit",
            url: "https://github.com/austintgriffith/scaffold-eth/tree/gnosis-starter-kit",
            icons: ["http://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/owl.png"],
            name: "Gnosis Safe Starter Kit",
          },
        }/*,
        {
          // Optional
          url: "<YOUR_PUSH_SERVER_URL>",
          type: "fcm",
          token: token,
          peerMeta: true,
          language: language,
        }*/
      );

      // Subscribe to session requests
      connector.on("session_request", (error, payload) => {
        if (error) {
          throw error;
        }

        console.log("SESSION REQUEST")
        // Handle Session Request

        connector.approveSession({
          accounts: [                 // required
            safeAddress
          ],
          chainId: targetNetwork.chainId               // required
        })

        setConnected(true)


        /* payload:
        {
          id: 1,
          jsonrpc: '2.0'.
          method: 'session_request',
          params: [{
            peerId: '15d8b6a3-15bd-493e-9358-111e3a4e6ee4',
            peerMeta: {
              name: "WalletConnect Example",
              description: "Try out WalletConnect v1.0",
              icons: ["https://example.walletconnect.org/favicon.ico"],
              url: "https://example.walletconnect.org"
            }
          }]
        }
        */
      });

      // Subscribe to call requests
      connector.on("call_request", (error, payload) => {
        if (error) {
          throw error;
        }

        console.log("REQUEST PERMISSION TO:",payload,payload.params[0])
        // Handle Call Request
        console.log("SETTING TO",payload.params[0].to)
        setTo(payload.params[0].to)
        setData(payload.params[0].data?payload.params[0].data:"0x0000")
        setValue(payload.params[0].value)
        /* payload:
        {
          id: 1,
          jsonrpc: '2.0'.
          method: 'eth_sign',
          params: [
            "0xbc28ea04101f03ea7a94c1379bc3ab32e65e62d3",
            "My email is john@doe.com - 1537836206101"
          ]
        }
        */
        /*connector.approveRequest({
          id: payload.id,
          result: "0x41791102999c339c844880b23950704cc43aa840f3739e365323cda4dfa89e7a"
        });*/

      });

      connector.on("disconnect", (error, payload) => {
        if (error) {
          throw error;
        }
        console.log("disconnect")

        // Delete connector
      });
    }
  },[ walletConnectUrl ])


  let safeInfo
  if(safeAddress){
    safeInfo = (
      <div>
        <Address value={safeAddress} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />
        <Balance value={safeBalance} price={price} />

        <div style={{padding:8}}>
        {owners&&owners.length>0?(
          <>
            <b>Signers:</b>
            <List
              bordered
              dataSource={owners}
              renderItem={item => {
                return (
                  <List.Item key={item + "_ownerEntry"}>
                    <Address address={item} ensProvider={mainnetProvider} fontSize={12} />
                  </List.Item>
                );
              }}
            />
          </>
        ):<Spin/>}

        </div>
      </div>
    )
  }else{
    safeInfo = (
      <div style={{padding:32}}>
        <Button loading={deploying} onClick={() => deploySafe(OWNERS, THRESHOLD)} type={"primary"} >
          DEPLOY SAFE
        </Button>
        <div> or enter existing address: </div>
        <AddressInput ensProvider={mainnetProvider} onChange={(addr)=>{
          if(ethers.utils.isAddress(addr)){
            console.log("addr!",addr)

            setSafeAddress(ethers.utils.getAddress(addr))
          }
        }}/>
      </div>
    )
  }




  let proposeTransaction
  if(!safeAddress){
    proposeTransaction = ""
  } else if(!owners || owners.length<=0){
    proposeTransaction = ""
  }else if(owners.includes(address)){
    proposeTransaction = (
      <>
        <Divider />

        {connected?"✅":""}<Input
          style={{width:"70%"}}
          placeholder={"wallet connect url"}
          value={walletConnectUrl}
          disabled={connected}
          onChange={(e)=>{
            setWalletConnectUrl(e.target.value)
          }}
        />{connected?<span onClick={()=>{setConnected(false);}}>X</span>:""}

        <Divider />
        <h5>Propose Transaction:</h5>

        <div style={{ margin: 8}}>
          <div style={{ padding: 4 }}>
            <AddressInput placeholder="Enter To Address"
              onChange={setTo}
              ensProvider={mainnetProvider}
              value={to}
              onChange={setTo}
            />
          </div>
          <div style={{ padding: 4 }}>
            <EtherInput
              autofocus
              price={price}
              placeholder="Enter Tx Value"
              value={value}
              /*
              onChange={v => {
                v = v && v.toString && v.toString()
                if(v){
                  const valueResult = ethers.utils.parseEther(""+v.replace(/\D/g, ""))
                  setValue(valueResult);
                }

              }}*/
              onChange={setValue}
            />
          </div>
          <div style={{ padding: 4 }}>
            <Input placeholder="Enter Selector i.e add(uint, uint)"
              onChange={async (e) => {
                setSelector(e.target.value)
              }}
            />
          </div>
          <div style={{ padding: 4 }}>
            <Input placeholder="Enter arguments separated by ,"
              onChange={async (e) => {
                setParams(e.target.value.split(','))
              }}
            />
          </div>
          {data?data:""}
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              if (selector !== '' && params.length > 0) {
                const abi = [
                  "function " + selector
                ];
                const index = selector.indexOf('(');
                const fragment = selector.substring(0, index)

                const iface = new ethers.utils.Interface(abi);
                for (let i = 0; i < params.length; i++) {
                  if (iface.fragments[0].inputs[i].baseType.includes('uint') || iface.fragments[0].inputs[i].baseType.includes('int')) {
                    params[i] = parseInt(params[i])
                  }
                }
                const data = iface.encodeFunctionData(fragment, params);
                setData(data)
              }

              const checksumForm = ethers.utils.getAddress(to)
              const partialTx = {
                to: checksumForm,
                data,
                value: ethers.utils.parseEther(value?value.toString():"0").toString()
              }
              try{
                await proposeSafeTransaction(partialTx)
              }catch(e){
                console.log("🛑 Error Proposing Transaction",e)
                notification.open({
                  message: "🛑 Error Proposing Transaction",
                  description: (
                    <>
                      {e.toString()} (check console)
                    </>
                  ),
                });
              }

            }}
          >
            Sign Transaction
          </Button>

        </div>
      </>
    )
  }

  return (
    <div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        {safeAddress?<div style={{float:"right", padding:4, cursor:"pointer", fontSize:28}} onClick={()=>{
          setSafeAddress("")
          setTransactions([])
        }}>
          x
        </div>:""}

        <div style={{padding:64}}>
          {safeInfo}
        </div>

        {proposeTransaction}

      </div>
      <Divider />
      <div style={{ margin: 8 }}>
        {
          transactions.length > 0 && transactions.map((transaction, index) => {

            let buttonDisplay = ""

            if(!owners || owners.length<=0){
              buttonDisplay = (
                <Spin/>
              )
            }else if(currentThreshold[index] < threshold){
              if(owners.includes(address) && !transaction.signers.includes(address)){
                buttonDisplay = (
                  <Button
                    style={{ marginTop: 8 }}
                    onClick={() => confirmTransaction(transaction)}
                  >
                  Sign TX</Button>
                )
              }else{
                buttonDisplay = "Waiting for more signatures..."
              }
            }else{
              if(owners.includes(address) && currentThreshold[index] >= threshold){
                buttonDisplay = (
                  <Button
                    style={{ marginTop: 8 }}
                    onClick={() => executeSafeTransaction(transaction)}
                  >Execute TX</Button>
                )
              } else {
                buttonDisplay = "Waiting to execute..."
              }
            }


            return (
              <div style={{borderBottom:"1px solid #ddd"}}>
                {console.log("transaction",transaction)}
                <h1>#{transaction.nonce}</h1>
                <Address value={transaction.to} ensProvider={mainnetProvider} />
                <p>Data: {transaction.data}</p>
                <p>Value: {ethers.utils.formatEther(transaction.value)} ETH</p>
                <div style={{padding:32}}>
                  {buttonDisplay}
                </div>
              </div>
            )
          })
        }
      </div>
      <div style={{padding:64,margin:64}}><a href="https://github.com/austintgriffith/scaffold-eth/tree/gnosis-starter-kit" target="_blank">🏗</a></div>
    </div>
  );
}

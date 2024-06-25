import fs from "fs"
import { SingletonDeploymentJSON } from "./types"

function isHex(value: string): boolean {
  return /^0x[0-9a-fA-F]*$/.test(value)
}

const fileList: string[] = [
  "compatibility_fallback_handler.json",
  "create_call.json",
  "gnosis_safe_l2.json",
  "gnosis_safe.json",
  "multi_send.json",
  "multi_send_call_only.json",
  "proxy_factory.json",
  "sign_message_lib.json",
  "simulate_tx_accessor.json",
]

for (const fileName of fileList) {
  const file = fs.readFileSync(`./src/assets/v1.3.0/${fileName}`, "utf8")
  const json = JSON.parse(file) as SingletonDeploymentJSON

  const addresses = {
    canonical: json.networkAddresses[1],
    eip155: json.networkAddresses[10],
    zksync: json.networkAddresses[324],
  }

  const newJson = {
    ...json,
    addresses,
    networkAddresses: {} as Record<string, string | string[]>,
  }

  for (const value of Object.values(addresses)) {
    if (!value) {
      throw new Error("Address not found")
    }
  }

  for (const entry of Object.entries(json.networkAddresses)) {
    const [chainId, previousAddress] = entry

    const chainListUrl = `https://raw.githubusercontent.com/ethereum-lists/chains/master/_data/chains/eip155-${chainId}.json`

    const chainData = (await fetch(chainListUrl)
      .then((res) => res.json())
      .catch((e) => {
        console.log(`Error fetching chain data for chain ${chainId}. Skipping...`, e)
        return { rpc: [] }
      })) as { rpc: string[] }

    const rpcs = chainData.rpc.filter(
      (rpc) => !rpc.startsWith("ws") && !rpc.includes("INFURA_API_KEY")
    )
    if (!rpcs.length) {
      console.log(`Chain ${chainId} not supported. Copying previous value...`)
      newJson.networkAddresses[chainId] = previousAddress
      continue
    }

    for (const rpc of rpcs) {
      const networkAddresses: string[] = []
      for (const value of Object.entries(addresses)) {
        const [addrType, addr] = value
        const deployedCode = await fetch(rpc, {
          method: "POST",
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_getCode",
            params: [addr, "latest"],
            id: 1,
          }),
        })
          .then((res) => {
            const json = res.json()

            if ("result" in json) {
              return json
            }

            throw new Error("Invalid response")
          })
          .catch((e) => {
            console.log(`Error fetching code for ${addr} on chain ${chainId}. Skipping...`, e)
            return { result: "" }
          })

        if (deployedCode.result === "0x" || deployedCode.result === "") {
          console.log(`Contract ${addr} not deployed on chain ${chainId}. Skipping...`)
          continue
        } else {
          networkAddresses.push(addrType)
        }
      }

      if (networkAddresses.length === 0) {
        console.log(
          `Contract ${fileName} not deployed on chain ${chainId}. Fallback to old json...`
        )
        newJson.networkAddresses[chainId] = previousAddress
        continue
      } else if (networkAddresses.length === 1) {
        newJson.networkAddresses[chainId] = networkAddresses[0]
      } else {
        newJson.networkAddresses[chainId] = networkAddresses
      }

      break
    }

    break
  }

  fs.writeFileSync(`./src/assets/v1.3.0/new-${fileName}`, JSON.stringify(newJson, null, 2))

  break
}

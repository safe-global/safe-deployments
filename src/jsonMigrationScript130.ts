import fs from 'fs';
import { SingletonDeploymentJSON } from './types';

const fileList: string[] = [
  'compatibility_fallback_handler.json',
  'create_call.json',
  'gnosis_safe_l2.json',
  'gnosis_safe.json',
  'multi_send.json',
  'multi_send_call_only.json',
  'proxy_factory.json',
  'sign_message_lib.json',
  'simulate_tx_accessor.json',
];

async function processFile(fileName: string) {
  const file = fs.readFileSync(`./src/__tests__/assets/v1/v1.3.0/${fileName}`, 'utf8');
  const json = JSON.parse(file) as SingletonDeploymentJSON;

  const addresses = {
    canonical: json.networkAddresses[1],
    eip155: json.networkAddresses[10],
    zksync: json.networkAddresses[324],
  };

  const newJson = {
    ...json,
    addresses,
    networkAddresses: {} as Record<string, string | string[]>,
  };
  delete newJson.defaultAddress;

  for (const value of Object.values(addresses)) {
    if (!value) {
      throw new Error('Address not found');
    }
  }

  for (const entry of Object.entries(json.networkAddresses)) {
    const [chainId, previousAddress] = entry;

    const chainListUrl = `https://raw.githubusercontent.com/ethereum-lists/chains/master/_data/chains/eip155-${chainId}.json`;

    const chainData = (await fetch(chainListUrl)
      .then((res) => res.json())
      .catch((e) => {
        console.log(`Error fetching chain data for chain ${chainId}. Skipping...`, e);
        return { rpc: [] };
      })) as { rpc: string[] };

    const rpcs = chainData.rpc.filter((rpc) => !rpc.startsWith('ws') && !rpc.includes('INFURA_API_KEY'));
    if (!rpcs.length) {
      console.log(`Chain ${chainId} is missing in chain list. Skipping...`);
      const previousAddressType = Object.keys(addresses).find((key) => addresses[key] === previousAddress);
      if (!previousAddressType) {
        throw new Error('Previous address type not found');
      }
      newJson.networkAddresses[chainId] = previousAddressType;
      continue;
    }

    for (const rpc of rpcs) {
      const networkAddresses: string[] = [];
      for (const value of Object.entries(addresses)) {
        const [addrType, addr] = value;
        const deployedCode = await fetch(rpc, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getCode',
            params: [addr, 'latest'],
            id: 1,
          }),
        })
          .then((res) => res.json())
          .then((json) => {
            if ('result' in json) {
              return json;
            }

            throw new Error('Invalid response');
          })
          .catch((e) => {
            console.log(`Error fetching code for ${addr} on chain ${chainId}. Skipping...`, e);
            return { error: true };
          });

        if (deployedCode.error) {
          console.log(`RPC failed for chain ${chainId}. Skipping...`);
          continue;
        }

        if (deployedCode.result === '0x' || deployedCode.result === '') {
          console.log(`Contract ${addr} not deployed. Skipping...`);
          continue;
        } else {
          networkAddresses.push(addrType);
        }
      }

      if (networkAddresses.length === 0) {
        console.log(`Contract ${fileName} not deployed on chain ${chainId}. Fallback to old json...`);
        const previousAddressType = Object.keys(addresses).find((key) => addresses[key] === previousAddress);
        if (!previousAddressType) {
          throw new Error('Previous address type not found');
        }
        newJson.networkAddresses[chainId] = previousAddressType;
        continue;
      } else if (networkAddresses.length === 1) {
        newJson.networkAddresses[chainId] = networkAddresses[0];
      } else {
        const previousAddressType = Object.keys(addresses).find((key) => addresses[key] === previousAddress);
        if (!previousAddressType) {
          throw new Error('Previous address type not found');
        }

        // sort the array so that the previous address type is first
        newJson.networkAddresses[chainId] = [
          previousAddressType,
          ...networkAddresses.filter((addr) => addr !== previousAddressType),
        ];
      }

      break;
    }
  }

  fs.writeFileSync(`./src/assets/v1.3.0/${fileName}`, JSON.stringify(newJson, null, 2));
}

async function main() {
  await Promise.all(fileList.map((fileName) => processFile(fileName)));
}

main().catch(console.error);

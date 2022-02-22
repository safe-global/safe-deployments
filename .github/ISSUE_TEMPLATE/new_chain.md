---
name: Evaluate new chain
about: Evaluation process for Safe contract deployment on new chains

---

## Useful Links

Please list any useful links that you encounter in the process. Such as, block explorers, faucets, bridges, etc.

## ChainId

- Provide the chain ID: 
- Provide the link to the [chainlist.org](https://chainlist.org) entry in their [repository](https://github.com/ethereum-lists/chains/tree/master/_data/chains) with the chain details: 

## Validation steps

As you complete the steps, provide links to the chain's block explorer transactions, to verify the correct execution of the steps.

- [ ] If contracts are not deployed. Deploy them using [the tool](https://github.com/gnosis/safe-contracts)
  - [ ] Verify the chain at https://chainlist.org/ .
- [ ] Please document links of interest such as faucets, bridges, block explorer, etc. as comments in this issue.
- [ ] (Optional) Execute using [safe-tasks](https://github.com/gnosis/safe-tasks) the steps in our internal [guide](https://app.gitbook.com/o/-MhyDtGxUyODu7d4sgda/s/-MhyEL1Pq_BGR0rFugaE/backend/contract-deployment-checks) for user side validation of the contracts:
  - [ ] Deploy 2 L2 safes
   - run `$ yarn safe create --l2` *(Note: you will need to specify `--factory` and `--singleton` addresses if the chain enforces EIP155)*
  - [ ] Use one safe to wrap and unwrap ETH.
  - [ ] Transfer native currency of the chain to one of the safes from your EOA
  - [ ] Transfer ERC20 token (please provide link and/or deploy one if necessary) to one of the safes
  - [ ] Transfer ERC20 token and native coin between the safes
  - [ ] Add an additional owner to one of the safes
  
Where possible, provide links to the transactions in the block explorer of the chain.

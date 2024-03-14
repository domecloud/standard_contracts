# DeSCF+ Standard Contracts

ติดตั้ง dependencies
```
npm i
```

## รัน test script 

เช่น ERC-20.js
```
npx hardhat test ./test/Token.js
```

เช่น ERC-721.js
```
npx hardhat test ./test/NFT.js
```

## ติดตั้ง contract ขึ้นเชน

เช่น deploy ERC-20 ไปยัง JIB Chain
```
npx hardhat deploy --network jbc --tags Token
```
เช่น deploy ERC-721 ไปยัง JIB Chain
```
npx hardhat deploy --network jbc --tags NFT
```

เพิ่มลดเชนได้ที่ hardhat.config.js

## verify contracts
```
npx hardhat verify --network jbc <contract_address>
```







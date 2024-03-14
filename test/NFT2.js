const { expect } = require("chai");

const URI = 'data:application/json,'+JSON.stringify({
    name: 'test',
    description: 'also test',
    image: 'ipfs://QmVCm44KbQHFVP78wzzNGipLDkd7D7GRk2FrMwLg5EQS5d'
});
const URI2 = 'data:application/json,'+JSON.stringify({
    name: 'test 2',
    description: 'also test 2',
    image: 'ipfs://QmRqvzf711NdUzqk8gKvjpCt2fC1i8ujZZ8oQtehsif2bs'
});

async function deployContract() {
    const Factory = await ethers.getContractFactory("NFT2");
    const [admin, minter, burner, admin2, alice, bob] = await ethers.getSigners();

    const NFT2 = await Factory.deploy();

    await NFT2.deployed();

    return { NFT2, admin, minter, burner, admin2, alice, bob };
}

describe("NFT2 - ACL check", function () {

    it("Should grantAdmin() by admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const DEFAULT_ADMIN_ROLE = await NFT2.DEFAULT_ADMIN_ROLE();

        await NFT2.grantAdmin(admin2.address);
        const role = await NFT2.hasRole(DEFAULT_ADMIN_ROLE, admin2.address);
        expect(role).to.equal(true);
    });

    it("Should revokeAdmin() by admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const DEFAULT_ADMIN_ROLE = await NFT2.DEFAULT_ADMIN_ROLE();

        await NFT2.grantAdmin(admin2.address);
        const role = await NFT2.hasRole(DEFAULT_ADMIN_ROLE, admin2.address);
        expect(role).to.equal(true);

        await NFT2.revokeAdmin(admin2.address);
        const role2 = await NFT2.hasRole(DEFAULT_ADMIN_ROLE, admin2.address);

        expect(role2).to.equal(false);

    });
    
    it("Should grantMinter() by admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const MINTER_ROLE = await NFT2.MINTER_ROLE();

        await NFT2.grantMinter(minter.address);
        const role = await NFT2.hasRole(MINTER_ROLE, minter.address);
        expect(role).to.equal(true);
    });

    it("Should revokeMinter() by admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const MINTER_ROLE = await NFT2.MINTER_ROLE();

        await NFT2.grantMinter(minter.address);
        const role = await NFT2.hasRole(MINTER_ROLE, minter.address);
        expect(role).to.equal(true);

        await NFT2.revokeMinter(minter.address);
        const role2 = await NFT2.hasRole(MINTER_ROLE, minter.address);
        expect(role2).to.equal(false);

    });

    it("Should grantBurner() by admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const BURNER_ROLE = await NFT2.BURNER_ROLE();

        await NFT2.grantBurner(burner.address);
        const role = await NFT2.hasRole(BURNER_ROLE, burner.address);
        expect(role).to.equal(true);
    });

    it("Should revokeBurner() by admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const BURNER_ROLE = await NFT2.BURNER_ROLE();

        await NFT2.grantBurner(burner.address);
        const role = await NFT2.hasRole(BURNER_ROLE, burner.address);
        expect(role).to.equal(true);

        await NFT2.revokeBurner(burner.address);
        const role2 = await NFT2.hasRole(BURNER_ROLE, burner.address);
        expect(role2).to.equal(false);

    });


    it("Should NOT grantAdmin() by non-admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await expect(
            NFT2.connect(alice).grantAdmin(admin2.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });

    it("Should NOT revokeAdmin() by non-admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await expect(
            NFT2.connect(alice).revokeAdmin(admin2.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });


    it("Should NOT grantMinter() by non-admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await expect(
            NFT2.connect(alice).grantMinter(minter.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });

    it("Should NOT revokeMinter() by non-admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await expect(
            NFT2.connect(alice).revokeMinter(minter.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });

    it("Should NOT grantBurner() non-admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await expect(
            NFT2.connect(alice).grantBurner(burner.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });

    it("Should NOT revokeBurner() non-admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await expect(
            NFT2.connect(alice).revokeBurner(burner.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });
});

describe("NFT2 - publiclyMintable check", function () {
    it("Should publiclyMintable set to false by default", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const publiclyMintable = await NFT2.isPubliclyMintable();
        expect(publiclyMintable).to.equal(false);
    });

    it("Should setPubliclyMintable() to true by admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await NFT2.setPubliclyMintable(true);
        const publiclyMintable = await NFT2.isPubliclyMintable();
        expect(publiclyMintable).to.equal(true);
    });

    it("Should setPubliclyMintable() to false by admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await NFT2.setPubliclyMintable(false);

        const publiclyMintable = await NFT2.isPubliclyMintable();
        expect(publiclyMintable).to.equal(false);
    });

    it("Should setPubliclyMintable() to true by new-admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT2.grantAdmin(admin2.address);

        await NFT2.connect(admin2).setPubliclyMintable(true);

        const publiclyMintable = await NFT2.isPubliclyMintable();
        expect(publiclyMintable).to.equal(true);
    });

    it("Should NOT setPubliclyMintable() to true by non-admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await expect(
            NFT2.connect(alice).setPubliclyMintable(true)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });

    it("Should NOT setPubliclyMintable() by former-admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT2.grantAdmin(admin2.address);
        await NFT2.connect(admin2).revokeAdmin(admin.address);

        await expect(
            NFT2.setPubliclyMintable(true)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });
});

describe("NFT2 - freeze check", function () {
    it("Should freezeAccounts set to false by default", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const isFreeze = await NFT2.freezeAccounts(admin.address);
        expect(isFreeze).to.equal(false);
    });

    it("Should freeze() by admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT2.freeze(alice.address);
        const isFreeze = await NFT2.freezeAccounts(alice.address);
        expect(isFreeze).to.equal(true);
    });

    it("Should unfreeze() by admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT2.freeze(alice.address);
        const isFreeze = await NFT2.freezeAccounts(alice.address);
        expect(isFreeze).to.equal(true);

        await NFT2.unfreeze(alice.address);
        const isFreeze2 = await NFT2.freezeAccounts(alice.address);
        expect(isFreeze2).to.equal(false);
    });

    it("Should freeze() by new admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT2.grantAdmin(admin2.address);

        await NFT2.connect(admin2).freeze(alice.address);
        const isFreeze = await NFT2.freezeAccounts(alice.address);
        expect(isFreeze).to.equal(true);
    });

    it("Should unfreeze() by new admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT2.grantAdmin(admin2.address);

        await NFT2.connect(admin2).freeze(alice.address);
        const isFreeze = await NFT2.freezeAccounts(alice.address);
        expect(isFreeze).to.equal(true);

        await NFT2.connect(admin2).unfreeze(alice.address);
        const isFreeze2 = await NFT2.freezeAccounts(alice.address);
        expect(isFreeze2).to.equal(false);

    });

    it("Should not freeze() by non-admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await expect(
            NFT2.connect(bob).freeze(alice.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');

    });

    it("Should not unfreeze() by non-admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await NFT2.freeze(alice.address);
        const isFreeze = await NFT2.freezeAccounts(alice.address);
        expect(isFreeze).to.equal(true);

        await expect(
            NFT2.connect(bob).unfreeze(alice.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');

    });

    it("Should not freeze() by former admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT2.grantAdmin(admin2.address);
        await NFT2.revokeAdmin(admin2.address);

        await expect(
            NFT2.connect(admin2).freeze(alice.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });

    it("Should not freeze() by former admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT2.grantAdmin(admin2.address);
        await NFT2.revokeAdmin(admin2.address);

        await NFT2.freeze(alice.address);
        const isFreeze = await NFT2.freezeAccounts(alice.address);
        expect(isFreeze).to.equal(true);

        await expect(
            NFT2.connect(admin2).unfreeze(alice.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });


})

describe("NFT2 - Mint check", function () {

    it("Should mint() by minter", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000)
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.grantMinter(minter.address);
        
        await NFT2.connect(minter).mint(minter.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");
        const balance = +ethers.utils.formatEther(await NFT2.balanceOf(minter.address, tokenId));

        expect(balance).to.equal(amountToMint);
    });

    it("Should mintBatch() by minter", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToMints = [];
        let amountToMints_c = [];
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000);
            tokenIds.push(tokenId);
            amountToMints.push(amountToMint);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));
        }

        await NFT2.grantMinter(minter.address);
        
        await NFT2.connect(minter).mintBatch(minter.address, tokenIds, amountToMints_c, "0x");

        for(let index=0; index<numToTrans; index++){
            const tokenId = tokenIds[index];
            const amountToMint = amountToMints[index];
            const balance = +ethers.utils.formatEther(await NFT2.balanceOf(minter.address, tokenId));

            expect(balance).to.equal(amountToMint);
        }
    });



    it("Should mint() by public when publiclyMintable is true", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000)
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.setPubliclyMintable(true);

        await NFT2.connect(alice).mint(alice.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");
        const balance = +ethers.utils.formatEther(await NFT2.balanceOf(alice.address, tokenId));

        expect(balance).to.equal(amountToMint);
    });

    it("Should mintBatch() by public when publiclyMintable is true", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToMints = [];
        let amountToMints_c = [];
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000);
            tokenIds.push(tokenId);
            amountToMints.push(amountToMint);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));
        }

        await NFT2.setPubliclyMintable(true);
        
        await NFT2.connect(alice).mintBatch(alice.address, tokenIds, amountToMints_c, "0x");

        for(let index=0; index<numToTrans; index++){
            const tokenId = tokenIds[index];
            const amountToMint = amountToMints[index];
            const balance = +ethers.utils.formatEther(await NFT2.balanceOf(alice.address, tokenId));

            expect(balance).to.equal(amountToMint);
        }
    });


    it("Should setTokenURI() by admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.setTokenURI(tokenId, URI2);
        const tokenURI = await NFT2.uri(tokenId);

        expect(tokenURI).to.equal(URI2);
    });


    it("Should NOT mint() by former minter", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000)
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.grantMinter(minter.address);

        await NFT2.connect(minter).mint(minter.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        await NFT2.revokeMinter(minter.address);

        await expect(
            NFT2.connect(minter).mint(minter.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x")
        ).to.be.revertedWith('This NFT is not publicly mintable');

    });

    it("Should NOT mintBatch() by former minter", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToMints = [];
        let amountToMints_c = [];
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000);
            tokenIds.push(tokenId);
            amountToMints.push(amountToMint);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));
        }


        await NFT2.grantMinter(minter.address);

        await NFT2.connect(minter).mintBatch(minter.address, tokenIds, amountToMints_c, "0x");

        await NFT2.revokeMinter(minter.address);

        await expect(
            NFT2.connect(minter).mintBatch(minter.address, tokenIds, amountToMints_c, "0x")
        ).to.be.revertedWith('This NFT is not publicly mintable');

    });


    it("Should NOT mint() by burner", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000)
        const tokenId = Math.floor(Math.random()*1000000);
        
        await NFT2.grantBurner(burner.address);

        await expect(
            NFT2.connect(burner).mint(minter.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x")
        ).to.be.revertedWith('This NFT is not publicly mintable');
    });

    it("Should NOT mintBatch() by burner", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToMints = [];
        let amountToMints_c = [];
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000);
            tokenIds.push(tokenId);
            amountToMints.push(amountToMint);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));
        }

        await NFT2.grantBurner(burner.address);

        await expect(
            NFT2.connect(burner).mintBatch(burner.address, tokenIds, amountToMints_c, "0x")
        ).to.be.revertedWith('This NFT is not publicly mintable');

    });

    it("Should NOT mint() by public when publiclyMintable is false", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000)
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.setPubliclyMintable(false);

        await expect(
            NFT2.connect(alice).mint(alice.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x")
        ).to.be.revertedWith('This NFT is not publicly mintable');
    });

    it("Should NOT mintBatch() by public when publiclyMintable is false", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToMints = [];
        let amountToMints_c = [];
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000);
            tokenIds.push(tokenId);
            amountToMints.push(amountToMint);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));
        }

        await expect(
            NFT2.connect(alice).mintBatch(alice.address, tokenIds, amountToMints_c, "0x")
        ).to.be.revertedWith('This NFT is not publicly mintable');

    });

    it("Should NOT mint() by public after publiclyMintable has set back from true to false", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();


        const amountToMint = Math.floor(Math.random()*1000000)
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.setPubliclyMintable(true);

        await NFT2.connect(alice).mint(alice.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x")

        await NFT2.setPubliclyMintable(false);

        await expect(
            NFT2.connect(alice).mint(alice.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x")
        ).to.be.revertedWith('This NFT is not publicly mintable');

    });

    it("Should NOT mintBatch() by public when publiclyMintable is false", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToMints = [];
        let amountToMints_c = [];
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000);
            tokenIds.push(tokenId);
            amountToMints.push(amountToMint);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));
        }

        await NFT2.setPubliclyMintable(true);

        await NFT2.connect(alice).mintBatch(alice.address, tokenIds, amountToMints_c, "0x");

        await NFT2.setPubliclyMintable(false);

        await expect(
            NFT2.connect(alice).mintBatch(alice.address, tokenIds, amountToMints_c, "0x")
        ).to.be.revertedWith('This NFT is not publicly mintable');

    });


    it("Should NOT setTokenURI() by non-admin", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const tokenId = Math.floor(Math.random()*1000000);

        await expect(
            NFT2.connect(alice).setTokenURI(tokenId, URI2)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });

});

describe("NFT2 - Transfer check", function () {

    it("Should safeTransfer() by owner", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000)+1000000;
        const amountToTransfer = Math.floor(Math.random()*1000000);
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.mint(alice.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        await NFT2.connect(alice).safeTransfer(bob.address, tokenId, ethers.utils.parseEther(amountToTransfer.toString()));

        const balance = +ethers.utils.formatEther(await NFT2.balanceOf(alice.address, tokenId));
        const balance2 = +ethers.utils.formatEther(await NFT2.balanceOf(bob.address, tokenId));

        expect(balance).to.equal(amountToMint - amountToTransfer);
        expect(balance2).to.equal(amountToTransfer);
    });

    it("Should safeBatchTransfer() by owner", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        
        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToTransfers = [];
        let amountToTransfers_c = [];
        let amountToMints = [];
        let amountToMints_c = [];
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToTransfer = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000)+1000000;

            tokenIds.push(tokenId);
            amountToTransfers.push(amountToTransfer);
            amountToTransfers_c.push(ethers.utils.parseEther(amountToTransfer.toString()));
            amountToMints.push(amountToMint);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));
        }

        await NFT2.mintBatch(alice.address, tokenIds, amountToMints_c, "0x");

        await NFT2.connect(alice).safeBatchTransfer(bob.address, tokenIds, amountToTransfers_c);


        for(let index=0; index<numToTrans; index++){
            const tokenId = tokenIds[index];
            const amountToTransfer = amountToTransfers[index];
            const amountToMint = amountToMints[index];

            const balance = +ethers.utils.formatEther(await NFT2.balanceOf(alice.address, tokenId));
            const balance2 = +ethers.utils.formatEther(await NFT2.balanceOf(bob.address, tokenId));

            expect(balance).to.equal(amountToMint - amountToTransfer);
            expect(balance2).to.equal(amountToTransfer);
        }
        
    });

    /*
    it("Should safeTransferFrom() by owner", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000)+1000000;
        const amountToTransfer = Math.floor(Math.random()*1000000);
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.mint(alice.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        await NFT2.connect(alice)['safeTransferFrom(address,address,uint256,uint256,bytes)'](alice.address, bob.address, tokenId, ethers.utils.parseEther(amountToTransfer.toString()), "0x");


        const balance = +ethers.utils.formatEther(await NFT2.balanceOf(alice.address, tokenId));
        const balance2 = +ethers.utils.formatEther(await NFT2.balanceOf(bob.address, tokenId));


        expect(balance).to.equal(amountToMint - amountToTransfer);
        expect(balance2).to.equal(amountToTransfer);
    });
    */

    it("Should safeBatchTransferFrom() by owner", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        
        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToTransfers = [];
        let amountToTransfers_c = [];
        let amountToMints = [];
        let amountToMints_c = [];
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToTransfer = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000)+1000000;

            tokenIds.push(tokenId);
            amountToTransfers.push(amountToTransfer);
            amountToTransfers_c.push(ethers.utils.parseEther(amountToTransfer.toString()));
            amountToMints.push(amountToMint);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));

        }

        await NFT2.mintBatch(alice.address, tokenIds, amountToMints_c, "0x");

        await NFT2.connect(alice).safeBatchTransferFrom(alice.address, bob.address, tokenIds, amountToTransfers_c, "0x");


        for(let index=0; index<numToTrans; index++){
            const tokenId = tokenIds[index];
            const amountToTransfer = amountToTransfers[index];
            const amountToMint = amountToMints[index];

            const balance = +ethers.utils.formatEther(await NFT2.balanceOf(alice.address, tokenId));
            const balance2 = +ethers.utils.formatEther(await NFT2.balanceOf(bob.address, tokenId));

            expect(balance).to.equal(amountToMint - amountToTransfer);
            expect(balance2).to.equal(amountToTransfer);
        }
        
    });

    /*
    it("Should safeTransferFrom() by approved address", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000)+1000000;
        const amountToTransfer = Math.floor(Math.random()*1000000);
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.mint(admin.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        await NFT2.setApprovalForAll(alice.address, true);

        await NFT2.connect(alice)['safeTransferFrom(address,address,uint256,uint256,bytes)'](admin.address, bob.address, tokenId, ethers.utils.parseEther(amountToTransfer.toString()), "0x");

        const balance = +ethers.utils.formatEther(await NFT2.balanceOf(admin.address, tokenId));
        const balance2 = +ethers.utils.formatEther(await NFT2.balanceOf(bob.address, tokenId));

        expect(balance).to.equal(amountToMint - amountToTransfer);
        expect(balance2).to.equal(amountToTransfer);
    });
    */

    it("Should safeBatchTransferFrom() by approved address", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        
        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToTransfers = [];
        let amountToTransfers_c = [];
        let amountToMints = [];
        let amountToMints_c = [];
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToTransfer = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000)+1000000;

            tokenIds.push(tokenId);
            amountToTransfers.push(amountToTransfer);
            amountToTransfers_c.push(ethers.utils.parseEther(amountToTransfer.toString()));
            amountToMints.push(amountToMint);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));

        }
        
        

        await NFT2.mintBatch(alice.address, tokenIds, amountToMints_c, "0x");

        await NFT2.connect(alice).setApprovalForAll(bob.address, true);

        await NFT2.connect(bob).safeBatchTransferFrom(alice.address, bob.address, tokenIds, amountToTransfers_c, "0x");


        for(let index=0; index<numToTrans; index++){
            const tokenId = tokenIds[index];
            const amountToTransfer = amountToTransfers[index];
            const amountToMint = amountToMints[index];

            const balance = +ethers.utils.formatEther(await NFT2.balanceOf(alice.address, tokenId));
            const balance2 = +ethers.utils.formatEther(await NFT2.balanceOf(bob.address, tokenId));

            expect(balance).to.equal(amountToMint - amountToTransfer);
            expect(balance2).to.equal(amountToTransfer);
        }
        
    });
    
    /*
    it("Should NOT safeTransferFrom() by non-owner", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000)+1000000;
        const amountToTransfer = Math.floor(Math.random()*1000000);
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.mint(admin.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        
        await expect(
            NFT2.connect(alice).safeTransferFrom(admin.address, bob.address, tokenId, ethers.utils.parseEther(amountToTransfer.toString()), "0x")
        ).to.be.revertedWithCustomError(NFT2, 'ERC1155MissingApprovalForAll');
    });
    */
    it("Should NOT safeBatchTransferFrom() by non-owner", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        
        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToTransfers = [];
        let amountToTransfers_c = [];
        let amountToMints = [];
        let amountToMints_c = [];
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToTransfer = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000)+1000000;

            tokenIds.push(tokenId);
            amountToTransfers.push(amountToTransfer);
            amountToTransfers_c.push(ethers.utils.parseEther(amountToTransfer.toString()));
            amountToMints.push(amountToMint);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));

        }
        
        await NFT2.mintBatch(alice.address, tokenIds, amountToMints_c, "0x");


        await expect(
            NFT2.connect(bob).safeBatchTransferFrom(alice.address, bob.address, tokenIds, amountToTransfers_c, "0x")
        ).to.be.revertedWithCustomError(NFT2, 'ERC1155MissingApprovalForAll');

        
    });

    it("Should NOT safeTransfer() to not-safe address", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000)+1000000;
        const amountToTransfer = Math.floor(Math.random()*1000000);
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.mint(alice.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        await expect(
            NFT2.connect(alice).safeTransfer(NFT2.address, tokenId, ethers.utils.parseEther(amountToTransfer.toString()))
        ).to.be.revertedWithCustomError(NFT2, 'ERC1155InvalidReceiver');
    });

    it("Should NOT safeBatchTransfer() to not-safe address", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        
        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToTransfers = [];
        let amountToTransfers_c = [];
        let amountToMints = [];
        let amountToMints_c = [];
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToTransfer = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000)+1000000;

            tokenIds.push(tokenId);
            amountToTransfers.push(amountToTransfer);
            amountToTransfers_c.push(ethers.utils.parseEther(amountToTransfer.toString()));
            amountToMints.push(amountToMint);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));
        }

        await NFT2.mintBatch(alice.address, tokenIds, amountToMints_c, "0x");

        await expect(
            NFT2.connect(alice).safeBatchTransfer(NFT2.address, tokenIds, amountToTransfers_c)
        ).to.be.revertedWithCustomError(NFT2, 'ERC1155InvalidReceiver');
        
    });

    it("Should NOT safeTransfer() by non-owner", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000)+1000000;
        const amountToTransfer = Math.floor(Math.random()*1000000);
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.mint(alice.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        await expect(
            NFT2.safeTransfer(bob.address, tokenId, ethers.utils.parseEther(amountToTransfer.toString()))
        ).to.be.revertedWithCustomError(NFT2, 'ERC1155InsufficientBalance');
    });

    it("Should NOT safeBatchTransfer() by non-owner", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        
        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToTransfers = [];
        let amountToTransfers_c = [];
        let amountToMints = [];
        let amountToMints_c = [];
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToTransfer = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000)+1000000;

            tokenIds.push(tokenId);
            amountToTransfers.push(amountToTransfer);
            amountToTransfers_c.push(ethers.utils.parseEther(amountToTransfer.toString()));
            amountToMints.push(amountToMint);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));
        }

        await NFT2.mintBatch(alice.address, tokenIds, amountToMints_c, "0x");

        await expect(
            NFT2.connect(bob).safeBatchTransfer(NFT2.address, tokenIds, amountToTransfers_c)
        ).to.be.revertedWithCustomError(NFT2, 'ERC1155InsufficientBalance');
        
    });

    /*
    it("Should NOT safeTransferFrom() to not-safe address", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000)+1000000;
        const amountToTransfer = Math.floor(Math.random()*1000000);
        const tokenId = Math.floor(Math.random()*1000000);


        await NFT2.mint(alice.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        await expect(
            NFT2.connect(alice).safeTransferFrom(alice.address, NFT2.address, tokenId, ethers.utils.parseEther(amountToTransfer.toString()), "0x")
        ).to.be.revertedWithCustomError(NFT2, 'ERC1155InvalidReceiver');
    });
    */

    it("Should NOT safeBatchTransferFrom() to not-safe address", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        
        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToTransfers = [];
        let amountToTransfers_c = [];
        let amountToMints = [];
        let amountToMints_c = [];
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToTransfer = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000)+1000000;

            tokenIds.push(tokenId);
            amountToTransfers.push(amountToTransfer);
            amountToTransfers_c.push(ethers.utils.parseEther(amountToTransfer.toString()));
            amountToMints.push(amountToMint);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));
        }
        
        await NFT2.mintBatch(alice.address, tokenIds, amountToMints_c, "0x");


        await expect(
            NFT2.connect(alice).safeBatchTransferFrom(alice.address, NFT2.address, tokenIds, amountToTransfers_c, "0x")
        ).to.be.revertedWithCustomError(NFT2, 'ERC1155InvalidReceiver');
    });

    /*
    it("Should NOT safeTransferFrom() by non-approved address", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000)+1000000;
        const amountToTransfer = Math.floor(Math.random()*1000000);
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.mint(admin.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        
        await expect(
            NFT2.connect(alice).safeTransferFrom(admin.address, bob.address, tokenId, ethers.utils.parseEther(amountToTransfer.toString()), "0x")
        ).to.be.revertedWithCustomError(NFT2, 'ERC1155MissingApprovalForAll');
    });
    */

    it("Should NOT safeBatchTransferFrom() to non-approved address", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        
        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToTransfers = [];
        let amountToTransfers_c = [];
        let amountToMints = [];
        let amountToMints_c = [];
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToTransfer = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000)+1000000;

            tokenIds.push(tokenId);
            amountToTransfers.push(amountToTransfer);
            amountToTransfers_c.push(ethers.utils.parseEther(amountToTransfer.toString()));
            amountToMints.push(amountToMint);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));
        }
        
        await NFT2.mintBatch(alice.address, tokenIds, amountToMints_c, "0x");


        await expect(
            NFT2.connect(bob).safeBatchTransferFrom(alice.address, NFT2.address, tokenIds, amountToTransfers_c, "0x")
        ).to.be.revertedWithCustomError(NFT2, 'ERC1155MissingApprovalForAll');
    });


    it("Should NOT safeTransfer() by freeze address", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000)+1000000;
        const amountToTransfer = Math.floor(Math.random()*1000000);
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.mint(alice.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        await NFT2.freeze(alice.address);

        await expect(
            NFT2.connect(alice).safeTransfer(bob.address, tokenId, ethers.utils.parseEther(amountToTransfer.toString()))
        ).to.be.revertedWith('Owner has been frozen');
    });

    it("Should NOT safeBatchTransfer() by freeze address", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        
        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToTransfers = [];
        let amountToTransfers_c = [];
        let amountToMints = [];
        let amountToMints_c = [];

        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToTransfer = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000)+1000000;

            tokenIds.push(tokenId);
            amountToTransfers.push(amountToTransfer);
            amountToTransfers_c.push(ethers.utils.parseEther(amountToTransfer.toString()));
            amountToMints.push(amountToMint);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));
        }

        await NFT2.mintBatch(alice.address, tokenIds, amountToMints_c, "0x");

        await NFT2.freeze(alice.address);

        await expect(
            NFT2.connect(alice).safeBatchTransfer(bob.address, tokenIds, amountToTransfers_c)
        ).to.be.revertedWith('Owner has been frozen');
        
    });

    it("Should NOT safeBatchTransferFrom() by freeze address", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        
        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToTransfers = [];
        let amountToTransfers_c = [];
        let amountToMints = [];
        let amountToMints_c = [];
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToTransfer = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000)+1000000;

            tokenIds.push(tokenId);
            amountToTransfers.push(amountToTransfer);
            amountToTransfers_c.push(ethers.utils.parseEther(amountToTransfer.toString()));
            amountToMints.push(amountToMint);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));
        }
        
        await NFT2.mintBatch(alice.address, tokenIds, amountToMints_c, "0x");

        await NFT2.freeze(alice.address);

        await expect(
            NFT2.connect(alice).safeBatchTransferFrom(alice.address, NFT2.address, tokenIds, amountToTransfers_c, "0x")
        ).to.be.revertedWith('Owner has been frozen');
    });



    it("Should safeTransfer() by unfreeze address", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000)+1000000;
        const amountToTransfer = Math.floor(Math.random()*1000000);
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.mint(alice.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        await NFT2.freeze(alice.address);
        await NFT2.unfreeze(alice.address);

      
        await NFT2.connect(alice).safeTransfer(bob.address, tokenId, ethers.utils.parseEther(amountToTransfer.toString()));

        const balance = +ethers.utils.formatEther(await NFT2.balanceOf(alice.address, tokenId));
        const balance2 = +ethers.utils.formatEther(await NFT2.balanceOf(bob.address, tokenId));

        expect(balance).to.equal(amountToMint - amountToTransfer);
        expect(balance2).to.equal(amountToTransfer);

    });

    it("Should safeBatchTransfer() by unfreeze address", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        
        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToTransfers = [];
        let amountToTransfers_c = [];
        let amountToMints = [];
        let amountToMints_c = [];
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToTransfer = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000)+1000000;

            tokenIds.push(tokenId);
            amountToTransfers.push(amountToTransfer);
            amountToTransfers_c.push(ethers.utils.parseEther(amountToTransfer.toString()));
            amountToMints.push(amountToMint);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));
        }

        await NFT2.mintBatch(alice.address, tokenIds, amountToMints_c, "0x");

        await NFT2.freeze(alice.address);
        await NFT2.unfreeze(alice.address);

        await NFT2.connect(alice).safeBatchTransfer(bob.address, tokenIds, amountToTransfers_c);


        for(let index=0; index<numToTrans; index++){
            const tokenId = tokenIds[index];
            const amountToTransfer = amountToTransfers[index];
            const amountToMint = amountToMints[index];

            const balance = +ethers.utils.formatEther(await NFT2.balanceOf(alice.address, tokenId));
            const balance2 = +ethers.utils.formatEther(await NFT2.balanceOf(bob.address, tokenId));

            expect(balance).to.equal(amountToMint - amountToTransfer);
            expect(balance2).to.equal(amountToTransfer);
        }
        
    });


    

    /*
    it("Should safeTransferFrom() by unfreeze address", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000)+1000000;
        const amountToTransfer = Math.floor(Math.random()*1000000);
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.mint(alice.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        await NFT2.freeze(alice.address);
        await NFT2.unfreeze(alice.address);

        await NFT2.connect(alice).safeTransferFrom(alice.address, bob.address, tokenId, ethers.utils.parseEther(amountToTransfer.toString()), "0x");

        const balance = +ethers.utils.formatEther(await NFT2.balanceOf(alice.address, tokenId));
        const balance2 = +ethers.utils.formatEther(await NFT2.balanceOf(bob.address, tokenId));

        expect(balance).to.equal(amountToMint - amountToTransfer);
        expect(balance2).to.equal(amountToTransfer);

    });
    */

    it("Should safeBatchTransferFrom() by unfreeze address", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        
        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToTransfers = [];
        let amountToTransfers_c = [];
        let amountToMints = [];
        let amountToMints_c = [];
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToTransfer = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000)+1000000;

            tokenIds.push(tokenId);
            amountToTransfers.push(amountToTransfer);
            amountToTransfers_c.push(ethers.utils.parseEther(amountToTransfer.toString()));
            amountToMints.push(amountToMint);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));

        }

        await NFT2.mintBatch(alice.address, tokenIds, amountToMints_c, "0x");

        await NFT2.freeze(alice.address);
        await NFT2.unfreeze(alice.address);
        
        await NFT2.connect(alice).safeBatchTransferFrom(alice.address, bob.address, tokenIds, amountToTransfers_c, "0x");


        for(let index=0; index<numToTrans; index++){
            const tokenId = tokenIds[index];
            const amountToTransfer = amountToTransfers[index];
            const amountToMint = amountToMints[index];

            const balance = +ethers.utils.formatEther(await NFT2.balanceOf(alice.address, tokenId));
            const balance2 = +ethers.utils.formatEther(await NFT2.balanceOf(bob.address, tokenId));

            expect(balance).to.equal(amountToMint - amountToTransfer);
            expect(balance2).to.equal(amountToTransfer);
        }
        
    });

    /*
    it("Should NOT safeTransferFrom() from freeze address by not freeze approved address", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000)+1000000;
        const amountToTransfer = Math.floor(Math.random()*1000000);
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.mint(alice.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        await NFT2.connect(alice).setApprovalForAll(bob.address, true);

        await NFT2.freeze(alice.address);

        await expect(
            NFT2.connect(bob).safeTransferFrom(alice.address, bob.address, tokenId, ethers.utils.parseEther(amountToTransfer.toString()), "0x")
        ).to.be.revertedWith('Owner has been frozen');
    });
    */

    it("Should NOT safeBatchTransferFrom() from freeze address by not freeze approved address", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        
        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToTransfers = [];
        let amountToTransfers_c = [];
        let amountToMints = [];
        let amountToMints_c = [];
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToTransfer = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000)+1000000;

            tokenIds.push(tokenId);
            amountToTransfers.push(amountToTransfer);
            amountToTransfers_c.push(ethers.utils.parseEther(amountToTransfer.toString()));
            amountToMints.push(amountToMint);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));
        }
        
        await NFT2.mintBatch(alice.address, tokenIds, amountToMints_c, "0x");

        await NFT2.connect(alice).setApprovalForAll(bob.address, true);

        await NFT2.freeze(alice.address);

        await expect(
            NFT2.connect(bob).safeBatchTransferFrom(alice.address, NFT2.address, tokenIds, amountToTransfers_c, "0x")
        ).to.be.revertedWith('Owner has been frozen');
    });

    /*
    it("Should NOT safeTransferFrom() from not freeze address by approve freeze address", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000)+1000000;
        const amountToTransfer = Math.floor(Math.random()*1000000);
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.mint(alice.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        await NFT2.connect(alice).setApprovalForAll(bob.address, true);

        await NFT2.freeze(bob.address);

        await expect(
            NFT2.connect(bob).safeTransferFrom(alice.address, bob.address, tokenId, ethers.utils.parseEther(amountToTransfer.toString()), "0x")
        ).to.be.revertedWith('Caller has been frozen');
    });
    */

    it("Should NOT safeBatchTransferFrom() from not freeze address by approve freeze address", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        
        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToTransfers = [];
        let amountToTransfers_c = [];
        let amountToMints = [];
        let amountToMints_c = [];
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToTransfer = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000)+1000000;

            tokenIds.push(tokenId);
            amountToTransfers.push(amountToTransfer);
            amountToTransfers_c.push(ethers.utils.parseEther(amountToTransfer.toString()));
            amountToMints.push(amountToMint);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));
        }
        
        await NFT2.mintBatch(alice.address, tokenIds, amountToMints_c, "0x");

        await NFT2.connect(alice).setApprovalForAll(bob.address, true);

        await NFT2.freeze(bob.address);

        await expect(
            NFT2.connect(bob).safeBatchTransferFrom(alice.address, NFT2.address, tokenIds, amountToTransfers_c, "0x")
        ).to.be.revertedWith('Caller has been frozen');
    });




});


describe("NFT2 - Burn check", function () {

    it("Should burn() by burner", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000)+1000000
        const amountToBurn = Math.floor(Math.random()*1000000)
        const tokenId = Math.floor(Math.random()*1000000);
  
        NFT2.grantBurner(burner.address);

        await NFT2.mint(alice.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        await NFT2.connect(burner).burn(alice.address, tokenId, ethers.utils.parseEther(amountToBurn.toString()));

        const balance = +ethers.utils.formatEther(await NFT2.balanceOf(alice.address, tokenId));

        expect(balance).to.equal(amountToMint-amountToBurn);
    });

    it("Should burnBatch() by burner", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        NFT2.grantBurner(burner.address);

        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToMints = [];
        let amountToMints_c = [];
        let amountToBurns = [];
        let amountToBurns_c = [];
        
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000)+1000000;
            const amountToBurn = Math.floor(Math.random()*1000000);
            tokenIds.push(tokenId);
            amountToMints.push(amountToMint);
            amountToBurns.push(amountToBurn);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));
            amountToBurns_c.push(ethers.utils.parseEther(amountToBurn.toString()));
        }



        await NFT2.mintBatch(alice.address, tokenIds, amountToMints_c, "0x");
        await NFT2.connect(burner).burnBatch(alice.address, tokenIds, amountToBurns_c);

        for(let index=0; index<numToTrans; index++){
            const tokenId = tokenIds[index];
            const amountToBurn = amountToBurns[index];
            const amountToMint = amountToMints[index];
            const balance = +ethers.utils.formatEther(await NFT2.balanceOf(alice.address, tokenId));

            expect(balance).to.equal(amountToMint - amountToBurn);
        }
    });


    it("Should burn() by owner", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000)+1000000
        const amountToBurn = Math.floor(Math.random()*1000000)
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.mint(alice.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        await NFT2.connect(alice).burn(alice.address, tokenId, ethers.utils.parseEther(amountToBurn.toString()));

        const balance = +ethers.utils.formatEther(await NFT2.balanceOf(alice.address, tokenId));

        expect(balance).to.equal(amountToMint-amountToBurn);
    });

    it("Should burnBatch() by owner", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();


        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToMints = [];
        let amountToMints_c = [];
        let amountToBurns = [];
        let amountToBurns_c = [];
        
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000)+1000000;
            const amountToBurn = Math.floor(Math.random()*1000000);
            tokenIds.push(tokenId);
            amountToMints.push(amountToMint);
            amountToBurns.push(amountToBurn);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));
            amountToBurns_c.push(ethers.utils.parseEther(amountToBurn.toString()));
        }



        await NFT2.mintBatch(alice.address, tokenIds, amountToMints_c, "0x");
        await NFT2.connect(alice).burnBatch(alice.address, tokenIds, amountToBurns_c);

        for(let index=0; index<numToTrans; index++){
            const tokenId = tokenIds[index];
            const amountToBurn = amountToBurns[index];
            const amountToMint = amountToMints[index];
            const balance = +ethers.utils.formatEther(await NFT2.balanceOf(alice.address, tokenId));

            expect(balance).to.equal(amountToMint - amountToBurn);
        }
    });


    it("Should burn() by new owner", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000)+1000000
        const amountToBurn = Math.floor(Math.random()*1000000)
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.mint(alice.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        await NFT2.connect(alice).safeTransfer(bob.address, tokenId, ethers.utils.parseEther(amountToMint.toString()));
        await NFT2.connect(bob).burn(bob.address, tokenId, ethers.utils.parseEther(amountToBurn.toString()));

        const balance = +ethers.utils.formatEther(await NFT2.balanceOf(bob.address, tokenId));

        expect(balance).to.equal(amountToMint-amountToBurn);

    });

    it("Should burnBatch() by new owner", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();


        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToMints = [];
        let amountToMints_c = [];
        let amountToBurns = [];
        let amountToBurns_c = [];
        
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000)+1000000;
            const amountToBurn = Math.floor(Math.random()*1000000);
            tokenIds.push(tokenId);
            amountToMints.push(amountToMint);
            amountToBurns.push(amountToBurn);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));
            amountToBurns_c.push(ethers.utils.parseEther(amountToBurn.toString()));
        }



        await NFT2.mintBatch(alice.address, tokenIds, amountToMints_c, "0x");

        await NFT2.connect(alice).safeBatchTransfer(bob.address, tokenIds, amountToMints_c);
        await NFT2.connect(bob).burnBatch(bob.address, tokenIds, amountToBurns_c);

        for(let index=0; index<numToTrans; index++){
            const tokenId = tokenIds[index];
            const amountToBurn = amountToBurns[index];
            const amountToMint = amountToMints[index];
            const balance = +ethers.utils.formatEther(await NFT2.balanceOf(bob.address, tokenId));

            expect(balance).to.equal(amountToMint - amountToBurn);
        }
    });


    it("Should NOT burn() by former-burner", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        NFT2.grantBurner(burner.address);

        const amountToMint = Math.floor(Math.random()*1000000)+1000000
        const amountToBurn = Math.floor(Math.random()*1000000)
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.mint(alice.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        NFT2.revokeBurner(burner.address);


        await expect(
            NFT2.connect(burner).burn(alice.address, tokenId, ethers.utils.parseEther(amountToBurn.toString()))
        ).to.revertedWith('Caller does not own this NFT');
    });

    it("Should NOT burn() of freeze address", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        NFT2.grantBurner(burner.address);

        const amountToMint = Math.floor(Math.random()*1000000)+1000000
        const amountToBurn = Math.floor(Math.random()*1000000)
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.mint(alice.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        await NFT2.freeze(alice.address);

        await expect(
            NFT2.connect(burner).burn(alice.address, tokenId, ethers.utils.parseEther(amountToBurn.toString()))
        ).to.revertedWith('Owner has been frozen');
    });

    it("Should NOT burn() by freeze address", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        NFT2.grantBurner(burner.address);

        const amountToMint = Math.floor(Math.random()*1000000)+1000000
        const amountToBurn = Math.floor(Math.random()*1000000)
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.mint(alice.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        await NFT2.freeze(burner.address);

        await expect(
            NFT2.connect(burner).burn(alice.address, tokenId, ethers.utils.parseEther(amountToBurn.toString()))
        ).to.revertedWith('Caller has been frozen');
    });

    it("Should NOT burnBatch() by former-burner", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        NFT2.grantBurner(burner.address);

        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToMints = [];
        let amountToMints_c = [];
        let amountToBurns = [];
        let amountToBurns_c = [];
        
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000)+1000000;
            const amountToBurn = Math.floor(Math.random()*1000000);
            tokenIds.push(tokenId);
            amountToMints.push(amountToMint);
            amountToBurns.push(amountToBurn);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));
            amountToBurns_c.push(ethers.utils.parseEther(amountToBurn.toString()));
        }

        await NFT2.mintBatch(alice.address, tokenIds, amountToMints_c, "0x");

        NFT2.revokeBurner(burner.address);

        await expect(
            NFT2.connect(burner).burnBatch(alice.address, tokenIds, amountToBurns_c)
        ).to.revertedWith('Caller does not own this NFT');

    });

    it("Should NOT burnBatch() of freeze address", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        NFT2.grantBurner(burner.address);

        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToMints = [];
        let amountToMints_c = [];
        let amountToBurns = [];
        let amountToBurns_c = [];
        
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000)+1000000;
            const amountToBurn = Math.floor(Math.random()*1000000);
            tokenIds.push(tokenId);
            amountToMints.push(amountToMint);
            amountToBurns.push(amountToBurn);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));
            amountToBurns_c.push(ethers.utils.parseEther(amountToBurn.toString()));
        }

        await NFT2.mintBatch(alice.address, tokenIds, amountToMints_c, "0x");

        await NFT2.freeze(alice.address);


        await expect(
            NFT2.connect(burner).burnBatch(alice.address, tokenIds, amountToBurns_c)
        ).to.revertedWith('Owner has been frozen');

    });

    it("Should NOT burnBatch() by freeze address", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        NFT2.grantBurner(burner.address);

        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToMints = [];
        let amountToMints_c = [];
        let amountToBurns = [];
        let amountToBurns_c = [];
        
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000)+1000000;
            const amountToBurn = Math.floor(Math.random()*1000000);
            tokenIds.push(tokenId);
            amountToMints.push(amountToMint);
            amountToBurns.push(amountToBurn);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));
            amountToBurns_c.push(ethers.utils.parseEther(amountToBurn.toString()));
        }

        await NFT2.mintBatch(alice.address, tokenIds, amountToMints_c, "0x");

        await NFT2.freeze(burner.address);


        await expect(
            NFT2.connect(burner).burnBatch(alice.address, tokenIds, amountToBurns_c)
        ).to.revertedWith('Caller has been frozen');

    });

    it("Should NOT burn() by former-owner", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000)+1000000
        const amountToBurn = Math.floor(Math.random()*1000000)
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.mint(alice.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        await NFT2.connect(alice).safeTransfer(bob.address, tokenId, ethers.utils.parseEther(amountToMint.toString()));

        await expect(
            NFT2.connect(alice).burn(bob.address, tokenId, ethers.utils.parseEther(amountToBurn.toString()))
        ).to.revertedWith('Caller does not own this NFT');
    });

    it("Should NOT burnBatch() by former-owner", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToMints = [];
        let amountToMints_c = [];
        let amountToBurns = [];
        let amountToBurns_c = [];
        
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000)+1000000;
            const amountToBurn = Math.floor(Math.random()*1000000);
            tokenIds.push(tokenId);
            amountToMints.push(amountToMint);
            amountToBurns.push(amountToBurn);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));
            amountToBurns_c.push(ethers.utils.parseEther(amountToBurn.toString()));
        }

        await NFT2.mintBatch(alice.address, tokenIds, amountToMints_c, "0x");

        await NFT2.connect(alice).safeBatchTransfer(bob.address, tokenIds, amountToMints_c);

        await expect(
            NFT2.connect(alice).burnBatch(bob.address, tokenIds, amountToBurns_c)
        ).to.revertedWith('Caller does not own this NFT');

    });

    it("Should NOT burn() by non-burner/non-owner", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000)+1000000
        const amountToBurn = Math.floor(Math.random()*1000000)
        const tokenId = Math.floor(Math.random()*1000000);
        
        await NFT2.mint(alice.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        await expect(
            NFT2.connect(bob).burn(alice.address, tokenId, ethers.utils.parseEther(amountToBurn.toString()))
        ).to.revertedWith('Caller does not own this NFT');

    });

    it("Should NOT burnBatch() by non-burner/non-owner", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const numToTrans = Math.floor(Math.random()*9);

        let tokenIds = [];
        let amountToMints = [];
        let amountToMints_c = [];
        let amountToBurns = [];
        let amountToBurns_c = [];
        
        for(let index=0; index<numToTrans; index++){
            const tokenId = Math.floor(Math.random()*1000000);
            const amountToMint = Math.floor(Math.random()*1000000)+1000000;
            const amountToBurn = Math.floor(Math.random()*1000000);
            tokenIds.push(tokenId);
            amountToMints.push(amountToMint);
            amountToBurns.push(amountToBurn);
            amountToMints_c.push(ethers.utils.parseEther(amountToMint.toString()));
            amountToBurns_c.push(ethers.utils.parseEther(amountToBurn.toString()));
        }

        await NFT2.mintBatch(alice.address, tokenIds, amountToMints_c, "0x");

        await expect(
            NFT2.connect(bob).burnBatch(alice.address, tokenIds, amountToBurns_c)
        ).to.revertedWith('Caller does not own this NFT');

    });


});


describe("NFT2 - is SBT", function () {

    it("Should NOT safeTransfer() by owner", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000)+1000000;
        const amountToTransfer = Math.floor(Math.random()*1000000);
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.setToSBT(true);

        await NFT2.mint(alice.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        await expect(
            NFT2.connect(alice).safeTransfer(bob.address, tokenId, ethers.utils.parseEther(amountToTransfer.toString()))
        ).to.revertedWith('This NFT was not permitted to transfer');
    });
    /*
    it("Should NOT safeTransferFrom() by owner", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT2.setToSBT(true);

        const amountToMint = Math.floor(Math.random()*1000000)+1000000;
        const amountToTransfer = Math.floor(Math.random()*1000000);
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.mint(alice.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        await expect(
            NFT2.connect(alice).safeTransferFrom(alice.address, bob.address, tokenId, ethers.utils.parseEther(amountToTransfer.toString()), '0x')
        ).to.revertedWith('This NFT was not permitted to transfer');
    });
    */

    /*
    it("Should NOT safeTransferFrom() by approved address", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT2.setToSBT(true);

        const amountToMint = Math.floor(Math.random()*1000000)+1000000;
        const amountToTransfer = Math.floor(Math.random()*1000000);
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.mint(admin.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        await NFT2.setApprovalForAll(alice.address, true);

        await expect( 
            NFT2.connect(alice).safeTransferFrom(alice.address, bob.address, tokenId, ethers.utils.parseEther(amountToTransfer.toString()))
        ).to.revertedWith('This NFT was not permitted to transfer');
    });
    */

    it("Should NOT burn() by burner", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT2.setToSBT(true);

        const amountToMint = Math.floor(Math.random()*1000000)+1000000;
        const amountToBurn = Math.floor(Math.random()*1000000);
        const tokenId = Math.floor(Math.random()*1000000);

        NFT2.grantBurner(burner.address);

        await NFT2.mint(alice.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        await expect(
            NFT2.connect(burner).burn(alice.address, tokenId, ethers.utils.parseEther(amountToBurn.toString()))
        ).to.revertedWith('This NFT was not permitted to burn');
    });

    it("Should NOT burn() by owner", async function () {
        const { NFT2, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT2.setToSBT(true);

        const amountToMint = Math.floor(Math.random()*1000000)+1000000;
        const amountToBurn = Math.floor(Math.random()*1000000);
        const tokenId = Math.floor(Math.random()*1000000);

        await NFT2.mint(alice.address, tokenId, ethers.utils.parseEther(amountToMint.toString()), "0x");

        await expect(
            NFT2.connect(alice).burn(alice.address, tokenId, ethers.utils.parseEther(amountToBurn.toString()))
        ).to.revertedWith('This NFT was not permitted to burn');
    });

})
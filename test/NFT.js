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
    const Factory = await ethers.getContractFactory("NFT");
    const [admin, minter, burner, admin2, alice, bob] = await ethers.getSigners();

    const NFT = await Factory.deploy();

    await NFT.deployed();

    return { NFT, admin, minter, burner, admin2, alice, bob };
}

describe("NFT - ACL check", function () {

    it("Should grantAdmin() by admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const DEFAULT_ADMIN_ROLE = await NFT.DEFAULT_ADMIN_ROLE();

        await NFT.grantAdmin(admin2.address);
        const role = await NFT.hasRole(DEFAULT_ADMIN_ROLE, admin2.address);
        expect(role).to.equal(true);
    });

    it("Should revokeAdmin() by admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const DEFAULT_ADMIN_ROLE = await NFT.DEFAULT_ADMIN_ROLE();

        await NFT.grantAdmin(admin2.address);
        const role = await NFT.hasRole(DEFAULT_ADMIN_ROLE, admin2.address);
        expect(role).to.equal(true);

        await NFT.revokeAdmin(admin2.address);
        const role2 = await NFT.hasRole(DEFAULT_ADMIN_ROLE, admin2.address);

        expect(role2).to.equal(false);

    });
    
    it("Should grantMinter() by admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const MINTER_ROLE = await NFT.MINTER_ROLE();

        await NFT.grantMinter(minter.address);
        const role = await NFT.hasRole(MINTER_ROLE, minter.address);
        expect(role).to.equal(true);
    });

    it("Should revokeMinter() by admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const MINTER_ROLE = await NFT.MINTER_ROLE();

        await NFT.grantMinter(minter.address);
        const role = await NFT.hasRole(MINTER_ROLE, minter.address);
        expect(role).to.equal(true);

        await NFT.revokeMinter(minter.address);
        const role2 = await NFT.hasRole(MINTER_ROLE, minter.address);
        expect(role2).to.equal(false);

    });

    it("Should grantBurner() by admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const BURNER_ROLE = await NFT.BURNER_ROLE();

        await NFT.grantBurner(burner.address);
        const role = await NFT.hasRole(BURNER_ROLE, burner.address);
        expect(role).to.equal(true);
    });

    it("Should revokeBurner() by admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const BURNER_ROLE = await NFT.BURNER_ROLE();

        await NFT.grantBurner(burner.address);
        const role = await NFT.hasRole(BURNER_ROLE, burner.address);
        expect(role).to.equal(true);

        await NFT.revokeBurner(burner.address);
        const role2 = await NFT.hasRole(BURNER_ROLE, burner.address);
        expect(role2).to.equal(false);

    });


    it("Should NOT grantAdmin() by non-admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await expect(
            NFT.connect(alice).grantAdmin(admin2.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });

    it("Should NOT revokeAdmin() by non-admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await expect(
            NFT.connect(alice).revokeAdmin(admin2.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });


    it("Should NOT grantMinter() by non-admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await expect(
            NFT.connect(alice).grantMinter(minter.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });

    it("Should NOT revokeMinter() by non-admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await expect(
            NFT.connect(alice).revokeMinter(minter.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });

    it("Should NOT grantBurner() non-admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await expect(
            NFT.connect(alice).grantBurner(burner.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });

    it("Should NOT revokeBurner() non-admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await expect(
            NFT.connect(alice).revokeBurner(burner.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });
});

describe("NFT - publiclyMintable check", function () {
    it("Should publiclyMintable set to false by default", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const publiclyMintable = await NFT.isPubliclyMintable();
        expect(publiclyMintable).to.equal(false);
    });

    it("Should setPubliclyMintable() to true by admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await NFT.setPubliclyMintable(true);
        const publiclyMintable = await NFT.isPubliclyMintable();
        expect(publiclyMintable).to.equal(true);
    });

    it("Should setPubliclyMintable() to false by admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await NFT.setPubliclyMintable(false);

        const publiclyMintable = await NFT.isPubliclyMintable();
        expect(publiclyMintable).to.equal(false);
    });

    it("Should setPubliclyMintable() to true by new-admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT.grantAdmin(admin2.address);

        await NFT.connect(admin2).setPubliclyMintable(true);

        const publiclyMintable = await NFT.isPubliclyMintable();
        expect(publiclyMintable).to.equal(true);
    });

    it("Should NOT setPubliclyMintable() to true by non-admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await expect(
            NFT.connect(alice).setPubliclyMintable(true)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });

    it("Should NOT setPubliclyMintable() by former-admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT.grantAdmin(admin2.address);
        await NFT.connect(admin2).revokeAdmin(admin.address);

        await expect(
            NFT.setPubliclyMintable(true)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });
});

describe("NFT - freeze check", function () {
    it("Should freezeAccounts set to false by default", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const isFreeze = await NFT.freezeAccounts(admin.address);
        expect(isFreeze).to.equal(false);
    });

    it("Should freeze() by admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT.freeze(alice.address);
        const isFreeze = await NFT.freezeAccounts(alice.address);
        expect(isFreeze).to.equal(true);
    });

    it("Should unfreeze() by admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT.freeze(alice.address);
        const isFreeze = await NFT.freezeAccounts(alice.address);
        expect(isFreeze).to.equal(true);

        await NFT.unfreeze(alice.address);
        const isFreeze2 = await NFT.freezeAccounts(alice.address);
        expect(isFreeze2).to.equal(false);
    });

    it("Should freeze() by new admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT.grantAdmin(admin2.address);

        await NFT.connect(admin2).freeze(alice.address);
        const isFreeze = await NFT.freezeAccounts(alice.address);
        expect(isFreeze).to.equal(true);
    });

    it("Should unfreeze() by new admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT.grantAdmin(admin2.address);

        await NFT.connect(admin2).freeze(alice.address);
        const isFreeze = await NFT.freezeAccounts(alice.address);
        expect(isFreeze).to.equal(true);

        await NFT.connect(admin2).unfreeze(alice.address);
        const isFreeze2 = await NFT.freezeAccounts(alice.address);
        expect(isFreeze2).to.equal(false);

    });

    it("Should not freeze() by non-admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await expect(
            NFT.connect(bob).freeze(alice.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');

    });

    it("Should not unfreeze() by non-admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await NFT.freeze(alice.address);
        const isFreeze = await NFT.freezeAccounts(alice.address);
        expect(isFreeze).to.equal(true);

        await expect(
            NFT.connect(bob).unfreeze(alice.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');

    });

    it("Should not freeze() by former admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT.grantAdmin(admin2.address);
        await NFT.revokeAdmin(admin2.address);

        await expect(
            NFT.connect(admin2).freeze(alice.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });

    it("Should not freeze() by former admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT.grantAdmin(admin2.address);
        await NFT.revokeAdmin(admin2.address);

        await NFT.freeze(alice.address);
        const isFreeze = await NFT.freezeAccounts(alice.address);
        expect(isFreeze).to.equal(true);

        await expect(
            NFT.connect(admin2).unfreeze(alice.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });


})

describe("NFT - Mint check", function () {

    it("Should safeMint() by minter", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await NFT.grantMinter(minter.address);

        const trx = await NFT.connect(minter).safeMint(minter.address, URI);
        const owner = await NFT.ownerOf(trx.value.toString());

        expect(owner).to.equal(minter.address);
    });

    it("Should safeMint() by public when publiclyMintable is true", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await NFT.setPubliclyMintable(true);

        const trx = await NFT.connect(alice).safeMint(alice.address, URI);
        const owner = await NFT.ownerOf(trx.value.toString());

        expect(owner).to.equal(alice.address);
    });

    it("Should setTokenURI() by admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const trx = await NFT.safeMint(admin.address, URI);
        const tokenId = trx.value.toString();

        await NFT.setTokenURI(tokenId, URI2);
        const tokenURI = await NFT.tokenURI(tokenId);

        expect(tokenURI).to.equal(URI2);
    });

    it("Should correctly set tokenURI upon mint", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const trx = await NFT.safeMint(admin.address, URI);
        const tokenURI = await NFT.tokenURI(trx.value.toString());

        expect(tokenURI).to.equal(URI);
    });

    it("Should totalSupply() correctly", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random() * 100) % 10 + 10;

        for (let i = 0; i < amountToMint; i++) {
            await NFT.safeMint(admin.address, URI);
        }

        const supply = +(await NFT.totalSupply()).toString();
        expect(supply).to.equal(amountToMint);
    });

    it("Should NOT safeMint() by former minter", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await NFT.grantMinter(minter.address);

        await NFT.connect(minter).safeMint(minter.address, URI);

        await NFT.revokeMinter(minter.address);

        await expect(
            NFT.connect(minter).safeMint(minter.address, URI)
        ).to.be.revertedWith('This NFT is not publicly mintable');

    });

    it("Should NOT safeMint() by burner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await NFT.grantBurner(burner.address);

        await expect(
            NFT.connect(burner).safeMint(minter.address, URI)
        ).to.be.revertedWith('This NFT is not publicly mintable');
    });

    it("Should NOT safeMint() by public when publiclyMintable is false", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await NFT.setPubliclyMintable(false);

        await expect(
            NFT.connect(alice).safeMint(alice.address, URI)
        ).to.be.revertedWith('This NFT is not publicly mintable');
    });

    it("Should NOT safeMint() by public after publiclyMintable has set back from true to false", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await NFT.setPubliclyMintable(true);

        await NFT.connect(alice).safeMint(alice.address, URI);

        await NFT.setPubliclyMintable(false);

        await expect(
            NFT.connect(alice).safeMint(alice.address, URI)
        ).to.be.revertedWith('This NFT is not publicly mintable');

    });

    it("Should NOT setTokenURI() by non-admin", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const trx = await NFT.safeMint(admin.address, URI);
        const tokenId = trx.value.toString();

        await expect(
            NFT.connect(alice).setTokenURI(tokenId, URI2)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });

});

describe("NFT - Transfer check", function () {

    it("Should transfer() by owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await NFT.connect(alice).transfer(bob.address, tokenId);
        const owner = await NFT.ownerOf(tokenId);
        expect(owner).to.equal(bob.address);
    });

    it("Should transferFrom() by owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await NFT.connect(alice).transferFrom(alice.address, bob.address, tokenId);
        const owner = await NFT.ownerOf(tokenId);
        expect(owner).to.equal(bob.address);
    });

    it("Should safeTransfer() by owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await NFT.connect(alice)['safeTransfer(address,uint256)'](bob.address, tokenId);
        const owner = await NFT.ownerOf(tokenId);
        expect(owner).to.equal(bob.address);
    });

    it("Should safeTransferFrom() by owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await NFT.connect(alice)['safeTransferFrom(address,address,uint256)'](alice.address, bob.address, tokenId);
        const owner = await NFT.ownerOf(tokenId);
        expect(owner).to.equal(bob.address);
    });

    it("Should transferFrom() by approved address", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(admin.address, URI);
        const tokenId = trx.value.toString();

        await NFT.approve(alice.address, tokenId);

        await NFT.connect(alice).transferFrom(admin.address, bob.address, tokenId);
        const owner = await NFT.ownerOf(tokenId);
        expect(owner).to.equal(bob.address);
    });

    it("Should safeTransferFrom() by approved address", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(admin.address, URI);
        const tokenId = trx.value.toString();

        await NFT.approve(alice.address, tokenId);

        await NFT.connect(alice)['safeTransferFrom(address,address,uint256)'](admin.address, bob.address, tokenId);
        const owner = await NFT.ownerOf(tokenId);
        expect(owner).to.equal(bob.address);
    });

    it("Should NOT transfer() by non-owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await expect(
            NFT.transfer(bob.address, tokenId)
        ).to.be.revertedWithCustomError(NFT, 'ERC721InsufficientApproval');
    });

    it("Should NOT transfer() by freeze owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await NFT.freeze(alice.address);
        await expect(
            NFT.connect(alice).transfer(bob.address, tokenId)
        ).to.be.revertedWithCustomError(NFT, "AccountHasBeenFrozen");
    });

    it("Should NOT transferFrom() by non-owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await expect(
            NFT.transferFrom(alice.address, bob.address, tokenId)
        ).to.be.revertedWithCustomError(NFT, 'ERC721InsufficientApproval');
    });

    it("Should NOT transferFrom() by freeze owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();
        
        await NFT.freeze(alice.address);
        await expect(
            NFT.connect(alice).transferFrom(alice.address, bob.address, tokenId)
        ).to.be.revertedWithCustomError(NFT, "AccountHasBeenFrozen");
    });

    it("Should NOT transferFrom() of freeze owner by approved address", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();
        
        await NFT.connect(alice).approve(bob.address, tokenId);

        await NFT.freeze(alice.address);
        await expect(
            NFT.connect(bob).transferFrom(alice.address, bob.address, tokenId)
        ).to.be.revertedWith('Owner has been frozen');
    });

    it("Should NOT transferFrom() by freeze approved address", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();
        
        await NFT.connect(alice).approve(bob.address, tokenId);

        await NFT.freeze(bob.address);
        await expect(
            NFT.connect(bob).transferFrom(alice.address, bob.address, tokenId)
        ).to.be.revertedWithCustomError(NFT, "AccountHasBeenFrozen");
    });

    it("Should transfer() by unfreeze owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await NFT.freeze(alice.address);
        await NFT.unfreeze(alice.address);

        await NFT.connect(alice).transfer(bob.address, tokenId);
        const owner = await NFT.ownerOf(tokenId);
        expect(owner).to.equal(bob.address);
    });


    it("Should transferFrom() by unfreeze owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await NFT.freeze(alice.address);
        await NFT.unfreeze(alice.address);

        await NFT.connect(alice).transferFrom(alice.address, bob.address, tokenId);
        const owner = await NFT.ownerOf(tokenId);
        expect(owner).to.equal(bob.address);
    });

    it("Should transferFrom() by unfreeze owner by approved address", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await NFT.connect(alice).approve(bob.address, tokenId);

        await NFT.freeze(alice.address);
        await NFT.unfreeze(alice.address);

        await NFT.connect(bob).transferFrom(alice.address, bob.address, tokenId);
        const owner = await NFT.ownerOf(tokenId);
        expect(owner).to.equal(bob.address);
    });

    it("Should transferFrom() by unfreeze approved address", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(admin.address, URI);
        const tokenId = trx.value.toString();

        await NFT.approve(alice.address, tokenId);

        await NFT.freeze(alice.address);
        await NFT.unfreeze(alice.address);

        await NFT.connect(alice).transferFrom(admin.address, bob.address, tokenId);
        const owner = await NFT.ownerOf(tokenId);
        expect(owner).to.equal(bob.address);
    });

    it("Should NOT safeTransfer() to not-safe address", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await expect(
            NFT.connect(alice)['safeTransfer(address,uint256)'](NFT.address, tokenId)
        ).to.be.revertedWithCustomError(NFT, 'ERC721InvalidReceiver');
    });

    it("Should NOT safeTransfer() by non-owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await expect(
            NFT['safeTransfer(address,uint256)'](bob.address, tokenId)
        ).to.be.revertedWithCustomError(NFT, 'ERC721InsufficientApproval');
    });

    it("Should NOT safeTransferFrom() by non-owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await expect(
            NFT['safeTransferFrom(address,address,uint256)'](alice.address, bob.address, tokenId)
        ).to.be.revertedWithCustomError(NFT, 'ERC721InsufficientApproval');
    });

    it("Should NOT safeTransferFrom() to not-safe address", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await expect(
            NFT.connect(alice)['safeTransferFrom(address,address,uint256)'](alice.address, NFT.address, tokenId)
        ).to.be.revertedWithCustomError(NFT, 'ERC721InvalidReceiver');
    });

    it("Should NOT transferFrom() by non-approved address", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(admin.address, URI);
        const tokenId = trx.value.toString();

        await expect(
            NFT.connect(alice).transferFrom(admin.address, bob.address, tokenId)
        ).to.be.revertedWithCustomError(NFT, 'ERC721InsufficientApproval');
    });

    it("Should NOT safeTransferFrom() by non-approved address", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(admin.address, URI);
        const tokenId = trx.value.toString();

        await expect(
            NFT.connect(alice)['safeTransferFrom(address,address,uint256)'](admin.address, bob.address, tokenId)
        ).to.be.revertedWithCustomError(NFT, 'ERC721InsufficientApproval');
    });

    it("Should NOT safeTransfer() by freeze owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await NFT.freeze(alice.address);
        await expect(
            NFT.connect(alice)['safeTransfer(address,uint256)'](bob.address, tokenId)
        ).to.be.revertedWithCustomError(NFT, "AccountHasBeenFrozen");
    });

    it("Should NOT safeTransferFrom() by freeze owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();
        
        await NFT.freeze(alice.address);
        await expect(
            NFT.connect(alice)['safeTransferFrom(address,address,uint256)'](alice.address, bob.address, tokenId)
        ).to.be.revertedWithCustomError(NFT, "AccountHasBeenFrozen");
    });

    it("Should NOT safeTransferFrom() of freeze owner by approved address", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();
        
        await NFT.connect(alice).approve(bob.address, tokenId);

        await NFT.freeze(alice.address);
        await expect(
            NFT.connect(bob)['safeTransferFrom(address,address,uint256)'](alice.address, bob.address, tokenId)
        ).to.be.revertedWith('Owner has been frozen');
    });

    it("Should NOT safeTransferFrom() by freeze approved address", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();
        
        await NFT.connect(alice).approve(bob.address, tokenId);

        await NFT.freeze(bob.address);
        await expect(
            NFT.connect(bob)['safeTransferFrom(address,address,uint256)'](alice.address, bob.address, tokenId)
        ).to.be.revertedWithCustomError(NFT, "AccountHasBeenFrozen");
    });

    it("Should safeTransfer() by unfreeze owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await NFT.freeze(alice.address);
        await NFT.unfreeze(alice.address);

        await NFT.connect(alice)['safeTransfer(address,uint256)'](bob.address, tokenId);
        const owner = await NFT.ownerOf(tokenId);
        expect(owner).to.equal(bob.address);
    });


    it("Should safeTransferFrom() by unfreeze owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await NFT.freeze(alice.address);
        await NFT.unfreeze(alice.address);

        await NFT.connect(alice)['safeTransferFrom(address,address,uint256)'](alice.address, bob.address, tokenId);
        const owner = await NFT.ownerOf(tokenId);
        expect(owner).to.equal(bob.address);
    });

    it("Should safeTransferFrom() by unfreeze owner by approved address", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await NFT.connect(alice).approve(bob.address, tokenId);

        await NFT.freeze(alice.address);
        await NFT.unfreeze(alice.address);

        await NFT.connect(bob)['safeTransferFrom(address,address,uint256)'](alice.address, bob.address, tokenId);
        const owner = await NFT.ownerOf(tokenId);
        expect(owner).to.equal(bob.address);
    });

    it("Should safeTransferFrom() by unfreeze approved address", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const trx = await NFT.safeMint(admin.address, URI);
        const tokenId = trx.value.toString();

        await NFT.approve(alice.address, tokenId);

        await NFT.freeze(alice.address);
        await NFT.unfreeze(alice.address);

        await NFT.connect(alice)['safeTransferFrom(address,address,uint256)'](admin.address, bob.address, tokenId);
        const owner = await NFT.ownerOf(tokenId);
        expect(owner).to.equal(bob.address);
    });
});

describe("NFT - Burn check", function () {

    it("Should burn() by burner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        NFT.grantBurner(burner.address);

        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await NFT.connect(burner).burn(tokenId);

        await expect(
            NFT.tokenURI(tokenId)
        ).to.revertedWithCustomError(NFT, 'ERC721NonexistentToken');
    });

    it("Should burn() by owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await NFT.connect(alice).burn(tokenId);

        await expect(
            NFT.tokenURI(tokenId)
        ).to.revertedWithCustomError(NFT, 'ERC721NonexistentToken');
    });


    it("Should burn() by new owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await NFT.connect(alice).transfer(bob.address, tokenId);

        await NFT.connect(bob).burn(tokenId);

        await expect(
            NFT.tokenURI(tokenId)
        ).to.revertedWithCustomError(NFT, 'ERC721NonexistentToken');

    });

    it("Should NOT burn() by former-burner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        NFT.grantBurner(burner.address);

        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        NFT.revokeBurner(burner.address);
        await expect(
            NFT.connect(burner).burn(tokenId)
        ).to.revertedWith('Caller does not own this NFT');
    });

    it("Should NOT burn() by former-owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await NFT.connect(alice).transfer(bob.address, tokenId);

        await expect(
            NFT.connect(alice).burn(tokenId)
        ).to.revertedWith('Caller does not own this NFT');
    });

    it("Should NOT burn() by non-burner/non-owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const trx = await NFT.safeMint(admin.address, URI);
        const tokenId = trx.value.toString();

        await expect(
            NFT.connect(bob).burn(tokenId)
        ).to.revertedWith('Caller does not own this NFT');

    });

    it("Should NOT burn() by freeze owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await NFT.freeze(alice.address);

        NFT.revokeBurner(burner.address);
        await expect(
            NFT.connect(alice).burn(tokenId)
        ).to.revertedWithCustomError(NFT, "AccountHasBeenFrozen");
    });

    it("Should NOT burn() of freeze owner by burner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await NFT.grantBurner(burner.address);

        await NFT.freeze(alice.address);

        NFT.grantBurner(burner.address);
        
        await expect(
            NFT.connect(burner).burn(tokenId)
        ).to.revertedWith('Owner has been frozen');
    });

    it("Should burn() by unfreeze owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();

        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await NFT.freeze(alice.address);
        await NFT.unfreeze(alice.address);

        await NFT.connect(alice).burn(tokenId);

        await expect(
            NFT.tokenURI(tokenId)
        ).to.revertedWithCustomError(NFT, 'ERC721NonexistentToken');
    });

});

describe("NFT - is SBT", function () {

    it("Should NOT transfer() by owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT.setToSBT(true);

        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await expect(
            NFT.connect(alice).transfer(bob.address, tokenId)
        ).to.revertedWith('This NFT was not permitted to transfer');
    });

    it("Should NOT transferFrom() by owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT.setToSBT(true);

        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await expect(
            NFT.connect(alice).transferFrom(alice.address, bob.address, tokenId)
        ).to.revertedWith('This NFT was not permitted to transfer');
    });

    it("Should NOT safeTransfer() by owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT.setToSBT(true);

        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await expect(
            NFT.connect(alice)['safeTransfer(address,uint256)'](bob.address, tokenId)
        ).to.revertedWith('This NFT was not permitted to transfer');
    });

    it("Should NOT safeTransferFrom() by owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT.setToSBT(true);

        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await expect(
            NFT.connect(alice)['safeTransferFrom(address,address,uint256)'](alice.address, bob.address, tokenId)
        ).to.revertedWith('This NFT was not permitted to transfer');
    });

    it("Should NOT transferFrom() by approved address", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT.setToSBT(true);

        const trx = await NFT.safeMint(admin.address, URI);
        const tokenId = trx.value.toString();

        await NFT.approve(alice.address, tokenId);

        await expect( 
            NFT.connect(alice).transferFrom(admin.address, bob.address, tokenId)
        ).to.revertedWith('This NFT was not permitted to transfer');
    });

    it("Should NOT safeTransferFrom() by approved address", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT.setToSBT(true);

        const trx = await NFT.safeMint(admin.address, URI);
        const tokenId = trx.value.toString();

        await NFT.approve(alice.address, tokenId);

        await expect(
            NFT.connect(alice)['safeTransferFrom(address,address,uint256)'](admin.address, bob.address, tokenId)
        ).to.revertedWith('This NFT was not permitted to transfer');
    });

    it("Should NOT burn() by burner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT.setToSBT(true);

        NFT.grantBurner(burner.address);

        const trx = await NFT.safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await expect(
            NFT.connect(burner).burn(tokenId)
        ).to.revertedWith('This NFT was not permitted to burn');
    });

    it("Should NOT burn() by owner", async function () {
        const { NFT, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await NFT.setToSBT(true);
        
        const trx = await NFT.connect(admin).safeMint(alice.address, URI);
        const tokenId = trx.value.toString();

        await expect(
            NFT.connect(alice).burn(tokenId)
        ).to.revertedWith('This NFT was not permitted to burn');
        
    });

})
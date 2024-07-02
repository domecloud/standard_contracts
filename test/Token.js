const { expect } = require("chai");

async function deployContract() {
    const Factory = await ethers.getContractFactory("Token");
    const [admin, minter, burner, pauser, admin2, alice, bob] = await ethers.getSigners();

    const Token = await Factory.deploy();

    await Token.deployed();

    return { Token, admin, minter, burner, pauser, admin2, alice, bob };
}

describe("Token - ACL check", function () {

    it("Should grantAdmin() by admin", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const DEFAULT_ADMIN_ROLE = await Token.DEFAULT_ADMIN_ROLE();

        await Token.grantAdmin(admin2.address);
        const role = await Token.hasRole(DEFAULT_ADMIN_ROLE, admin2.address);
        expect(role).to.equal(true);
    });

    it("Should grantMinter() by admin", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const MINTER_ROLE = await Token.MINTER_ROLE();

        await Token.grantMinter(minter.address);
        const role = await Token.hasRole(MINTER_ROLE, minter.address);
        expect(role).to.equal(true);
    });

    it("Should grantBurner() by admin", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const BURNER_ROLE = await Token.BURNER_ROLE();

        await Token.grantBurner(burner.address);
        const role = await Token.hasRole(BURNER_ROLE, burner.address);
        expect(role).to.equal(true);
    });

    it("Should grantPauser() by admin", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const PAUSER_ROLE = await Token.PAUSER_ROLE();

        await Token.grantPauser(pauser.address);
        const role = await Token.hasRole(PAUSER_ROLE, pauser.address);
        expect(role).to.equal(true);
    });

    it("Should NOT grantAdmin() by non-admin", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        await expect(
            Token.connect(alice).grantAdmin(admin2.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });

    it("Should NOT grantMinter() by non-admin", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        await expect(
            Token.connect(alice).grantMinter(minter.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });

    it("Should NOT grantBurner() non-admin", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        await expect(
            Token.connect(alice).grantBurner(burner.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });

    it("Should NOT grantPauser() non-admin", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        await expect(
            Token.connect(alice).grantPauser(pauser.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });
})

describe("Token - freeze check", function () {
    it("Should freezeAccounts set to false by default", async function () {
        const { Token, admin, minter, burner, admin2, alice, bob } = await deployContract();
        const isFreeze = await Token.freezeAccounts(admin.address);
        expect(isFreeze).to.equal(false);
    });

    it("Should freeze() by admin", async function () {
        const { Token, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await Token.freeze(alice.address);
        const isFreeze = await Token.freezeAccounts(alice.address);
        expect(isFreeze).to.equal(true);
    });

    it("Should unfreeze() by admin", async function () {
        const { Token, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await Token.freeze(alice.address);
        const isFreeze = await Token.freezeAccounts(alice.address);
        expect(isFreeze).to.equal(true);

        await Token.unfreeze(alice.address);
        const isFreeze2 = await Token.freezeAccounts(alice.address);
        expect(isFreeze2).to.equal(false);
    });

    it("Should freeze() by new admin", async function () {
        const { Token, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await Token.grantAdmin(admin2.address);

        await Token.connect(admin2).freeze(alice.address);
        const isFreeze = await Token.freezeAccounts(alice.address);
        expect(isFreeze).to.equal(true);
    });

    it("Should unfreeze() by new admin", async function () {
        const { Token, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await Token.grantAdmin(admin2.address);

        await Token.connect(admin2).freeze(alice.address);
        const isFreeze = await Token.freezeAccounts(alice.address);
        expect(isFreeze).to.equal(true);

        await Token.connect(admin2).unfreeze(alice.address);
        const isFreeze2 = await Token.freezeAccounts(alice.address);
        expect(isFreeze2).to.equal(false);

    });

    it("Should not freeze() by non-admin", async function () {
        const { Token, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await expect(
            Token.connect(bob).freeze(alice.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');

    });

    it("Should not unfreeze() by non-admin", async function () {
        const { Token, admin, minter, burner, admin2, alice, bob } = await deployContract();

        await Token.freeze(alice.address);
        const isFreeze = await Token.freezeAccounts(alice.address);
        expect(isFreeze).to.equal(true);

        await expect(
            Token.connect(bob).unfreeze(alice.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');

    });

    it("Should not freeze() by former admin", async function () {
        const { Token, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await Token.grantAdmin(admin2.address);
        await Token.revokeAdmin(admin2.address);

        await expect(
            Token.connect(admin2).freeze(alice.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });

    it("Should not freeze() by former admin", async function () {
        const { Token, admin, minter, burner, admin2, alice, bob } = await deployContract();
        await Token.grantAdmin(admin2.address);
        await Token.revokeAdmin(admin2.address);

        await Token.freeze(alice.address);
        const isFreeze = await Token.freezeAccounts(alice.address);
        expect(isFreeze).to.equal(true);

        await expect(
            Token.connect(admin2).unfreeze(alice.address)
        ).to.be.revertedWith('Caller does not has a DEFAULT_ADMIN_ROLE');
    });


})

describe("Token - Mint check", function () {

    it("Should mint() by minter", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        await Token.grantMinter(minter.address);

        await Token.connect(minter).mint(ethers.utils.parseEther(amountToMint.toString()));
        const balance = +ethers.utils.formatEther(await Token.balanceOf(minter.address));

        expect(balance).to.equal(amountToMint);
    });

    it("Should mintTo() by minter", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        await Token.grantMinter(minter.address);

        await Token.connect(minter).mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));
        const balance = +ethers.utils.formatEther(await Token.balanceOf(alice.address));

        expect(balance).to.equal(amountToMint);
    });

    it("Should NOT mint() by non-minter", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;

        await expect(
            Token.connect(minter).mint(ethers.utils.parseEther(amountToMint.toString()))
        ).to.be.revertedWith('Caller does not has a MINTER_ROLE');
    });

    it("Should NOT mintTo() by non-minter", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;

        await expect(
            Token.connect(minter).mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()))
        ).to.be.revertedWith('Caller does not has a MINTER_ROLE');
    });

    it("Should return totalMintAmount from all mint event combined", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        await Token.grantMinter(minter.address);

        await Token.connect(minter).mint(ethers.utils.parseEther(amountToMint.toString()));

        const amountToMint2 = Math.floor(Math.random()*1000000) + 1000000;

        await Token.connect(minter).mint(ethers.utils.parseEther(amountToMint2.toString()));

        const totalMintAmount = +ethers.utils.formatEther(await Token.totalMintAmount());

        expect(totalMintAmount).to.equal(amountToMint+amountToMint2);
    });
})

describe("Token - Burn check", function () {

    it("Should burn() by owner", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToBurn = Math.floor(Math.random()*1000000);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));

        await Token.connect(alice).burn(ethers.utils.parseEther(amountToBurn.toString()));
        const balance = +ethers.utils.formatEther(await Token.balanceOf(alice.address));

        expect(balance).to.equal(amountToMint - amountToBurn);
    });

    it("Should burnFrom() by owner", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToBurn = Math.floor(Math.random()*1000000);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));

        await Token.connect(alice).burnFrom(alice.address, ethers.utils.parseEther(amountToBurn.toString()));
        const balance = +ethers.utils.formatEther(await Token.balanceOf(alice.address));

        expect(balance).to.equal(amountToMint - amountToBurn);
    });

    it("Should burnFrom() by burner", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        await Token.grantBurner(burner.address);

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToBurn = Math.floor(Math.random()*1000000);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));

        await Token.connect(burner).burnFrom(alice.address, ethers.utils.parseEther(amountToBurn.toString()));
        const balance = +ethers.utils.formatEther(await Token.balanceOf(alice.address));

        expect(balance).to.equal(amountToMint - amountToBurn);
    });

    it("Should NOT burnFrom() by non-burner", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToBurn = Math.floor(Math.random()*1000000);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));

        await expect(
            Token.connect(bob).burnFrom(alice.address, ethers.utils.parseEther(amountToBurn.toString()))
        ).to.be.revertedWith('Caller does not has a BURNER_ROLE');
    });

    it("Should NOT burnFrom() of freeze address", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        await Token.grantBurner(burner.address);

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToBurn = Math.floor(Math.random()*1000000);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));

        await Token.freeze(alice.address);

        await expect(
            Token.connect(burner).burnFrom(alice.address, ethers.utils.parseEther(amountToBurn.toString()))
        ).to.be.revertedWithCustomError(Token, "AccountHasBeenFrozen");
    });

    it("Should burnFrom() of unfreeze address", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        await Token.grantBurner(burner.address);

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToBurn = Math.floor(Math.random()*1000000);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));

        await Token.freeze(alice.address);
        await Token.unfreeze(alice.address);

        await Token.connect(burner).burnFrom(alice.address, ethers.utils.parseEther(amountToBurn.toString()));
        
        const balance = +ethers.utils.formatEther(await Token.balanceOf(alice.address));

        expect(balance).to.equal(amountToMint - amountToBurn);
    });
    
    it("Should NOT burn() by owner if account has been frozen", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        await Token.grantBurner(burner.address);

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToBurn = Math.floor(Math.random()*1000000);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));

        await Token.freeze(alice.address);

        await expect(
            Token.connect(alice).burn(ethers.utils.parseEther(amountToBurn.toString()))
        ).to.be.revertedWithCustomError(Token, "AccountHasBeenFrozen");
    });


    it("Should NOT burn() by owner if amount is exceeds balance", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000);
        const amountToBurn = amountToMint*2;

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));

        await expect(
            Token.connect(alice).burn(ethers.utils.parseEther(amountToBurn.toString()))
        ).to.be.revertedWithCustomError(Token, 'ERC20InsufficientBalance');
    });

    it("Should NOT burnFrom() by owner if amount is exceeds balance", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000);
        const amountToBurn = amountToMint*2;

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));

        await expect(
            Token.connect(alice).burnFrom(alice.address, ethers.utils.parseEther(amountToBurn.toString()))
        ).to.be.revertedWithCustomError(Token, 'ERC20InsufficientBalance');
    });

    it("Should NOT burnFrom() by burner if amount is exceeds balance", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        await Token.grantBurner(burner.address);

        const amountToMint = Math.floor(Math.random()*1000000);
        const amountToBurn = amountToMint*2;

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));

        await expect(
            Token.connect(burner).burnFrom(alice.address, ethers.utils.parseEther(amountToBurn.toString()))
        ).to.be.revertedWithCustomError(Token, 'ERC20InsufficientBalance');
    });

    it("Should return totalBurnAmount from all burn event combined", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToBurn = Math.floor(Math.random()*1000000);
        const amountToBurn2 = Math.floor(Math.random()*1000000);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));
        await Token.mintTo(bob.address, ethers.utils.parseEther(amountToMint.toString()));

        await Token.connect(alice).burn(ethers.utils.parseEther(amountToBurn.toString()));
        await Token.connect(bob).burn(ethers.utils.parseEther(amountToBurn2.toString()));
        //const balance = +ethers.utils.formatEther(await Token.balanceOf(alice.address));

        const totalBurnAmount = +ethers.utils.formatEther(await Token.totalBurnAmount());

        expect(totalBurnAmount).to.equal(amountToBurn + amountToBurn2);
    });

})

describe("Token - Transfer check", function () {

    it("Should transfer() by owner", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToTransfer = Math.floor(amountToMint/2);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));

        await Token.connect(alice)['transfer(address,uint256)'](bob.address, ethers.utils.parseEther(amountToTransfer.toString()));
        const balance = +ethers.utils.formatEther(await Token.balanceOf(alice.address));
        const balance2 = +ethers.utils.formatEther(await Token.balanceOf(bob.address));

        expect(balance).to.equal(amountToMint - amountToTransfer);
        expect(balance2).to.equal(amountToTransfer);
    });

    it("Should transfer() with Memo by owner", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToTransfer = Math.floor(amountToMint/2);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));

        await Token.connect(alice)['transfer(address,uint256,string)'](bob.address, ethers.utils.parseEther(amountToTransfer.toString()), 'Memo');
        const balance = +ethers.utils.formatEther(await Token.balanceOf(alice.address));
        const balance2 = +ethers.utils.formatEther(await Token.balanceOf(bob.address));

        expect(balance).to.equal(amountToMint - amountToTransfer);
        expect(balance2).to.equal(amountToTransfer);
    });

    it("Should transferFrom() by approved address (sufficient allowance)", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToTransfer = Math.floor(amountToMint/2);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));

        await Token.connect(alice).approve(bob.address, ethers.utils.parseEther(amountToTransfer.toString()));

        await Token.connect(bob)['transferFrom(address,address,uint256)'](alice.address, bob.address, ethers.utils.parseEther(amountToTransfer.toString()));
        
        const balance = +ethers.utils.formatEther(await Token.balanceOf(alice.address));
        const balance2 = +ethers.utils.formatEther(await Token.balanceOf(bob.address));

        expect(balance).to.equal(amountToMint - amountToTransfer);
        expect(balance2).to.equal(amountToTransfer);
    });

    it("Should transferFrom() with Memo by approved address (sufficient allowance)", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToTransfer = Math.floor(amountToMint/2);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));

        await Token.connect(alice).approve(bob.address, ethers.utils.parseEther(amountToTransfer.toString()));

        await Token.connect(bob)['transferFrom(address,address,uint256,string)'](alice.address, bob.address, ethers.utils.parseEther(amountToTransfer.toString()), 'Memo');
        
        const balance = +ethers.utils.formatEther(await Token.balanceOf(alice.address));
        const balance2 = +ethers.utils.formatEther(await Token.balanceOf(bob.address));

        expect(balance).to.equal(amountToMint - amountToTransfer);
        expect(balance2).to.equal(amountToTransfer);
    });

    it("Should NOT transfer() by non-owner", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToTransfer = Math.floor(amountToMint/2);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));
        
        await expect(
            Token.connect(bob)['transfer(address,uint256)'](bob.address, ethers.utils.parseEther(amountToTransfer.toString()))
        ).to.be.revertedWithCustomError(Token, 'ERC20InsufficientBalance');
    });

    it("Should NOT transfer() by freeze owner", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToTransfer = Math.floor(amountToMint/2);
        
        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));
        await Token.freeze(alice.address);

        await expect(
            Token.connect(alice)['transfer(address,uint256)'](bob.address, ethers.utils.parseEther(amountToTransfer.toString()))
        ).to.be.revertedWithCustomError(Token, "AccountHasBeenFrozen");
    });

    it("Should NOT transfer() with Memo by freeze owner", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToTransfer = Math.floor(amountToMint/2);
        
        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));
        await Token.freeze(alice.address);

        await expect(
            Token.connect(alice)['transfer(address,uint256)'](bob.address, ethers.utils.parseEther(amountToTransfer.toString()))
        ).to.be.revertedWithCustomError(Token, "AccountHasBeenFrozen");
    });

    it("Should transfer() by unfreeze owner", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToTransfer = Math.floor(amountToMint/2);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));

        await Token.freeze(alice.address);
        await Token.unfreeze(alice.address);

        await Token.connect(alice)['transfer(address,uint256)'](bob.address, ethers.utils.parseEther(amountToTransfer.toString()));
        const balance = +ethers.utils.formatEther(await Token.balanceOf(alice.address));
        const balance2 = +ethers.utils.formatEther(await Token.balanceOf(bob.address));

        expect(balance).to.equal(amountToMint - amountToTransfer);
        expect(balance2).to.equal(amountToTransfer);
    });

    it("Should transfer() with Memo by unfreeze owner", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToTransfer = Math.floor(amountToMint/2);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));

        await Token.freeze(alice.address);
        await Token.unfreeze(alice.address);

        await Token.connect(alice)['transfer(address,uint256,string)'](bob.address, ethers.utils.parseEther(amountToTransfer.toString()), 'Memo');
        const balance = +ethers.utils.formatEther(await Token.balanceOf(alice.address));
        const balance2 = +ethers.utils.formatEther(await Token.balanceOf(bob.address));

        expect(balance).to.equal(amountToMint - amountToTransfer);
        expect(balance2).to.equal(amountToTransfer);
    });

    it("Should NOT transferFrom() by non-approved address (insufficient allowance)", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToTransfer = Math.floor(amountToMint/2);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));
        
        await expect(
            Token.connect(bob)['transferFrom(address,address,uint256)'](alice.address, bob.address, ethers.utils.parseEther(amountToTransfer.toString()))
        ).to.be.revertedWithCustomError(Token, 'ERC20InsufficientAllowance');
    });

    it("Should NOT transferFrom() with Memo by non-approved address (insufficient allowance)", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToTransfer = Math.floor(amountToMint/2);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));
        
        await expect(
            Token.connect(bob)['transferFrom(address,address,uint256,string)'](alice.address, bob.address, ethers.utils.parseEther(amountToTransfer.toString()), 'Memo')
        ).to.be.revertedWithCustomError(Token, 'ERC20InsufficientAllowance');
    });
    
    it("Should NOT transferFrom() by approved freeze address (insufficient allowance)", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToTransfer = Math.floor(amountToMint/2);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));
        
        await Token.connect(alice).approve(bob.address, ethers.utils.parseEther(amountToTransfer.toString()));

        await Token.freeze(bob.address);

        await expect(
            Token.connect(bob)['transferFrom(address,address,uint256)'](alice.address, bob.address, ethers.utils.parseEther(amountToTransfer.toString()))
        ).to.be.revertedWithCustomError(Token, "AccountHasBeenFrozen");
    });

    it("Should NOT transferFrom() with Memo by approved freeze address (insufficient allowance)", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToTransfer = Math.floor(amountToMint/2);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));
        
        await Token.connect(alice).approve(bob.address, ethers.utils.parseEther(amountToTransfer.toString()));

        await Token.freeze(bob.address);

        await expect(
            Token.connect(bob)['transferFrom(address,address,uint256,string)'](alice.address, bob.address, ethers.utils.parseEther(amountToTransfer.toString()), "Memo")
        ).to.be.revertedWithCustomError(Token, "AccountHasBeenFrozen");
    });

    it("Should transferFrom() by approved unfreeze address (sufficient allowance)", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToTransfer = Math.floor(amountToMint/2);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));

        await Token.connect(alice).approve(bob.address, ethers.utils.parseEther(amountToTransfer.toString()));

        await Token.freeze(bob.address);
        await Token.unfreeze(bob.address);

        await Token.connect(bob)['transferFrom(address,address,uint256)'](alice.address, bob.address, ethers.utils.parseEther(amountToTransfer.toString()));
        
        const balance = +ethers.utils.formatEther(await Token.balanceOf(alice.address));
        const balance2 = +ethers.utils.formatEther(await Token.balanceOf(bob.address));

        expect(balance).to.equal(amountToMint - amountToTransfer);
        expect(balance2).to.equal(amountToTransfer);
    });

    it("Should transferFrom() with Memo approved unfreeze address (sufficient allowance)", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToTransfer = Math.floor(amountToMint/2);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));

        await Token.connect(alice).approve(bob.address, ethers.utils.parseEther(amountToTransfer.toString()));

        await Token.freeze(bob.address);
        await Token.unfreeze(bob.address);

        await Token.connect(bob)['transferFrom(address,address,uint256,string)'](alice.address, bob.address, ethers.utils.parseEther(amountToTransfer.toString()), 'Memo');
        
        const balance = +ethers.utils.formatEther(await Token.balanceOf(alice.address));
        const balance2 = +ethers.utils.formatEther(await Token.balanceOf(bob.address));

        expect(balance).to.equal(amountToMint - amountToTransfer);
        expect(balance2).to.equal(amountToTransfer);
    });

    it("Should NOT transferFrom() by approved address of freeze owner (insufficient allowance)", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToTransfer = Math.floor(amountToMint/2);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));
        
        await Token.connect(alice).approve(bob.address, ethers.utils.parseEther(amountToTransfer.toString()));

        await Token.freeze(alice.address);

        await expect(
            Token.connect(bob)['transferFrom(address,address,uint256)'](alice.address, bob.address, ethers.utils.parseEther(amountToTransfer.toString()))
        ).to.be.revertedWithCustomError(Token, "AccountHasBeenFrozen");
    });

    it("Should NOT transferFrom() with Memo by approved address of freeze owner (insufficient allowance)", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToTransfer = Math.floor(amountToMint/2);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));
        
        await Token.connect(alice).approve(bob.address, ethers.utils.parseEther(amountToTransfer.toString()));
        
        await Token.freeze(alice.address);

        await expect(
            Token.connect(bob)['transferFrom(address,address,uint256,string)'](alice.address, bob.address, ethers.utils.parseEther(amountToTransfer.toString()), 'Memo')
        ).to.be.revertedWithCustomError(Token, "AccountHasBeenFrozen");
    });

    it("Should transferFrom() by approved address of unfreeze owner (sufficient allowance)", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToTransfer = Math.floor(amountToMint/2);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));

        await Token.connect(alice).approve(bob.address, ethers.utils.parseEther(amountToTransfer.toString()));

        await Token.freeze(alice.address);
        await Token.unfreeze(alice.address);

        await Token.connect(bob)['transferFrom(address,address,uint256)'](alice.address, bob.address, ethers.utils.parseEther(amountToTransfer.toString()));
        
        const balance = +ethers.utils.formatEther(await Token.balanceOf(alice.address));
        const balance2 = +ethers.utils.formatEther(await Token.balanceOf(bob.address));

        expect(balance).to.equal(amountToMint - amountToTransfer);
        expect(balance2).to.equal(amountToTransfer);
    });

    it("Should transferFrom() with Memo by approved address of unfreeze owner (sufficient allowance)", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToTransfer = Math.floor(amountToMint/2);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));

        await Token.connect(alice).approve(bob.address, ethers.utils.parseEther(amountToTransfer.toString()));

        await Token.freeze(alice.address);
        await Token.unfreeze(alice.address);
        
        await Token.connect(bob)['transferFrom(address,address,uint256,string)'](alice.address, bob.address, ethers.utils.parseEther(amountToTransfer.toString()), 'Memo');
        
        const balance = +ethers.utils.formatEther(await Token.balanceOf(alice.address));
        const balance2 = +ethers.utils.formatEther(await Token.balanceOf(bob.address));

        expect(balance).to.equal(amountToMint - amountToTransfer);
        expect(balance2).to.equal(amountToTransfer);
    });


    it("Should return totalTransferedAmount from all transfer event combined", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToTransfer = Math.floor(amountToMint/2);
        const amountToTransfer2 = Math.floor(amountToTransfer/2);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));

        await Token.connect(alice)['transfer(address,uint256)'](bob.address, ethers.utils.parseEther(amountToTransfer.toString()));
        await Token.connect(bob)['transfer(address,uint256)'](alice.address, ethers.utils.parseEther(amountToTransfer2.toString()));

        const totalTransferedAmount = +ethers.utils.formatEther(await Token.totalTransferedAmount());

        expect(totalTransferedAmount).to.equal(amountToTransfer + amountToTransfer2);
    });

})

describe("Token - Pause check", function () {
    it("Should NOT mintTo() by minter when paused", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;

        await Token.grantMinter(minter.address);
        
        await Token.pause();        

        await expect(
            Token.connect(minter).mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()))
        ).to.be.revertedWithCustomError(Token, 'EnforcedPause');
    });

    it("Should NOT transfer() by owner when paused", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToTransfer = Math.floor(amountToMint/2);
        
        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));
        await Token.pause();

        await expect(
            Token.connect(alice)['transfer(address,uint256)'](bob.address, ethers.utils.parseEther(amountToTransfer.toString()))
        ).to.be.revertedWithCustomError(Token, 'EnforcedPause');
    });
    it("Should NOT transferFrom() by approved address (sufficient allowance) when paused", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToTransfer = Math.floor(amountToMint/2);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));

        await Token.connect(alice).approve(bob.address, ethers.utils.parseEther(amountToTransfer.toString()));
        
        await Token.pause();  

        await expect(
            Token.connect(bob)['transferFrom(address,address,uint256)'](alice.address, bob.address, ethers.utils.parseEther(amountToTransfer.toString()))
        ).to.be.revertedWithCustomError(Token, 'EnforcedPause');
    });

    it("Should mintTo() by minter when unpaused", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;

        await Token.grantMinter(minter.address);
        
        await Token.pause();        
        await Token.unpause();        

        await Token.connect(minter).mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));
        const balance = +ethers.utils.formatEther(await Token.balanceOf(alice.address));

        expect(balance).to.equal(amountToMint);
    });

    it("Should transfer() by owner when unpaused", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToTransfer = Math.floor(amountToMint/2);
        
        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));
        await Token.pause();
        await Token.unpause();

        await Token.connect(alice)['transfer(address,uint256)'](bob.address, ethers.utils.parseEther(amountToTransfer.toString()));

        const balance = +ethers.utils.formatEther(await Token.balanceOf(alice.address));
        const balance2 = +ethers.utils.formatEther(await Token.balanceOf(bob.address));

        expect(balance).to.equal(amountToMint - amountToTransfer);
        expect(balance2).to.equal(amountToTransfer);

    });
    it("Should transfer() by approved address (sufficient allowance) when unpaused", async function () {
        const { Token, admin, minter, burner, pauser, admin2, alice, bob } = await deployContract();

        const amountToMint = Math.floor(Math.random()*1000000) + 1000000;
        const amountToTransfer = Math.floor(amountToMint/2);

        await Token.mintTo(alice.address, ethers.utils.parseEther(amountToMint.toString()));

        await Token.connect(alice).approve(bob.address, ethers.utils.parseEther(amountToTransfer.toString()));

        await Token.pause();
        await Token.unpause();

        await Token.connect(bob)['transferFrom(address,address,uint256)'](alice.address, bob.address, ethers.utils.parseEther(amountToTransfer.toString()));
        
        const balance = +ethers.utils.formatEther(await Token.balanceOf(alice.address));
        const balance2 = +ethers.utils.formatEther(await Token.balanceOf(bob.address));

        expect(balance).to.equal(amountToMint - amountToTransfer);
        expect(balance2).to.equal(amountToTransfer);
    });
});


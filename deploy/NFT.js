module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts();
    const { deploy } = deployments;

    await deploy('NFT', {
        from: deployer,
        log: true,
        deterministicDeployment: false
    });
};

module.exports.tags = ['NFT'];
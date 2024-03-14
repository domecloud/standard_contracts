module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts();
    const { deploy } = deployments;

    await deploy('NFT2', {
        from: deployer,
        log: true,
        deterministicDeployment: false
    });
};

module.exports.tags = ['NFT2'];

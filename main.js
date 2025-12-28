import { createAppKit } from 'https://esm.sh/@reown/appkit'
import { EthersAdapter } from 'https://esm.sh/@reown/appkit-adapter-ethers'
import { base } from 'https://esm.sh/@reown/appkit/networks'
import { ethers } from 'https://esm.sh/ethers@6.x'

const projectId = 'a5f9260bc9bca570190d3b01f477fc45';
const contractAddress = 'ALAMAT_CONTRACT_SETELAH_DEPLOY'; 
const abi = [
    "function deposit(string memory _message) external payable",
    "function withdraw() external",
    "function getMyVault() external view returns (string memory message, uint256 balance, uint256 time)"
];

const modal = createAppKit({
  adapters: [new EthersAdapter()],
  networks: [base],
  projectId
});

const dappContent = document.getElementById('dapp-content');
const status = document.getElementById('status');

modal.subscribeAccount(state => {
    if (state.isConnected) {
        dappContent.classList.remove('hidden');
        loadVaultData();
    } else {
        dappContent.classList.add('hidden');
    }
});

async function loadVaultData() {
    const provider = new ethers.BrowserProvider(modal.getWalletProvider());
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    
    try {
        const [msg, bal] = await contract.getMyVault();
        document.getElementById('display-msg').innerText = msg || "Brankas Kosong";
        document.getElementById('display-bal').innerText = ethers.formatEther(bal) + " ETH";
    } catch (e) { console.log(e); }
}

document.getElementById('deposit-btn').onclick = async () => {
    const msgInput = document.getElementById('secret-input').value;
    const ethInput = document.getElementById('eth-input').value || "0";
    
    const provider = new ethers.BrowserProvider(modal.getWalletProvider());
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    
    status.innerText = "Mengirim ke Vault...";
    const tx = await contract.deposit(msgInput, { value: ethers.parseEther(ethInput) });
    await tx.wait();
    location.reload();
};

document.getElementById('withdraw-btn').onclick = async () => {
    const provider = new ethers.BrowserProvider(modal.getWalletProvider());
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    
    status.innerText = "Menarik aset...";
    const tx = await contract.withdraw();
    await tx.wait();
    location.reload();
};

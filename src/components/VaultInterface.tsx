import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { BrowserProvider, Contract } from 'ethers'

const CONTRACT_ADDRESS = "0xYourDeployedVaultAddress";
const ABI = [
  "function heartbeat() external",
  "function claimInheritance() external",
  "function lastCheckIn() view returns (uint256)"
];

export function VaultInterface() {
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');

  const performHeartbeat = async () => {
    if (!isConnected) return;
    const provider = new BrowserProvider(walletProvider);
    const signer = await provider.getSigner();
    const vault = new Contract(CONTRACT_ADDRESS, ABI, signer);
    
    try {
      const tx = await vault.heartbeat();
      await tx.wait();
      console.log("Heartbeat transaction confirmed");
    } catch (error) {
      console.error("Transaction failed", error);
    }
  };

  return (
    <div className="vault-card">
      <h2>Legacy Vault Control</h2>
      {isConnected ? (
        <div className="action-area">
          <p>Connected: {address}</p>
          <button onClick={performHeartbeat} className="btn-primary">
            Send Heartbeat
          </button>
        </div>
      ) : (
        <appkit-button />
      )}
    </div>
  );
}

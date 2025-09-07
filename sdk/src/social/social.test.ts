import { SocialSDK } from "./social";
import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { getFaucetHost, requestSuiFromFaucetV2 } from "@mysten/sui/faucet";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

describe("socialSDK", () => {
  const suiClient = new SuiClient({
    network: "localnet",
    url: "http://127.0.0.1:9000",
  });
  let keypair = Ed25519Keypair.fromSecretKey(
    "suiprivkey1qrfuhd6pdgsac3khspp5rpdsnc9wtlhgsdfrzx43pmp6evhqg8vr2ee700d"
  );
  let socialSDK: SocialSDK;
  let address = keypair.getPublicKey().toSuiAddress();

  beforeAll(async () => {
    socialSDK = SocialSDK.start(suiClient);
    await requestSuiFromFaucetV2({
      host: getFaucetHost("localnet"),
      recipient: address,
    });
  }, 10000);

  it.skip("mint social", async () => {
    const tx = socialSDK.mint("meu n", "non", "foto", []);

    const result = await suiClient.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
      options: {
        showEffects: true,
      },
    });
    console.log(result);
  });

  it.skip("publish post", async () => {
    const socialNFT = await socialSDK.getOwnedSocialNFT(address);
    if (!socialNFT) {
      throw new Error("Não tem SocialNFT");
    }
    const newPost = socialSDK.newPost(
      socialNFT?.id,
      "esse é o conteudo",
      "esse é o anexo"
    );
    const result = await suiClient.signAndExecuteTransaction({
      signer: keypair,
      transaction: newPost,
      options: {
        showEffects: true,
      },
    });
    expect(result.effects?.status.status).toEqual("success");
  });

  it("get", async () => {
    const pages = await socialSDK.getFeedPosts(address);
    expect(pages).toBeDefined();
  });
});

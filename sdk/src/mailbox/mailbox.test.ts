import { MailboxSDK } from "./mailbox";
import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { getFaucetHost, requestSuiFromFaucetV2 } from "@mysten/sui/faucet";
import { decodeMailboxId } from "./utils";

describe("MailboxSDK", () => {
  const suiClient = new SuiClient({
    network: "localnet",
    url: "http://127.0.0.1:9000",
  });
  let keypair = Ed25519Keypair.fromSecretKey(
    "suiprivkey1qrfuhd6pdgsac3khspp5rpdsnc9wtlhgsdfrzx43pmp6evhqg8vr2ee700d"
  );
  let address = keypair.getPublicKey().toSuiAddress();
  let mailboxSDK: MailboxSDK;

  beforeAll(async () => {
    mailboxSDK = await MailboxSDK.start(suiClient);
    await requestSuiFromFaucetV2({
      host: getFaucetHost("localnet"),
      recipient: address,
    });
  }, 10000);

  it("Get Taxes", async () => {
    expect(mailboxSDK).toBeDefined();
  });

  it.skip("Create Inbox", async () => {
    const createInboxTx = mailboxSDK.createInbox();

    const result = await suiClient.signAndExecuteTransaction({
      signer: keypair,
      transaction: createInboxTx,
      options: {
        showEffects: true,
      },
    });

    expect(result.effects?.status.status).toBe("success");
  });

  it.skip("Send email", async () => {
    const mailBoxId = await mailboxSDK.getMailBoxId(address);
    const sendTx = mailboxSDK.sendEmail(
      address,
      mailBoxId!,
      "Olá mundo",
      "Olá mundo content"
    );
    const result = await suiClient.signAndExecuteTransaction({
      signer: keypair,
      transaction: sendTx,
      options: {
        showEffects: true,
      },
    });

    expect(result.effects?.status.status).toBe("success");
  });

  it("Get Inbox emails", async () => {
    const inboxId = await mailboxSDK.getMailBoxId(address);

    const emails = await mailboxSDK.readEmails(inboxId!, address);
    expect(emails).toBeDefined;
  });
});

import { SuiClient, SuiObjectResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { SUI_PACKAGE_ID } from "../constants";
import { PostPage, SocialNFT } from "./types";
import { parsePostPage } from "./utils";

export class SocialSDK {
  private packageId: string;
  private suiClient: SuiClient;

  protected constructor(suiClient: SuiClient) {
    this.suiClient = suiClient;
    this.packageId = SUI_PACKAGE_ID;
  }

  public static start(suiClient: SuiClient) {
    return new SocialSDK(suiClient);
  }

  public mint(
    name: string,
    pfp: string,
    bio: string,
    links: string[]
  ): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      target: `${this.packageId}::social::mint_profile`,
      arguments: [
        tx.pure.string(name),
        tx.pure.string(pfp),
        tx.pure.string(bio),
        tx.pure.vector("string", links),
      ],
    });
    return tx;
  }

  updateName = (socialObjectId: string, name: string) => (tx: Transaction) => {
    tx.moveCall({
      target: `${this.packageId}::social_nft::update_name`,
      arguments: [tx.object(socialObjectId), tx.pure.string(name)],
    });
  };

  updatePfp = (socialObjectId: string, pfp: string) => (tx: Transaction) => {
    tx.moveCall({
      target: `${this.packageId}::social_nft::update_pfp`,
      arguments: [tx.object(socialObjectId), tx.pure.string(pfp)],
    });
  };

  updateBio = (socialObjectId: string, bio: string) => (tx: Transaction) => {
    tx.moveCall({
      target: `${this.packageId}::social_nft::update_bio`,
      arguments: [tx.object(socialObjectId), tx.pure.string(bio)],
    });
  };

  addLink = (socialObjectId: string, link: string) => (tx: Transaction) => {
    tx.moveCall({
      target: `${this.packageId}::social_nft::add_link`,
      arguments: [tx.object(socialObjectId), tx.pure.string(link)],
    });
  };

  removeLink = (socialObjectId: string, index: number) => (tx: Transaction) => {
    tx.moveCall({
      target: `${this.packageId}::social_nft::remove_link`,
      arguments: [tx.object(socialObjectId), tx.pure.u64(index)],
    });
  };

  public async getSocialNFT(socialObjectId: string) {
    const { data } = await this.suiClient.getObject({
      id: socialObjectId,
      options: {
        showContent: true,
        showType: true,
        showOwner: true,
      },
    });
    return data;
  }

  public async getOwnedSocialNFT(
    ownerAddress: string
  ): Promise<SocialNFT | null> {
    const { data } = await this.suiClient.getOwnedObjects({
      owner: ownerAddress,
      filter: {
        StructType: `${this.packageId}::social_nft::SocialNFT`,
      },
      options: {
        showContent: true,
        showType: true,
        showOwner: true,
      },
    });

    if (data && data.length > 0) {
      const socialNFTData = data[0].data?.content as any;
      return {
        id: socialNFTData.fields.id.id,
        name: socialNFTData.fields.name,
        pfp: socialNFTData.fields.pfp,
        bio: socialNFTData.fields.bio,
        links: socialNFTData.fields.links,
      };
    }
    return null;
  }

  public newPost(
    socialNFT: string,
    content: string,
    attachment: string = ""
  ): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      target: `${this.packageId}::social::new_post`,
      arguments: [
        tx.object(socialNFT),
        tx.pure.string(content),
        tx.pure.string(attachment),
      ],
    });
    return tx;
  }

  public async getFeedPosts(
    ownerAddress: string,
    page: number | undefined | null = null
  ): Promise<PostPage | undefined> {
    const socialNFT = await this.getOwnedSocialNFT(ownerAddress);
    if (!socialNFT) {
      return undefined;
    }
    const feed = await this.suiClient.getDynamicFieldObject({
      parentId: socialNFT.id,
      name: {
        type: "0x1::string::String",
        value: "feed",
      },
    });
    const feedPage =
      feed.data?.content?.dataType === "moveObject"
        ? feed.data.objectId
        : undefined;

    if (!feedPage) {
      return undefined;
    }
    const pages = await this.suiClient.getDynamicFieldObject({
      parentId: feedPage,
      name: { type: "u64", value: page ? String(page) : "0" },
    });
    const postPages = parsePostPage(pages.data);
    return postPages;
  }
}

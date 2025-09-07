module bubble::social;

use bubble::feed;
use bubble::social_nft::{Self, SocialNFT};
use std::string::String;
use sui::dynamic_object_field as dof;

#[allow(lint(self_transfer))]
public fun mint_profile(
    name: String,
    pfp: String,
    bio: String,
    links: vector<String>,
    ctx: &mut TxContext,
) {
    let mut social = social_nft::mint(name, pfp, bio, links, ctx);

    let new_feed = feed::new_feed(ctx);

    dof::add(social_nft::id_mut(&mut social), b"feed".to_string(), new_feed);

    let sender = tx_context::sender(ctx);

    transfer::public_transfer(social, sender);
}

public fun new_post(
    social: &mut SocialNFT,
    content: String,
    attachment: vector<u8>,
    ctx: &mut TxContext,
) {
    let feed = dof::borrow_mut<String, feed::Feed>(
        social_nft::id_mut(social),
        b"feed".to_string(),
    );
    feed::add_post(feed, content, attachment, ctx);
}

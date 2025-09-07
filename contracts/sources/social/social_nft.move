module bubble::social_nft;

use std::string::String;
use sui::display;
use sui::package;

public struct SOCIAL_NFT has drop {}

public struct SocialNFT has key, store {
    id: UID,
    name: String,
    pfp: String,
    bio: String,
    links: vector<String>,
}

/// Initializes the module and creates the Display object.
fun init(otw: SOCIAL_NFT, ctx: &mut TxContext) {
    let publisher = package::claim(otw, ctx);
    let keys = vector[
        b"name".to_string(),
        b"description".to_string(),
        b"link".to_string(),
        b"image_url".to_string(),
        b"thumbnail_url".to_string(),
        b"project_url".to_string(),
        b"creator".to_string(),
    ];

    let values = vector[
        b"Bubble Profile: {name}".to_string(),
        b"{bio}".to_string(),
        b"https://bubblesui.com/b/{id}".to_string(),
        b"{pfp}".to_string(),
        b"{pfp}".to_string(),
        b"https://bubblesui.com/".to_string(),
        b"Bubble Network".to_string(),
    ];

    let mut display = display::new_with_fields<SocialNFT>(
        &publisher,
        keys,
        values,
        ctx,
    );
    display.update_version();

    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(display, ctx.sender());
}

public(package) fun mint(
    name: String,
    pfp: String,
    bio: String,
    links: vector<String>,
    ctx: &mut TxContext,
): SocialNFT {
    SocialNFT {
        id: object::new(ctx),
        name,
        pfp,
        bio,
        links,
    }
}

public fun id(self: &SocialNFT): &UID {
    &self.id
}

public fun id_mut(self: &mut SocialNFT): &mut UID {
    &mut self.id
}

public fun update_name(self: &mut SocialNFT, name: String) {
    self.name = name;
}

public fun update_pfp(self: &mut SocialNFT, pfp: String) {
    self.pfp = pfp;
}

public fun update_bio(self: &mut SocialNFT, bio: String) {
    self.bio = bio;
}

public fun add_link(self: &mut SocialNFT, link: String) {
    self.links.push_back(link);
}

public fun remove_link(self: &mut SocialNFT, index: u64) {
    self.links.remove(index);
}

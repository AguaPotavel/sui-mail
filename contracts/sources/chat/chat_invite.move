module bubble::chat_invite;

use sui::coin::{Self, Coin};
use sui::display;
use sui::package;
use sui::sui::SUI;
use bubble::chat::ChatRoom;
use bubble::chat_config::{Self, ChatConfig};

const EInsufficientFunds: u64 = 0;
const EInvalidStatus: u64 = 1;


const STATUS_PENDING: u8 = 0;
const STATUS_ACCEPTED: u8 = 1;
const STATUS_DENIED: u8 = 2;

public struct CHAT_INVITE has drop {}

/// A capability to invite someone to a chat.
public struct InviteChatNFT has key, store {
    id: UID,
    from: address,
    to: address,
    status: u8,
    chat_room_id: sui::object::ID,
}

/// Initializes the module and creates the Display object.
fun init(otw: CHAT_INVITE, ctx: &mut TxContext) {
    let publisher = package::claim(otw, ctx);
    let keys = vector[
        b"name".to_string(),
        b"description".to_string(),
        b"link".to_string(),
        b"image_url".to_string(),
        b"thumbnail_url".to_string(),
        b"project_url".to_string(),
        b"creator".to_string(),
        b"status".to_string(),
    ];

    let values = vector[
        b"Chat Invitation NFT".to_string(),
        b"An NFT representing an invitation to a chat.".to_string(),
        b"https://example.com/link_to_invite?invite={id}".to_string(),
        b"https://example.com/chat_invite/{status}.png".to_string(),
        b"https://example.com/thumbnail/{status}.png".to_string(),
        b"https://suichat.com/".to_string(),
        b"Sui Mail".to_string(),
        b"{status}".to_string(),
    ];

    let mut display = display::new_with_fields<InviteChatNFT>(
        &publisher,
        keys,
        values,
        ctx,
    );
    display.update_version();

    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(display, ctx.sender());
}

/// Creates a new chat invitation NFT.
public fun new(
    chat_config: &mut ChatConfig,
    chat_room: &mut ChatRoom,
    to: address,
    payment: &mut Coin<SUI>,
    ctx: &mut TxContext,
) {
    let tax_amount = chat_config::get_invite_tax(chat_config);
    assert!(coin::value(payment) >= tax_amount, EInsufficientFunds);

    let balance = payment.balance_mut().split(tax_amount);
    let tax = balance.into_coin(ctx);

    chat_config.add_balance(tax);

    let from = tx_context::sender(ctx);
    let chat_room_id = object::id(chat_room);

    let invite = InviteChatNFT {
        id: object::new(ctx),
        from,
        to,
        status: STATUS_PENDING,
        chat_room_id,
    };
    transfer::transfer(invite, to);
}

/// Accepts a chat invitation.
public fun accept(self: &mut InviteChatNFT) {
    assert!(self.status == STATUS_PENDING, EInvalidStatus);
    self.status = STATUS_ACCEPTED;
}

/// Denies a chat invitation.
public fun deny(self: &mut InviteChatNFT) {
    assert!(self.status == STATUS_PENDING, EInvalidStatus);
    self.status = STATUS_DENIED;
}

/// Returns the sender of the invitation.
public fun from(self: &InviteChatNFT): address {
    self.from
}

/// Returns the recipient of the invitation.
public fun to(self: &InviteChatNFT): address {
    self.to
}

/// Returns the current status of the invitation.
public fun status(self: &InviteChatNFT): u8 {
    self.status
}

/// Returns the chat room ID of the invitation.
public fun chat_room_id(self: &InviteChatNFT): sui::object::ID {
    self.chat_room_id
}

/// Destroys the invitation NFT.
public fun destroy(self: InviteChatNFT) {
    let InviteChatNFT { id, from: _, to: _, status: _, chat_room_id: _ } = self;
    object::delete(id);
}

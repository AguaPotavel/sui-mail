module bubble::events;

public struct MessageSent has copy, drop, store {
    chat_room_id: sui::object::ID,
    sender: address,
    message_index: u64,
}

public struct EmailSent has copy, drop, store {
    inbox_id: sui::object::ID,
    sender: address,
    recipient: address,
    email_index: u64,
}

public fun emit_message_sent(chat_room_id: sui::object::ID, sender: address, message_index: u64) {
    sui::event::emit(MessageSent {
        chat_room_id,
        sender,
        message_index,
    });
}

public fun emit_email_sent(
    inbox_id: sui::object::ID,
    sender: address,
    recipient: address,
    email_index: u64,
) {
    sui::event::emit(EmailSent {
        inbox_id,
        sender,
        recipient,
        email_index,
    });
}

public struct SocialNftMinted has copy, drop, store {
    social_id: sui::object::ID,
    minter: address,
}

public fun emit_social_nft_minted(social_id: sui::object::ID, minter: address) {
    sui::event::emit(SocialNftMinted {
        social_id,
        minter,
    });
}

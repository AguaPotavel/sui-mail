module bubble::chat;

use std::vector::{empty, push_back, length};
use sui::coin::{Self, Coin};
use sui::sui::SUI;
use bubble::chat_config::ChatConfig;
use bubble::events;

const EInsufficientFunds: u64 = 0;

public struct Message has copy, drop, store {
    sender: address,
    content: vector<u8>,
    timestamp: u64,
}

public struct ChatRoom has key {
    id: UID,
    messages: vector<Message>,
}

public fun create_chat_room(chat_config: &mut ChatConfig, payment: Coin<SUI>, ctx: &mut TxContext) {
    let tax_amount = chat_config.get_create_chat_tax();
    handle_payment(chat_config, payment, tax_amount, ctx);

    let chat_room = ChatRoom {
        id: object::new(ctx),
        messages: empty(),
    };
    transfer::transfer(chat_room, tx_context::sender(ctx));
}

public fun send_chat_message(
    chat_config: &mut ChatConfig,
    chat_room: &mut ChatRoom,
    content: vector<u8>,
    payment: Coin<SUI>,
    ctx: &mut TxContext,
) {
    let tax_amount = chat_config.get_send_message_tax();
    handle_payment(chat_config, payment, tax_amount, ctx);

    let sender = tx_context::sender(ctx);
    let timestamp = tx_context::epoch_timestamp_ms(ctx);

    push_back(
        &mut chat_room.messages,
        Message {
            sender,
            content,
            timestamp,
        },
    );

    events::emit_message_sent(
        object::id(chat_room),
        sender,
        length(&chat_room.messages) - 1,
    );
}

public fun read_chat_messages(chat_room: &ChatRoom): &vector<Message> {
    &chat_room.messages
}

public fun clear_chat_messages(chat_room: &mut ChatRoom) {
    chat_room.messages = empty();
}

#[allow(lint(self_transfer))]
fun handle_payment(
    config: &mut ChatConfig,
    mut payment: Coin<SUI>,
    tax_amount: u64,
    ctx: &mut TxContext,
) {
    assert!(coin::value(&payment) >= tax_amount, EInsufficientFunds);

    let tax = coin::split<SUI>(&mut payment, tax_amount, ctx);
    config.add_balance(tax);

    if (coin::value<SUI>(&payment) > 0) {
        transfer::public_transfer(payment, tx_context::sender(ctx));
    } else {
        coin::destroy_zero<SUI>(payment);
    }
}

module bubble::mailbox;

use std::vector::{empty, push_back, length};
use sui::coin::{Self, Coin};
use sui::sui::SUI;
use bubble::events;
use bubble::mailbox_config::MailboxConfig;
use bubble::mailbox_global::{Self, MailboxGlobal};

const EInsufficientFunds: u64 = 0;

public struct Email has copy, drop, store {
    sender: address,
    recipient: address,
    subject: vector<u8>,
    content: vector<u8>,
    timestamp: u64,
}

public struct Inbox has key {
    id: UID,
    emails: vector<Email>,
}

public fun create_inbox(
    mailbox_global: &mut MailboxGlobal,
    config: &mut MailboxConfig,
    payment: Coin<SUI>,
    ctx: &mut TxContext,
) {
    let tax_amount = config.get_create_mailbox_tax();

    handle_payment(config, payment, tax_amount, ctx);

    let inbox = Inbox {
        id: object::new(ctx),
        emails: empty(),
    };
    let sender = tx_context::sender(ctx);

    let inbox_id = object::id<Inbox>(&inbox);

    transfer::share_object(inbox);

    mailbox_global::register_mailbox(mailbox_global, sender, inbox_id);
}

public fun send_email(
    config: &mut MailboxConfig,
    inbox: &mut Inbox,
    recipient: address,
    subject: vector<u8>,
    content: vector<u8>,
    payment: Coin<SUI>,
    ctx: &mut TxContext,
) {
    let tax_amount = config.get_store_message_tax();

    handle_payment(config, payment, tax_amount, ctx);

    let sender = tx_context::sender(ctx);
    let timestamp = tx_context::epoch_timestamp_ms(ctx);

    push_back(
        &mut inbox.emails,
        Email {
            sender,
            recipient,
            subject,
            content,
            timestamp,
        },
    );

    events::emit_email_sent(
        object::id(inbox),
        sender,
        recipient,
        length(&inbox.emails) - 1,
    );
}

public fun read_emails(inbox: &Inbox): &vector<Email> {
    &inbox.emails
}

public fun clear_emails(inbox: &mut Inbox) {
    inbox.emails = empty();
}

public fun get_mailbox_id(mailbox_global: &MailboxGlobal, user_address: address): ID {
    mailbox_global::get_mailbox_id(mailbox_global, user_address)
}

#[allow(lint(self_transfer))]
fun handle_payment(
    config: &mut MailboxConfig,
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

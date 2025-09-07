module bubble::mailbox_global;

use sui::table::{Self, Table};

const EMailboxAlreadyExists: u64 = 1;

public struct MailboxGlobal has key {
    id: UID,
    mailboxes: Table<address, ID>,
}

fun init(ctx: &mut TxContext) {
    let mailbox_global = MailboxGlobal {
        id: object::new(ctx),
        mailboxes: table::new(ctx),
    };
    transfer::share_object(mailbox_global);
}

public(package) fun register_mailbox(
    mailbox_global: &mut MailboxGlobal,
    user_address: address,
    mailbox_id: ID,
) {
    assert!(!table::contains(&mailbox_global.mailboxes, user_address), EMailboxAlreadyExists);
    table::add(&mut mailbox_global.mailboxes, user_address, mailbox_id);
}

public(package) fun get_mailbox_id(mailbox_global: &MailboxGlobal, user_address: address): ID {
    *table::borrow(&mailbox_global.mailboxes, user_address)
}

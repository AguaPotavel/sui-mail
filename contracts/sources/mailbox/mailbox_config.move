module bubble::mailbox_config;

use sui::balance::{Self, Balance};
use sui::coin::{Self, Coin};
use sui::sui::SUI;

public struct MailBoxAdminCap has key, store {
    id: UID,
}

public struct MailboxConfig has key, store {
    id: UID,
    create_mailbox_tax: u64,
    store_message_tax: u64,
    balance: Balance<SUI>,
}

// Function to initialize the MailboxConfig object
// This function is called once when the package is published.
fun init(ctx: &mut TxContext) {
    let admin_cap = MailBoxAdminCap {
        id: object::new(ctx),
    };
    transfer::transfer(admin_cap, tx_context::sender(ctx));

    let config = MailboxConfig {
        id: object::new(ctx),
        create_mailbox_tax: 1000, // Default tax for creating a mailbox (e.g., 0.001 SUI)
        store_message_tax: 10, // Default tax for storing a message (e.g., 0.00001 SUI)
        balance: balance::zero<SUI>(),
    };
    transfer::share_object(config);
}

// Public function to update the create_mailbox_tax
public fun update_create_mailbox_tax(
    config: &mut MailboxConfig,
    _cap: &MailBoxAdminCap,
    new_tax: u64,
    _ctx: &TxContext,
) {
    config.create_mailbox_tax = new_tax;
}

// Public function to update the store_message_tax
public fun update_store_message_tax(
    config: &mut MailboxConfig,
    _cap: &MailBoxAdminCap,
    new_tax: u64,
    _ctx: &TxContext,
) {
    config.store_message_tax = new_tax;
}

// Public function to add balance to the config object
public fun add_balance(config: &mut MailboxConfig, payment: Coin<SUI>) {
    coin::put<SUI>(&mut config.balance, payment);
}

// Public function to withdraw balance from the config object
public fun withdraw_balance(
    config: &mut MailboxConfig,
    _cap: &MailBoxAdminCap,
    amount: u64,
    ctx: &mut TxContext,
): Coin<SUI> {
    coin::take<SUI>(&mut config.balance, amount, ctx)
}

// Public view function to get the create_mailbox_tax
public fun get_create_mailbox_tax(config: &MailboxConfig): u64 {
    config.create_mailbox_tax
}

// Public view function to get the store_message_tax
public fun get_store_message_tax(config: &MailboxConfig): u64 {
    config.store_message_tax
}

// Public view function to get the current balance of the config object
public fun get_balance(config: &MailboxConfig): u64 {
    balance::value<SUI>(&config.balance)
}

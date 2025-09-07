module bubble::chat_config;

use sui::balance::{Self, Balance};
use sui::coin::{Self, Coin};
use sui::sui::SUI;

public struct ChatAdminCap has key, store {
    id: UID,
}

public struct ChatConfig has key, store {
    id: UID,
    create_chat_tax: u64,
    send_message_tax: u64,
    invite_tax: u64,
    balance: Balance<SUI>,
}

// Function to initialize the ChatConfig object
// This function is called once when the package is published.
fun init(ctx: &mut TxContext) {
    let admin_cap = ChatAdminCap {
        id: object::new(ctx),
    };
    transfer::transfer(admin_cap, tx_context::sender(ctx));

    let config = ChatConfig {
        id: object::new(ctx),
        create_chat_tax: 500, // Default tax for creating a chat (e.g., 0.0005 SUI)
        send_message_tax: 5, // Default tax for sending a message (e.g., 0.000005 SUI)
        invite_tax: 10,
        balance: balance::zero<SUI>(),
    };
    transfer::share_object(config);
}

// Public function to update the create_chat_tax
public fun update_create_chat_tax(
    config: &mut ChatConfig,
    _cap: &ChatAdminCap,
    new_tax: u64,
    _ctx: &TxContext,
) {
    config.create_chat_tax = new_tax;
}

// Public function to update the send_message_tax
public fun update_send_message_tax(
    config: &mut ChatConfig,
    _cap: &ChatAdminCap,
    new_tax: u64,
    _ctx: &TxContext,
) {
    config.send_message_tax = new_tax;
}

// Public function to update the invite_tax
public fun update_invite_tax(
    config: &mut ChatConfig,
    _cap: &ChatAdminCap,
    new_tax: u64,
    _ctx: &TxContext,
) {
    config.invite_tax = new_tax;
}

// Public function to add balance to the config object
public fun add_balance(config: &mut ChatConfig, payment: Coin<SUI>) {
    coin::put<SUI>(&mut config.balance, payment);
}

// Public function to withdraw balance from the config object
public fun withdraw_balance(
    config: &mut ChatConfig,
    _cap: &ChatAdminCap,
    amount: u64,
    ctx: &mut TxContext,
): Coin<SUI> {
    coin::take<SUI>(&mut config.balance, amount, ctx)
}

// Public view function to get the create_chat_tax
public fun get_create_chat_tax(config: &ChatConfig): u64 {
    config.create_chat_tax
}

// Public view function to get the send_message_tax
public fun get_send_message_tax(config: &ChatConfig): u64 {
    config.send_message_tax
}

// Public view function to get the invite_tax
public fun get_invite_tax(config: &ChatConfig): u64 {
    config.invite_tax
}

// Public view function to get the current balance of the config object
public fun get_balance(config: &ChatConfig): u64 {
    balance::value<SUI>(&config.balance)
}

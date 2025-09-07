module bubble::feed;

use std::string::String;
use sui::dynamic_object_field as dof;

const MAX_POSTS_PER_PAGE: u64 = 10;

/// A struct representing a single feed post.
public struct Feed has key, store {
    id: UID,
    publisher: address,
    timestamp: u64,
    page_count: u64, // Total de páginas
    latest_page: Option<ID>, // ID da última página
}

public struct PostPage has key, store {
    id: UID,
    posts: vector<Post>, // Posts nesta página
    next_page: Option<ID>, // ID da próxima página
}

public struct Post has key, store {
    id: UID,
    content: String,
    attachment: vector<u8>,
    timestamp: u64,
}

/// Creates a new feed post.
public(package) fun new_feed(ctx: &mut TxContext): Feed {
    Feed {
        id: object::new(ctx),
        publisher: tx_context::sender(ctx),
        timestamp: tx_context::epoch_timestamp_ms(ctx),
        page_count: 0,
        latest_page: option::none(),
    }
}

public fun add_post(feed: &mut Feed, content: String, attachment: vector<u8>, ctx: &mut TxContext) {
    let post = Post {
        id: object::new(ctx),
        content,
        attachment,
        timestamp: tx_context::epoch_timestamp_ms(ctx),
    };

    if (
        option::is_none(&feed.latest_page) || 
            vector::length(borrow_posts_in_page(feed, feed.page_count - 1)) >= MAX_POSTS_PER_PAGE
    ) { create_new_page(feed, ctx); };
    let page_index: u64 = feed.page_count - 1;
    add_post_to_page(feed, page_index, post);
}

fun create_new_page(feed: &mut Feed, ctx: &mut TxContext) {
    let new_page = PostPage {
        id: object::new(ctx),
        posts: vector::empty(),
        next_page: option::none(),
    };
    let new_page_id = object::id<PostPage>(&new_page);

    if (feed.page_count > 0) {
        let last_page: &mut PostPage = dof::borrow_mut<u64, PostPage>(
            &mut feed.id,
            feed.page_count - 1,
        );

        last_page.next_page = option::some(new_page_id);
    };
    dof::add(&mut feed.id, feed.page_count, new_page);
    feed.page_count = feed.page_count + 1;
    feed.latest_page = option::some(new_page_id);
}

// Adicionar post a uma página específica
fun add_post_to_page(feed: &mut Feed, page_index: u64, post: Post) {
    let page: &mut PostPage = dof::borrow_mut<u64, PostPage>(
        &mut feed.id,
        page_index,
    );
    vector::push_back(&mut page.posts, post);
}

public fun borrow_posts_in_page(feed: &Feed, page_index: u64): &vector<Post> {
    assert!(page_index < feed.page_count, 0);
    let page: &PostPage = dof::borrow<u64, PostPage>(&feed.id, page_index);
    &page.posts
}

// Obter o ID de uma página específica
public fun get_page_id(feed: &Feed, page_index: u64): ID {
    assert!(page_index < feed.page_count, 0);
    let page: &PostPage = dof::borrow<u64, PostPage>(&feed.id, page_index);
    object::id(page)
}

// Obter o ID da próxima página a partir de uma página atual
public fun get_next_page_id(page: &PostPage): Option<ID> {
    page.next_page
}

/// Helper function to get the publisher of a feed.
public fun publisher(feed: &Feed): address {
    feed.publisher
}

/// Helper function to get the timestamp of a feed.
public fun timestamp(feed: &Feed): u64 {
    feed.timestamp
}

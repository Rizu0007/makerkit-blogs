/*
 * -------------------------------------------------------
 * Blog Schema Migration
 * This migration adds blog functionality to the application
 * -------------------------------------------------------
 */

-- Create posts table
create table if not exists
    public.posts
(
    id          uuid unique  not null default extensions.uuid_generate_v4(),
    title       text         not null,
    body        text         not null,
    author_id   uuid         not null references public.accounts(id) on delete cascade,
    created_at  timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at  timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (id)
);

comment on table public.posts is 'Blog posts created by users';
comment on column public.posts.title is 'The title of the blog post';
comment on column public.posts.body is 'The full content/body of the blog post';
comment on column public.posts.author_id is 'The user (account) who authored this post';
comment on column public.posts.created_at is 'The timestamp when the post was created';
comment on column public.posts.updated_at is 'The timestamp when the post was last updated';

-- Enable RLS on posts table
alter table public.posts enable row level security;

-- RLS Policies for posts table

-- SELECT (read): Anyone can read all posts
create policy posts_read on public.posts
    for select
    using (true);

-- INSERT (create): Only authenticated users can create posts
create policy posts_create on public.posts
    for insert
    to authenticated
    with check (
        author_id = auth.uid()
    );

-- UPDATE: Only the author can update their own posts
create policy posts_update on public.posts
    for update
    to authenticated
    using (author_id = auth.uid())
    with check (author_id = auth.uid());

-- DELETE: Only the author can delete their own posts
create policy posts_delete on public.posts
    for delete
    to authenticated
    using (author_id = auth.uid());

-- Grant permissions on posts table
grant select, insert, update, delete on table public.posts to authenticated;
grant select on table public.posts to anon;

-- Create index on author_id for faster queries
create index if not exists posts_author_id_idx on public.posts(author_id);

-- Create index on created_at for faster sorting
create index if not exists posts_created_at_idx on public.posts(created_at desc);

-- Create a function to automatically update updated_at timestamp
create or replace function kit.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql security definer set search_path = '';

-- Create trigger to automatically update updated_at on posts
create trigger posts_updated_at
    before update on public.posts
    for each row
    execute function kit.handle_updated_at();

-- Insert some seed data for testing (optional - can be removed)
insert into public.posts (title, body, author_id)
select
    'Welcome to Our Blog',
    'This is the first blog post. Welcome to our blogging platform! This platform allows authenticated users to create, edit, and share their thoughts with the world. We hope you enjoy using it.',
    id
from public.accounts
limit 1;

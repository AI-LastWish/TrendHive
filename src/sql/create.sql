CREATE TABLE posts (
    id VARCHAR(50) PRIMARY KEY,         -- Reddit post ID, unique identifier
    title TEXT NOT NULL,                -- Title of the post
    url TEXT NOT NULL,                  -- URL of the post
    score INT NOT NULL,                 -- Score of the post (upvotes - downvotes)
    created_at TIMESTAMP NOT NULL,      -- Timestamp when the post was created, converted from Unix time
    author VARCHAR(100) NOT NULL        -- Author of the post
);
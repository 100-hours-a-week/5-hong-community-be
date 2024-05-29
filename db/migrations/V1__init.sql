-- 회원 테이블
CREATE TABLE IF NOT EXISTS member
(
    member_id     BIGINT       NOT NULL AUTO_INCREMENT,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password      VARCHAR(255) NOT NULL,
    nickname      VARCHAR(255) NOT NULL UNIQUE,
    profile_image VARCHAR(255),
    is_active     BOOLEAN DEFAULT TRUE,
    created_at    DATETIME(6),
    PRIMARY KEY (member_id)
) ENGINE = INNODB;

-- 게시글 테이블
CREATE TABLE IF NOT EXISTS post
(
    post_id    BIGINT       NOT NULL AUTO_INCREMENT,
    member_id  BIGINT,
    title      VARCHAR(255) NOT NULL,
    contents   LONGTEXT     NOT NULL,
    thumbnail  VARCHAR(255),
    created_at DATETIME(6),
    is_visible BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (post_id),
    FOREIGN KEY (member_id) REFERENCES member (member_id)
) ENGINE = INNODB;

-- 댓글 테이블
CREATE TABLE IF NOT EXISTS comment
(
    comment_id BIGINT   NOT NULL AUTO_INCREMENT,
    member_id  BIGINT,
    post_id    BIGINT,
    contents   LONGTEXT NOT NULL,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at DATETIME(6),
    PRIMARY KEY (comment_id),
    FOREIGN KEY (member_id) REFERENCES member (member_id),
    FOREIGN KEY (post_id) REFERENCES post (post_id)
) ENGINE = INNODB;

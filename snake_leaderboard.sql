
-- SQL structure for snake leaderboard
CREATE DATABASE IF NOT EXISTS snake_leaderboard;
USE snake_leaderboard;

CREATE TABLE IF NOT EXISTS leaderboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    picture_url VARCHAR(255),
    score INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO leaderboard (name, picture_url, score) VALUES
('player1.SIGN', 'uploads/player1.jpg', 120),
('player2.SIGN', 'uploads/player2.jpg', 95),
('player3.SIGN', 'uploads/player3.jpg', 80);

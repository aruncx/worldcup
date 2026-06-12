-- PostgreSQL Schema Definitions for WorldCupHub
-- This file is provided for reference if you decide to set up a database in the future.
-- By default, the app is now 100% database-free and stores data in browser cookies.

-- Create predictions table
CREATE TABLE IF NOT EXISTS predictions (
    user_id VARCHAR(255) NOT NULL,
    match_id VARCHAR(255) NOT NULL,
    home_score INTEGER NOT NULL,
    away_score INTEGER NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, match_id)
);

-- Create tournament predictions table
CREATE TABLE IF NOT EXISTS tournament_predictions (
    user_id VARCHAR(255) NOT NULL PRIMARY KEY,
    winner_team_id VARCHAR(255) NOT NULL,
    golden_boot_player_id VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create followed teams table
CREATE TABLE IF NOT EXISTS followed_teams (
    user_id VARCHAR(255) NOT NULL,
    team_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, team_id)
);

-- Create followed players table
CREATE TABLE IF NOT EXISTS followed_players (
    user_id VARCHAR(255) NOT NULL,
    player_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, player_id)
);

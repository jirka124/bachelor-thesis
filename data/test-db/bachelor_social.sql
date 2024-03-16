-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Počítač: 127.0.0.1
-- Vytvořeno: Sob 16. bře 2024, 17:32
-- Verze serveru: 10.4.27-MariaDB-log
-- Verze PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databáze: `bachelor_social`
--

-- --------------------------------------------------------

--
-- Struktura tabulky `friendship`
--

CREATE TABLE `friendship` (
  `friend_1` int(11) NOT NULL,
  `friend_2` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Vypisuji data pro tabulku `friendship`
--

INSERT INTO `friendship` (`friend_1`, `friend_2`, `date`) VALUES
(1, 1, '2024-03-02 17:24:17'),
(1, 2, '2024-01-19 16:53:17');

-- --------------------------------------------------------

--
-- Struktura tabulky `post`
--

CREATE TABLE `post` (
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Vypisuji data pro tabulku `post`
--

INSERT INTO `post` (`post_id`, `user_id`, `content`, `date`) VALUES
(1, 2, 'Ahoj toto je testovací post', '2024-01-16 11:30:51'),
(2, 1, 'My own post to be seen', '2024-01-17 12:34:32'),
(3, 1, 'My very first post by app interface', '2024-01-17 16:57:32');

-- --------------------------------------------------------

--
-- Struktura tabulky `post_comment`
--

CREATE TABLE `post_comment` (
  `post_comment_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Vypisuji data pro tabulku `post_comment`
--

INSERT INTO `post_comment` (`post_comment_id`, `post_id`, `user_id`, `content`, `date`) VALUES
(1, 2, 2, 'Toto je velice krásný příspěvek.', '2024-01-17 15:51:22'),
(2, 2, 2, 'Děkuji mnohokrát příteli Růte.', '2024-01-17 15:58:17'),
(3, 1, 1, 'Čáááuko', '2024-01-17 16:22:42'),
(4, 1, 1, 'zdravííím', '2024-01-17 16:23:55'),
(5, 1, 1, 'Hm hmm....', '2024-01-17 16:24:34'),
(6, 1, 1, 'Joo už dobrý.', '2024-01-17 16:27:14'),
(7, 1, 1, 'F', '2024-01-17 16:28:38'),
(8, 1, 1, 'Z profilu 1.', '2024-01-19 15:32:20');

-- --------------------------------------------------------

--
-- Struktura tabulky `post_like`
--

CREATE TABLE `post_like` (
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Vypisuji data pro tabulku `post_like`
--

INSERT INTO `post_like` (`post_id`, `user_id`, `date`) VALUES
(2, 2, '2024-01-17 13:43:09'),
(3, 1, '2024-01-17 16:57:38');

-- --------------------------------------------------------

--
-- Struktura tabulky `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- --------------------------------------------------------

--
-- Struktura tabulky `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `login` varchar(32) NOT NULL,
  `password` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL DEFAULT '',
  `avatar` tinyint(4) NOT NULL DEFAULT 1,
  `signup_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Vypisuji data pro tabulku `user`
--

INSERT INTO `user` (`user_id`, `login`, `password`, `description`, `avatar`, `signup_date`) VALUES
(1, 'root', '$2b$10$vTWBJHQrKUuF1mi7oU6Fl.RPpnFQ5GsC/xA1/bkMQWO8BkwH/9UYq', 'Adventurer 🌍 | Storyteller 📖 | Coffee Lover ☕ | Gamer 🎮 Exploring the world one step at a time. Let\'s connect and share our journeys! 🌟 #Wanderlust', 2, '2024-01-16 10:48:48'),
(2, 'root2', '$2b$10$vTWBJHQrKUuF1mi7oU6Fl.RPpnFQ5GsC/xA1/bkMQWO8BkwH/9UYq', 'Dont have any for hell, hmmm', 3, '2024-01-17 12:22:23'),
(4, 'root3', '$2b$10$jmOFp19l/8Z8/je6s2reS.m/hTkaE72sJgKVdheUEObNBe6qOOFrS', '', 1, '2024-01-28 11:21:10');

--
-- Indexy pro exportované tabulky
--

--
-- Indexy pro tabulku `friendship`
--
ALTER TABLE `friendship`
  ADD PRIMARY KEY (`friend_1`,`friend_2`);

--
-- Indexy pro tabulku `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`post_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexy pro tabulku `post_comment`
--
ALTER TABLE `post_comment`
  ADD PRIMARY KEY (`post_comment_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `post_id` (`post_id`);

--
-- Indexy pro tabulku `post_like`
--
ALTER TABLE `post_like`
  ADD PRIMARY KEY (`post_id`,`user_id`);

--
-- Indexy pro tabulku `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexy pro tabulku `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `login` (`login`) USING BTREE;

--
-- AUTO_INCREMENT pro tabulky
--

--
-- AUTO_INCREMENT pro tabulku `post`
--
ALTER TABLE `post`
  MODIFY `post_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pro tabulku `post_comment`
--
ALTER TABLE `post_comment`
  MODIFY `post_comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pro tabulku `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

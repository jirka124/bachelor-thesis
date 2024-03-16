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
-- Databáze: `bachelor_internal`
--

-- --------------------------------------------------------

--
-- Struktura tabulky `attendant`
--

CREATE TABLE `attendant` (
  `attendant_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Vypisuji data pro tabulku `attendant`
--

INSERT INTO `attendant` (`attendant_id`, `class_id`, `name`) VALUES
(1, 1, 'Holub Martin'),
(2, 1, 'Joška Troska'),
(3, 2, 'Albert Gdoule'),
(4, 1, 'Turín Jan (první)'),
(5, 1, 'Turín Jan'),
(7, 4, 'Hulo Doška');

-- --------------------------------------------------------

--
-- Struktura tabulky `class`
--

CREATE TABLE `class` (
  `class_id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `subject` varchar(10) NOT NULL,
  `day` tinyint(4) NOT NULL DEFAULT 0,
  `t_by` time NOT NULL COMMENT 'start of class "hours"',
  `t_till` time NOT NULL COMMENT 'end of class "hours"',
  `recurrence` enum('once','e1week','e2week','e3week') NOT NULL DEFAULT 'once' COMMENT 'repetitions of class',
  `c_by` date NOT NULL COMMENT 'start of class "date"',
  `c_till` date NOT NULL COMMENT 'end of class "date"',
  `min_attend` tinyint(4) NOT NULL DEFAULT 70
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Vypisuji data pro tabulku `class`
--

INSERT INTO `class` (`class_id`, `teacher_id`, `subject`, `day`, `t_by`, `t_till`, `recurrence`, `c_by`, `c_till`, `min_attend`) VALUES
(1, 1, 'AUTSIG', 1, '17:50:00', '18:45:00', 'e1week', '2023-12-23', '2024-02-15', 62),
(2, 1, 'TARTII', 1, '08:30:00', '09:15:00', 'once', '2024-01-06', '2024-02-15', 80),
(3, 1, 'SUB', 0, '19:12:00', '19:12:00', 'once', '2024-01-04', '2024-01-04', 70),
(4, 1, 'SUB2', 5, '19:40:00', '19:59:00', 'e2week', '2024-01-04', '2025-01-04', 85),
(5, 1, 'SUB3', 5, '19:40:00', '19:59:00', 'e2week', '2024-01-04', '2025-01-04', 85),
(6, 1, 'GG', 4, '19:31:00', '19:31:00', 'e3week', '2024-01-04', '2024-01-04', 40);

-- --------------------------------------------------------

--
-- Struktura tabulky `presence`
--

CREATE TABLE `presence` (
  `class_id` int(11) NOT NULL,
  `recurr_id` int(11) NOT NULL,
  `attendant_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Vypisuji data pro tabulku `presence`
--

INSERT INTO `presence` (`class_id`, `recurr_id`, `attendant_id`) VALUES
(1, 1, 1),
(1, 1, 2),
(1, 1, 4),
(1, 1, 5),
(1, 2, 1),
(1, 2, 5),
(1, 3, 1),
(1, 3, 2),
(1, 5, 1),
(1, 5, 2);

-- --------------------------------------------------------

--
-- Struktura tabulky `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Vypisuji data pro tabulku `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('JEse--_Y9oZK3j-VaZplYmT_MUhNfygS', 1710683772, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"secure\":false,\"httpOnly\":false,\"path\":\"/\"},\"teacherId\":1}');

-- --------------------------------------------------------

--
-- Struktura tabulky `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `username` varchar(32) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Vypisuji data pro tabulku `user`
--

INSERT INTO `user` (`user_id`, `username`, `password`, `role`) VALUES
(1, 'root', '$2b$10$41xJQZfRmnuKSIF2ailY1OXHVA5VJzBRF4rzCM0tTZeoHhrtPLmjC', 0);

--
-- Indexy pro exportované tabulky
--

--
-- Indexy pro tabulku `attendant`
--
ALTER TABLE `attendant`
  ADD PRIMARY KEY (`attendant_id`),
  ADD KEY `class_id` (`class_id`);

--
-- Indexy pro tabulku `class`
--
ALTER TABLE `class`
  ADD PRIMARY KEY (`class_id`),
  ADD KEY `teacher_id` (`teacher_id`);

--
-- Indexy pro tabulku `presence`
--
ALTER TABLE `presence`
  ADD PRIMARY KEY (`class_id`,`recurr_id`,`attendant_id`);

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
  ADD KEY `username` (`username`);

--
-- AUTO_INCREMENT pro tabulky
--

--
-- AUTO_INCREMENT pro tabulku `attendant`
--
ALTER TABLE `attendant`
  MODIFY `attendant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pro tabulku `class`
--
ALTER TABLE `class`
  MODIFY `class_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pro tabulku `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

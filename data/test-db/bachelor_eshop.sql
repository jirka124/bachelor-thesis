-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Počítač: 127.0.0.1
-- Vytvořeno: Sob 16. bře 2024, 15:34
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
-- Databáze: `bachelor_eshop`
--

-- --------------------------------------------------------

--
-- Struktura tabulky `admin_account`
--

CREATE TABLE `admin_account` (
  `admin_account_id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `pass` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Vypisuji data pro tabulku `admin_account`
--

INSERT INTO `admin_account` (`admin_account_id`, `name`, `pass`) VALUES
(1, 'root', '$2b$10$C6lHYbIq0nziTteViT5Om.XERtKfwy3u0.XTxVRyJ46bw6Si0kPlm');

-- --------------------------------------------------------

--
-- Struktura tabulky `order_product`
--

CREATE TABLE `order_product` (
  `order_product_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `count` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Vypisuji data pro tabulku `order_product`
--

INSERT INTO `order_product` (`order_product_id`, `product_id`, `count`) VALUES
(1, 1, 12),
(2, 4, 2),
(3, 1, 4),
(4, 3, 15);

-- --------------------------------------------------------

--
-- Struktura tabulky `product`
--

CREATE TABLE `product` (
  `product_id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `description` text NOT NULL DEFAULT '',
  `price` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Vypisuji data pro tabulku `product`
--

INSERT INTO `product` (`product_id`, `name`, `description`, `price`) VALUES
(1, 'Mud of Levit - black 26', 'Futuristic design flower pot of black color, most versitilie color fitting almost any room. Looking both esthetic and interesting.', '369.99'),
(2, 'Mud of Levit - purple', 'Futuristic design flower pot of black color, most versitilie color fitting almost any room. Looking both esthetic and interesting.', '359.99'),
(3, 'Mud of Levit - orange', 'Futuristic design flower pot of black color, most versitilie color fitting almost any room. Looking both esthetic and interesting.', '359.99'),
(4, 'Mud of Levit - khaki', 'Futuristic design flower pot of black color, most versitilie color fitting almost any room. Looking both esthetic and interesting.', '359.99');

-- --------------------------------------------------------

--
-- Struktura tabulky `product_feature`
--

CREATE TABLE `product_feature` (
  `product_id` int(11) NOT NULL,
  `f_key` varchar(32) NOT NULL,
  `f_value` varchar(128) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Vypisuji data pro tabulku `product_feature`
--

INSERT INTO `product_feature` (`product_id`, `f_key`, `f_value`) VALUES
(1, 'Inner pot size', '10x8x8cm'),
(1, 'Max. levitatation height', '10cm'),
(1, 'Max. weight', '4kg'),
(1, 'Outer pot size', '12x14x14cm'),
(1, 'Pot base size', '5x20x20cm');

-- --------------------------------------------------------

--
-- Struktura tabulky `product_review`
--

CREATE TABLE `product_review` (
  `product_review_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `stars` tinyint(4) NOT NULL,
  `text` text NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

--
-- Vypisuji data pro tabulku `product_review`
--

INSERT INTO `product_review` (`product_review_id`, `product_id`, `stars`, `text`) VALUES
(1, 1, 5, 'Overally I\'m very satisfied with the product, came in little to no time and lasted for years without any issues noticed.'),
(2, 1, 2, 'When is comes to system, nothing bad to say. But the design could be improved...'),
(3, 1, 2, ' Okay, here is my honest review on this product. It\'s just awesome! Buy now :D'),
(4, 1, 1, 'I don\'t like it for any reason!'),
(5, 3, 4, '☫ What a lovely piece of color it has ☫'),
(6, 2, 5, 'It works as it should work, it looks as it should look. The problem is it doesn\'t talk at all ♫');

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
-- Indexy pro exportované tabulky
--

--
-- Indexy pro tabulku `admin_account`
--
ALTER TABLE `admin_account`
  ADD PRIMARY KEY (`admin_account_id`);

--
-- Indexy pro tabulku `order_product`
--
ALTER TABLE `order_product`
  ADD PRIMARY KEY (`order_product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexy pro tabulku `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `name` (`name`),
  ADD KEY `price` (`price`);

--
-- Indexy pro tabulku `product_feature`
--
ALTER TABLE `product_feature`
  ADD PRIMARY KEY (`product_id`,`f_key`);

--
-- Indexy pro tabulku `product_review`
--
ALTER TABLE `product_review`
  ADD PRIMARY KEY (`product_review_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexy pro tabulku `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- AUTO_INCREMENT pro tabulky
--

--
-- AUTO_INCREMENT pro tabulku `admin_account`
--
ALTER TABLE `admin_account`
  MODIFY `admin_account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pro tabulku `order_product`
--
ALTER TABLE `order_product`
  MODIFY `order_product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pro tabulku `product`
--
ALTER TABLE `product`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT pro tabulku `product_review`
--
ALTER TABLE `product_review`
  MODIFY `product_review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Omezení pro exportované tabulky
--

--
-- Omezení pro tabulku `order_product`
--
ALTER TABLE `order_product`
  ADD CONSTRAINT `order_product_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Omezení pro tabulku `product_feature`
--
ALTER TABLE `product_feature`
  ADD CONSTRAINT `product_feature_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Omezení pro tabulku `product_review`
--
ALTER TABLE `product_review`
  ADD CONSTRAINT `product_review_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

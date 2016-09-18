-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Dim 18 Septembre 2016 à 16:27
-- Version du serveur :  5.6.16
-- Version de PHP :  5.5.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `pvp`
--

-- --------------------------------------------------------

--
-- Structure de la table `items`
--

CREATE TABLE IF NOT EXISTS `items` (
  `id_i` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `level` int(11) NOT NULL,
  `HP` int(11) NOT NULL,
  `AP` int(11) NOT NULL,
  `MP` int(11) NOT NULL,
  `range` int(11) NOT NULL,
  `initiative` int(11) NOT NULL,
  `CH` int(11) NOT NULL,
  `power` int(11) NOT NULL,
  `damage` int(11) NOT NULL,
  `heal` int(11) NOT NULL,
  `damheal` int(11) NOT NULL,
  `resistance` int(11) NOT NULL,
  `damresistance` int(11) NOT NULL,
  `APloss` int(11) NOT NULL,
  `MPloss` int(11) NOT NULL,
  `APresistance` int(11) NOT NULL,
  `MPresistance` int(11) NOT NULL,
  `lock` int(11) NOT NULL,
  `dodgle` int(11) NOT NULL,
  `erosion` int(11) NOT NULL,
  PRIMARY KEY (`id_i`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Contenu de la table `items`
--

INSERT INTO `items` (`id_i`, `name`, `level`, `HP`, `AP`, `MP`, `range`, `initiative`, `CH`, `power`, `damage`, `heal`, `damheal`, `resistance`, `damresistance`, `APloss`, `MPloss`, `APresistance`, `MPresistance`, `lock`, `dodgle`, `erosion`) VALUES
(3, 'Lolilol', 20, 666, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(4, 'Le stuff de la mort', 10, 33, 1, 1, 2, 0, 0, -10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(5, 'Item de malade', 3, 15, 0, 0, 2, 0, 20, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `spells`
--

CREATE TABLE IF NOT EXISTS `spells` (
  `id_s` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `AP` int(11) DEFAULT NULL,
  `minRange` int(11) DEFAULT NULL,
  `maxRange` int(11) DEFAULT NULL,
  `modifiableRange` tinyint(1) DEFAULT NULL,
  `sight` tinyint(1) DEFAULT NULL,
  `countdown` int(11) DEFAULT NULL,
  `initCountdown` int(11) DEFAULT NULL,
  `turnUse` int(11) DEFAULT NULL,
  `freeCell` tinyint(1) DEFAULT NULL,
  `CH` int(11) DEFAULT NULL,
  `AOE` text,
  `axis` varchar(255) DEFAULT NULL,
  `effect` text,
  `CHeffect` text,
  PRIMARY KEY (`id_s`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Contenu de la table `spells`
--

INSERT INTO `spells` (`id_s`, `name`, `level`, `AP`, `minRange`, `maxRange`, `modifiableRange`, `sight`, `countdown`, `initCountdown`, `turnUse`, `freeCell`, `CH`, `AOE`, `axis`, `effect`, `CHeffect`) VALUES
(1, 'Attaque classique', 49, 3, 1, 5, 0, 1, 0, 0, 0, 0, 10, '[[1]]', 'all', NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id_u` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `token` text,
  `elo` int(11) DEFAULT NULL,
  `golds` int(11) DEFAULT NULL,
  `gems` int(11) DEFAULT NULL,
  `win` int(11) DEFAULT NULL,
  `lose` int(11) DEFAULT NULL,
  `draw` int(11) DEFAULT NULL,
  `registration` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_u`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Contenu de la table `users`
--

INSERT INTO `users` (`id_u`, `login`, `password`, `token`, `elo`, `golds`, `gems`, `win`, `lose`, `draw`, `registration`) VALUES
(1, 'vincent', '123', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibG9naW4iOiJ2aW5jZW50IiwicGFzc3dvcmQiOiIxMjMiLCJpYXQiOjE0NzI5MzY5MTZ9.-pPrqRTBJUMuI7t9mPLjch4yi-Tr_Wk5s7BDkZT2HfA', 1500, 53200, 3, 0, 0, 0, 1472936916),
(2, 'bazia', '123', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibG9naW4iOiJiYXppYSIsInBhc3N3b3JkIjoiMTIzIiwiaWF0IjoxNDczMTgzMzcwfQ.CtguT9p3CE9SVq8RD0nAVUd5UqkzsnEmBtnIltorPKg', 1500, 20, 0, 0, 0, 0, 1473183370);

-- --------------------------------------------------------

--
-- Structure de la table `user_item`
--

CREATE TABLE IF NOT EXISTS `user_item` (
  `id_ui` int(11) NOT NULL AUTO_INCREMENT,
  `id_u` int(11) DEFAULT NULL,
  `id_i` int(11) DEFAULT NULL,
  `equiped` tinyint(1) DEFAULT NULL,
  `position` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_ui`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `user_spell`
--

CREATE TABLE IF NOT EXISTS `user_spell` (
  `id_us` int(11) NOT NULL AUTO_INCREMENT,
  `id_u` int(11) DEFAULT NULL,
  `id_s` int(11) DEFAULT NULL,
  `equiped` tinyint(1) DEFAULT NULL,
  `position` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_us`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Contenu de la table `user_spell`
--

INSERT INTO `user_spell` (`id_us`, `id_u`, `id_s`, `equiped`, `position`) VALUES
(1, 1, 1, 1, 0),
(2, 2, 1, 0, 0);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 04, 2020 at 03:51 PM
-- Server version: 10.4.13-MariaDB
-- PHP Version: 7.4.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tuveshopdata`
--

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `customerNumber` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `amountPurchased` int(11) NOT NULL,
  `purchaseDate` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `productId` int(11) NOT NULL,
  `productName` varchar(128) NOT NULL,
  `consoleType` varchar(50) NOT NULL,
  `info` varchar(300) NOT NULL,
  `price` int(11) NOT NULL,
  `imgPath` varchar(64) NOT NULL,
  `amountInStock` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userName` varchar(100) NOT NULL,
  `password` varchar(128) NOT NULL,
  `adminStatus` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userName`, `password`, `adminStatus`) VALUES
('David', '$2a$12$fTGl.Mtbgukp2IXGMWOuieXIL7lTXzJ8ZThDCvtu3bfXuwaMBZgpq', 0),
('Nader', '$2a$12$VDUtJFEFJaETX6K8bWYQIOnyOG8MJi8V9C7bTntqPjSp7S2BFWiH6', 0),
('Tim', '$2a$12$iXZQ7J5/yCMeCbaIb3CxWen4dYZSMgr.AN2s3txEqdyGL/KCZEFhi', 0);

-- --------------------------------------------------------

--
-- Table structure for table `userinfo`
--

CREATE TABLE `userinfo` (
  `customerNumber` int(11) NOT NULL,
  `userName` varchar(100) NOT NULL,
  `email` varchar(120) NOT NULL,
  `phoneNumber` varchar(10) NOT NULL,
  `address` varchar(128) CHARACTER SET utf8 COLLATE utf8_swedish_ci NOT NULL,
  `zipCode` int(5) NOT NULL,
  `city` varchar(50) CHARACTER SET utf8 COLLATE utf8_swedish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `userinfo`
--

INSERT INTO `userinfo` (`customerNumber`, `userName`, `email`, `phoneNumber`, `address`, `zipCode`, `city`) VALUES
(23, 'David', 'd@g.c', '0723837720', 'HejGata 6A', 16393, 'Växjö'),
(24, 'Tim', 't@g.c', '0742325630', 'HejGata 1A', 16393, 'Växjö'),
(25, 'Nader', 'n@g.c', '0754099278', 'HejGata 3A', 16393, 'Växjö');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`productId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userName`);

--
-- Indexes for table `userinfo`
--
ALTER TABLE `userinfo`
  ADD PRIMARY KEY (`customerNumber`),
  ADD KEY `userinfo_ibfk_1` (`userName`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `productId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `userinfo`
--
ALTER TABLE `userinfo`
  MODIFY `customerNumber` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `userinfo`
--
ALTER TABLE `userinfo`
  ADD CONSTRAINT `userinfo_ibfk_1` FOREIGN KEY (`userName`) REFERENCES `user` (`userName`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

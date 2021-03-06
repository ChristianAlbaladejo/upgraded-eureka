-- MySQL Script generated by MySQL Workbench
-- Wed Jul  8 13:32:26 2020
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS
, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS
, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE
, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema SISTEMA
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS`heroku_2205e3ccffad011`
;

-- -----------------------------------------------------
-- Schema SISTEMA
-- -----------------------------------------------------
CREATE SCHEMA
IF NOT EXISTS`heroku_2205e3ccffad011` DEFAULT CHARACTER
SET utf8mb4 ;
USE`heroku_2205e3ccffad011`
;

-- -----------------------------------------------------
-- Table`heroku_2205e3ccffad011`.`sistema`
-- -----------------------------------------------------
DROP TABLE IF EXISTS`heroku_2205e3ccffad011`.`sistema` ;

CREATE TABLE
IF NOT EXISTS`heroku_2205e3ccffad011`.`sistema`
(
  `codigo` INT NOT NULL,
  `nombre` VARCHAR
(50) NULL,
  `logo` VARCHAR
(50) NULL,
  `color` VARCHAR
(50) NULL,
  `basedatos` VARCHAR
(50) NULL,
  `urlapp` VARCHAR
(255) NULL,
  `apiurl` VARCHAR
(255) NULL,
  `apitoken` VARCHAR
(50) NULL,
  `ftpurl` VARCHAR
(50) NULL,
  `ftpuser` VARCHAR
(50) NULL,
  `ftppass` VARCHAR
(50) NULL,
  `obsoleto` TINYINT
(1) NULL,
`menssageInError` VARCHAR
(50) NULL,
  PRIMARY KEY
(`codigo`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table`heroku_2205e3ccffad011`.`priceList`
-- -----------------------------------------------------
DROP TABLE IF EXISTS`heroku_2205e3ccffad011`.`priceList` ;

CREATE TABLE
IF NOT EXISTS`heroku_2205e3ccffad011`.`priceList`
(
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR
(45) NULL,
  `vatIncluded` VARCHAR
(45) NULL,
  PRIMARY KEY
(`id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table`heroku_2205e3ccffad011`.`priceList`
-- -----------------------------------------------------
DROP TABLE IF EXISTS`heroku_2205e3ccffad011`.`favorite` ;

CREATE TABLE
IF NOT EXISTS`heroku_2205e3ccffad011`.`favorite`
(
  `productId` INT NOT NULL ,
  `userId` INT NOT NULL)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table`heroku_2205e3ccffad011`.`customer`
-- -----------------------------------------------------
DROP TABLE IF EXISTS`heroku_2205e3ccffad011`.`customer` ;

CREATE TABLE
IF NOT EXISTS`heroku_2205e3ccffad011`.`customer`
(
  `id` INT NOT NULL AUTO_INCREMENT,
  `fiscalName` VARCHAR
(45) NULL,
  `businessName` VARCHAR
(45) NULL,
  `cif` VARCHAR
(45) NULL,
  `street` VARCHAR
(45) NULL,
  `city` VARCHAR
(45) NULL,
  `region` VARCHAR
(45) NULL,
  `zipCode` VARCHAR
(45) NULL,
  `accountCode` VARCHAR
(45) NULL,
  `applySurcharge` VARCHAR
(45) NULL,
  `discountRate` VARCHAR
(45) NULL,
  `cardNumber` VARCHAR
(45) NULL,
  `telephone` VARCHAR
(45) NULL,
  `email` VARCHAR
(45) NULL,
  `contactPerson` VARCHAR
(45) NULL,
`password` VARCHAR
(45) NULL,
`role` VARCHAR
(45) NULL,
  `sendMailing` VARCHAR
(45) NULL,
  `notes` VARCHAR
(45) NULL,
  `showNotes` VARCHAR
(45) NULL,
  PRIMARY KEY
(`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table`heroku_2205e3ccffad011`.`family`
-- -----------------------------------------------------
DROP TABLE IF EXISTS`heroku_2205e3ccffad011`.`family` ;

CREATE TABLE
IF NOT EXISTS`heroku_2205e3ccffad011`.`family`
(
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR
(45) NULL,
  `showInPos` VARCHAR
(45) NULL,
  `buttonText` VARCHAR
(45) NULL,
  `color` VARCHAR
(45) NULL,
  `image` longblob  NULL, 
  PRIMARY KEY
(`id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table`heroku_2205e3ccffad011`.`product`
-- -----------------------------------------------------
DROP TABLE IF EXISTS`heroku_2205e3ccffad011`.`product` ;

CREATE TABLE
IF NOT EXISTS`heroku_2205e3ccffad011`.`product`
(
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR
(45) NULL,
  `baseSaleFormatId` VARCHAR
(45) NULL,
  `buttonText` VARCHAR
(45) NULL,
  `color` VARCHAR
(45) NULL,
  `PLU` VARCHAR
(45) NULL,
  `familyId`  INT NULL, 
  `vatId` VARCHAR
(45) NULL,
  `useAsDirectSale` VARCHAR
(45) NULL,
  `saleableAsMain` VARCHAR
(45) NULL,
  `saleableAsAddin` VARCHAR
(45) NULL,
  `isSoldByWeight` VARCHAR
(45) NULL,
  `askForPreparationNotes` VARCHAR
(45) NULL,
  `askForAddins` VARCHAR
(45) NULL,
  `printWhenPriceIsZero` VARCHAR
(45) NULL,
  `preparationTypeId` VARCHAR
(45) NULL,
  `preparationOrderId` VARCHAR
(45) NULL,
  `costPrice` FLOAT NULL,
  `image` BLOB NULL, 
  `quantity` int null DEFAULT 1,
  `notes` varchar
(255) NULL,
  `active` TINYINT
(1) NULL,
  PRIMARY KEY
(`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table`heroku_2205e3ccffad011`.`stock`
-- -----------------------------------------------------
DROP TABLE IF EXISTS`heroku_2205e3ccffad011`.`stock` ;

CREATE TABLE
IF NOT EXISTS`heroku_2205e3ccffad011`.`stock`
(
  `warehouseId` VARCHAR
(45) NULL,
  `productId` INT NULL,
  `quantity` INT  NULL)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table`heroku_2205e3ccffad011`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS`heroku_2205e3ccffad011`.`user` ;

CREATE TABLE
IF NOT EXISTS`heroku_2205e3ccffad011`.`user`
(
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR
(45) NOT NULL,
  `lastname` VARCHAR
(45) NOT NULL,
  `password` VARCHAR
(255) NULL,
  `CIF` VARCHAR
(45) NULL,
  `calle` VARCHAR
(45) NULL,
  `CP` VARCHAR
(45) NULL,
  `poblacion` VARCHAR
(45) NULL,
  `email` VARCHAR
(45) NULL,
  `telefono` VARCHAR
(45) NULL,
`role` VARCHAR
(45) NULL,
  PRIMARY KEY
(`id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table`heroku_2205e3ccffad011`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS`heroku_2205e3ccffad011`.`salesorder` ;

CREATE TABLE
IF NOT EXISTS`heroku_2205e3ccffad011`.`salesorder`
(
  `id` INT NOT NULL AUTO_INCREMENT,
  `orderLines` longtext NOT NULL,
  `saleCenter` VARCHAR
(45) NOT NULL,
  `discountRate` VARCHAR
(45) NULL,
  `cashDiscount` VARCHAR
(45) NULL,
  `grossAmount` VARCHAR
(45) NULL,
  `surchargeRate` VARCHAR
(45) NULL,
  `netAmount` VARCHAR
(45) NULL,
  `vatAmount` VARCHAR
(45) NULL, 
  `surchargeAmount` VARCHAR
(45) NULL, 
`userId` INT NULL,
`date` VARCHAR
(45) NULL,
`chargesType` VARCHAR
(45) NULL,
`deliverydate`VARCHAR
(45)  NULL,
`orderNotes` VARCHAR
(45)  NULL,
`sended` VARCHAR
(45) NULL,
PRIMARY KEY
(`id`))
ENGINE = InnoDB;


SET SQL_MODE
=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS
=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS
=@OLD_UNIQUE_CHECKS;

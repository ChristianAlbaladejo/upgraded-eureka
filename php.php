<?php
ini_set('display_errors', 1);

//FTP
// define some variables
/* $local_file = 'C:\tmp\export\maestos.xml';
$server_file = '/export/maestros.xml';
$dst_dir = 'C:\tmp';
$src_dir = '\images';
$ftp_server = "192.168.200.213";
$ftp_user_name = "root";
$ftp_user_pass = "123456";

$conn_id = ftp_connect($ftp_server);

// login with username and password
$login_result = ftp_login($conn_id, $ftp_user_name, $ftp_user_pass);

// try to download $server_file and save to $local_file
if (ftp_get($conn_id, $local_file, $server_file, FTP_BINARY)) {
    echo "Successfully written to $local_file\n";
} else {
    echo "There was a problem\n";
}

//Sync Images
 ftp_putAll($conn_id, $src_dir, $dst_dir);
ftp_sync($src_dir);

// close the connection
ftp_close($conn_id);*/
/* rename("C:\images", "C:\\tmp\images"); */
$servername = 'eu-cdbr-west-03.cleardb.net';
$username = "b0ab591da45cbb";
$password = "bdbc7002";
$dbname = "heroku_2205e3ccffad011";

$path = '/home/jnc/maestros.xml';


//parse file
// Read entire file into string
$xmlfile = file_get_contents($path);

// Convert xml string into an object
$new = simplexml_load_string($xmlfile);

// Convert into json
$con = json_encode($new);

// Convert into associative array
$newArr = json_decode($con, true);

$priceList = $newArr["PriceLists"]["PriceList"] ?? '';
$customer = $newArr['Customers']["Customer"] ?? '';
$family =  $newArr['Families']['Family'] ?? '';
$product = $newArr['Products']['Product'] ?? '';
$stock = $newArr['Stocks']['Stock'] ?? '';
// print("<pre>" . print_r($priceList, true) . "</pre>");

//INJECTION DATA TO MYSQL
// Create connection
$conn = new mysqli($servername, $username, $password,  $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}else{
    echo 'Conectado';
}

//DELETE DATA TABLES
/*  $sql = "DELETE FROM stock";
if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}
$sql = "DELETE FROM customer";
if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}
$sql = "DELETE FROM family";
if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}
$sql = "DELETE FROM pricelist";
if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}
$sql = "DELETE FROM product";
/* if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}   */


//fech data into tables
for ($i = 0; $i < count($priceList); ++$i) {
    $select = 'SELECT id FROM pricelist WHERE id = ' . $priceList[$i]['@attributes']['Id'] . '';
    if ($result = $conn->query($select)) {
        $row_cnt = $result->num_rows;
        if ($row_cnt == 0) {
            $sql = "INSERT INTO pricelist (id, name, vatIncluded)
    VALUES (" . $priceList[$i]['@attributes']['Id'] . "," . "'" . $priceList[$i]['@attributes']['Name'] . "'" . "," . $priceList[$i]['@attributes']['VatIncluded'] . ")";
            if ($conn->query($sql) === TRUE) {
                echo "New record created successfully";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
        }
    }
}

for ($i = 0; $i < count($customer); ++$i) {
    $select = 'SELECT id FROM customer WHERE id = ' . $customer[$i]['@attributes']['Id'] . '';
    if ($result = $conn->query($select)) {
        $row_cnt = $result->num_rows;
        if ($row_cnt == 0) {
            $sql = "INSERT INTO customer (id, fiscalName, businessName,cif,street,city,region,zipCode,accountCode,applySurcharge,discountRate,cardNumber,telephone,email,contactPerson,sendMailing,notes,showNotes)
    VALUES (" . $customer[$i]['@attributes']['Id'] . "," . " ' " . $customer[$i]['@attributes']['FiscalName'] . " ' "  . ","  . "'" . $customer[$i]['@attributes']['BusinessName'] . "'" . ","  . "'" . $customer[$i]['@attributes']['Cif'] . "'" . "," . "'" . $customer[$i]['@attributes']['Street'] . "'" . ","  . "'" . $customer[$i]['@attributes']['City'] . "'" . "," . "'" . $customer[$i]['@attributes']['Region'] . "'" . ","  . "'" . $customer[$i]['@attributes']['ZipCode'] . "'" . ","  . "'" . $customer[$i]['@attributes']['AccountCode'] . "'" . ","  . "'" . $customer[$i]['@attributes']['ApplySurcharge'] . "'"  . "," . "'" . $customer[$i]['@attributes']['DiscountRate'] . "'" . ","  . "'" . $customer[$i]['@attributes']['CardNumber'] . "'" . "," . "'" . $customer[$i]['@attributes']['Telephone'] . "'" . "," . "'" . $customer[$i]['@attributes']['Email'] . "'"  . "," . "'" . $customer[$i]['@attributes']['ContactPerson'] . "'"  . "," . "'" . $customer[$i]['@attributes']['SendMailing'] . "'"  . "," . "'" . $customer[$i]['@attributes']['Notes'] . "'"  . "," . "'" . $customer[$i]['@attributes']['ShowNotes'] . "'" .  ")";

            if ($conn->query($sql) === TRUE) {
                echo "New record created successfully";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
        }
    }
}

for ($i = 0; $i < count($family); ++$i) {
    $select = 'SELECT id FROM family WHERE id = ' . $family[$i]['@attributes']['Id'] . '';
    if ($result = $conn->query($select)) {
        $row_cnt = $result->num_rows;
        if ($row_cnt == 0) {
            $sql = "INSERT INTO family (id, name, showInPos,buttonText,color)
    VALUES (" . $family[$i]['@attributes']['Id'] . "," . "'" . $family[$i]['@attributes']['Name'] . "'" . "," . $family[$i]['@attributes']['Order'] . "," . "'" . $family[$i]['@attributes']['ButtonText'] . "'" . ","  . "'" . $family[$i]['@attributes']['Color'] . "'" . ")";

            if ($conn->query($sql) === TRUE) {
                echo "New record created successfully";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
        }
    }
}

for ($i = 0; $i < count($product); ++$i) {
    $select = 'SELECT id FROM product WHERE id = ' . $product[$i]['@attributes']['Id'] . '';
    if ($result = $conn->query($select)) {
        $row_cnt = $result->num_rows;
        if ($row_cnt == 0) {
            $sql = "INSERT INTO product (id,name,baseSaleFormatId,buttonText,color,PLU,familyId,vatId,useAsDirectSale,saleableAsMain,saleableAsAddin,isSoldByWeight,askForPreparationNotes,askForAddins,printWhenPriceIsZero,preparationTypeId,preparationOrderId,costPrice,active)
    VALUES (" . $product[$i]['@attributes']['Id'] . "," . "'" . $product[$i]['@attributes']['Name'] . "'" . "," . $product[$i]['@attributes']['BaseSaleFormatId'] . "," . "'" . $product[$i]['@attributes']['ButtonText'] . "'" . ","  . "'" . $product[$i]['@attributes']['Color'] . "'"  . ","  . "'" . $product[$i]['@attributes']['PLU'] . "'"  . ","  . "'" . $product[$i]['@attributes']['FamilyId'] . "'"  . ","  . "'" . $product[$i]['@attributes']['VatId'] . "'"  . ","  . "'" . $product[$i]['@attributes']['UseAsDirectSale'] . "'"  . ","  . "'" . $product[$i]['@attributes']['SaleableAsMain'] . "'"  . ","  . "'" . $product[$i]['@attributes']['SaleableAsAddin'] . "'"  . ","  . "'" . $product[$i]['@attributes']['IsSoldByWeight'] . "'"  . ","  . "'" . $product[$i]['@attributes']['AskForPreparationNotes'] . "'"  . ","  . "'" . $product[$i]['@attributes']['AskForAddins'] . "'"  . ","  . "'" . $product[$i]['@attributes']['PrintWhenPriceIsZero'] . "'"  . ","  . "'" . $product[$i]['@attributes']['PreparationTypeId'] . "'"  . ","  . "'" . $product[$i]['@attributes']['PreparationOrderId'] . "'"  . ","  . "'" . $product[$i]['Prices']['Price'][0]['@attributes']['MainPrice'] . "'" .  ","  . 'false'  . ")";

            if ($conn->query($sql) === TRUE) {

                echo "New record created successfully";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
        }
    }
}

$conn->close();


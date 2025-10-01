<?php
session_start();
include ("funcfactura.php");
?>
<HTML>
<HEAD>
<style type="text/css"> 
.style1 {
	color: #0000FF;
	font-weight: bold;
}
.style2 {
	font-weight: bold;
	color: #00FF00;
}
.style5 {color: #FFFFFF}
.style7 {
	font-size: 12px;
	font-family: Arial, Helvetica, sans-serif;
	font-weight: bold;
}
.ppantetitulo {
 
	FONT-WEIGHT: bold; FONT-SIZE: 10px; COLOR: #333333; FONT-FAMILY: Verdana, Arial, Helvetica, sans-serif; TEXT-DECORATION: none
 
}
.pptexto {
 
	FONT-WEIGHT: normal; FONT-SIZE: 10px; COLOR: #000000; FONT-FAMILY: Arial, Helvetica, sans-serif; TEXT-DECORATION: none;
 
	text-align:justify
 
}
</style>
 
<title>Test</title></HEAD>
<BODY>
<table width="800" border="0">
<tr bgcolor="#ededee"> 
<td width=412 align=center style="font-size:18;font-family:Arial"><b>Test</b></td>
</tr> </table>

<?php

$conexion=connect();
if(isset($_POST['submit']))
 
{
	$serial = $_POST['serial'];
	$year = date("Y");
	if (strlen($serial) == 8){
		echo "Year: 2011-".$year;
	}
	else if (strlen($serial) <= 7) {
		if (!is_numeric($serial[0])){
			$letra = $serial[0];
			$resto = substr($serial,1,strlen($serial)-1);
			if (is_numeric($resto)){
				$num = intval($resto);
				$ssql = "select year from test_serial_year where letra = '$letra' and nroini <= '$num' and nrofin >= '$num' ";
			}
			else {
				$ssql = "select year from test_serial_year where letra = '$letra'";
			}
		}
		else if (is_numeric($serial)){
			$num = intval($serial);
			$letra = "";
			$ssql = "select year from test_serial_year where letra = '$letra' and nroini <= '$num' and nrofin >= '$num' ";
		}
	}
	$origin = mysqli_query($conexion,$ssql);
	$num_years = mysqli_num_rows($origin);
	
	if ($num_years > 1 or $num_years==0) {
		echo "<br>Unknown";
	}
	else{
		$reg=mysqli_fetch_array($origin);
		echo "Year: ".$reg['year'];
	}
}

?>

<form method="post" action="<?=$_SERVER['PHP_SELF'];?>">
	<label> Serial: </label>
    <input type="text" name="serial"><br>
    <input type="submit" name="submit" value="Submit"><br>
</form>

</BODY>
</HTML>

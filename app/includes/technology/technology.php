<?php
$password = "super204" ;	
session_start();

if ( $password == "isphp" )
{
	HtmlHead("need password:") ;
	echo "<h3 align=center>please modify the password</h3>";
	echo "<center>Modified as follows£º<br>"
		. 'Open with Notepad txt(unzip.php), modify the <font color=red>$password = "isphp" </font> in 2 row isphp chanege the password, And then uploaded to the server </center>';
	hg_exit();
}

if ( !IsSet($_SESSION['administrator']) )
{
	if ( !IsSet($_POST['user_pass']) )
	{
		HtmlHead("Enter the administrator password:");
		echo '<h3 align="center">For safety reasons, the following operations require password authentication:</h3>';
		hg_exit('<br><form action=' . $_SERVER['PHP_SELF']
			. ' method="post">Please enter the admin password:<input name="user_pass"> <input type="submit" value£½"OK"> </form>');
	}
	else
	{
		if ( $password != $_POST['user_pass'] )
		{
			HtmlHead("Incorrect administrator password!");
			MessageBox("Incorrect administrator password and can not continue! If you forget your password, the password can be found in the second line of this document!", true);
			hg_exit("", true);
		}
		$_SESSION['administrator'] = "seted";
		header("Location: {$_SERVER['PHP_SELF']}");
	}
	hg_exit();
}

HtmlHead("Select unzip the file!");
if ( !IsSet($_POST['submit']) )
{
	TestWriteable() ;
	$gzip_info = "" ;
	echo "check zlib support... " ;
	if ( !function_exists("gzopen") )
	{
		$gzip_info = "<font color=\"red\">Note! Your space no zlib support, so use
		<a href=\"http://www.isphp.net/\" target=\"_blank\"><font color=\"blue\">phpZip</font></a> 
		Compressed files, do not select the compressed into Gzip format, otherwise it will not unzip correctly!</font>" ;
	}
	else
	{
		$gzip_info = "<font color=\"blue\">Congratulations! Your space support zlib compression, it is strongly recommended to use
		<a href=\"http://www.isphp.net/\"><font color=\"red\" target=\"_blank\">phpZip</font></a> 
		When the compressed file, select the compressed into Gzip format, will greatly reduce the file size!</font>" ;
	}
	echo " ----------------- OK!<br>\n" . $gzip_info ;
	
	echo "<br><br><br><br>
<form action=\"{$_SERVER["PHP_SELF"]}\" method=\"post\" enctype=\"multipart/form-data\">
<table align=\"center\" width=\"450\">
<tr><td height=\"20\" colspan=\"2\">Please select the compressed file location, then click the OK button: <p></td></tr>
<tr>
<td><input type=\"radio\" name=\"file_type\" value=\"upload\" checked onclick=\"this.form.upload_file.disabled=false; this.form.server_filename.disabled=true\">Upload files from local: </td> 
<td>
<input name=\"upload_file\" type=\"file\" style=\"color:#0000ff\">
</td>
</tr>

<tr><td colspan=2 height=10></td></tr>

<tr>
<td><input type=\"radio\" name=\"file_type\" value=\"server\" onclick=\"this.form.upload_file.disabled=true; this.form.server_filename.disabled=false\">Specify the file server:</td>
<td><input name=\"server_filename\" value=\"data.dat.gz\" style=\"color:#0000ff\" disabled >(use\".\"Represents the current directory)</td>
</tr>

<tr><td colspan=\"2\" ><br><input type=\"checkbox\" name=\"chmod777\" value=\"chmod777\">Will extract out all the files and folders attributes change777(becarfull)</td></tr>
<tr><td colspan=\"2\" align=\"center\"><br><input type=\"submit\" name=\"submit\" value=\"OK\"></td></tr>
</table>
</form>
" ;
	HtmlFoot() ;
	exit ;
}

if ( $_POST['file_type'] == 'upload' )
{
	$tmpfile = $_FILES['upload_file']['tmp_name'] ;
}
else
{
	$tmpfile = $_POST['server_filename'] ;
}

if ( !$tmpfile )
{
	exit("Invalid file or file does not exist, there may be reasons for the file size is too large to upload failed or did not specify a server-side files, etc.") ;	
}

$bgzExist = FALSE ;
if ( function_exists("gzopen") )
{
	$bgzExist = TRUE ;
}

$alldata = "" ;
$pos = 0 ;

$gzp = $bgzExist ? @gzopen($tmpfile, "rb") : @fopen($tmpfile, "rb") ;
$szReaded = "has" ;
while ( $szReaded )
{
	$szReaded = $bgzExist ? @gzread($gzp, 2*1024*1024) : @fread($gzp, 2*1024*1024) ;
	$alldata .= $szReaded ;
}
$bgzExist ? @gzclose($gzp) : @fclose($gzp) ;

$nFileCount = substr($alldata, $pos, 16) ;
$pos += 16 ;

$size = substr($alldata, $pos, 16) ;
$pos += 16 ;

$info = substr($alldata, $pos, $size-1) ;		
$pos += $size ;

$info_array = explode("\n", $info) ;

$c_file = 0 ;
$c_dir = 0 ;

foreach ($info_array as $str_row)
{
	list($filename, $attr) = explode("|", $str_row);
	if ( substr($attr,0,6) == "[/dir]" )
	{
		echo "End of dir $filename<br>";
		continue;
	}
	
	if ( substr($attr,0,5)=="[dir]" )
	{
		if ( @mkdir($filename, 0777) )
		{
			echo "Make dir $filename<br>";
			if ( $_POST['chmod777'] == "chmod777" ) 
			{
				@chmod($filename, 0777);
			}
		}
		$c_dir++ ;
	}
	else
	{
		$fp = @fopen($filename, "wb") or exit("Can not create a new file $ filename, because there is no write access, modify permissions");
		@fwrite($fp, substr($alldata, $pos, $attr) );
		$pos += $attr ;
		fclose($fp);
		echo "Create file $filename<br>";
		if ( $_POST['chmod777'] == "chmod777" ) 
		{
			@chmod($filename, 0777);
		}
		$c_file++ ;
	}
}

if ( $_POST['file_type'] == 'upload' )
{
	if ( @unlink($tmpfile) ) echo "Delete Temporary Files $tmpfile...<br>" ;
}

echo "<h1>Operation is completed! Total $ c_file a solution of file, folder $ c_dir months, thanks to use!</h1><p>" ;
HtmlFoot() ;


function TestWriteable()
{
	$safemode = '
Create a file named unzip2.php (or other name), which reads as follows:

<? php
copy ("unzip.php", "unzip_safe.php");
header ("location: unzip_safe.php");
?>

This file will be uploaded to the server, and unzip.php same directory,
Unzip2.php run this program.

If that does not work, it is that space is not supported, there is no way, very sorry you wasted your time.
	' ;
	echo "check PHP version... " . phpversion() . " -------- OK!<br>\n" ;
	echo "testing Permission... " ;

	$fp = @fopen("phpzip.test", "wb") ;
	if ( FALSE !== $fp )
	{
		fclose($fp) ;
		@unlink("phpzip.test") ;
	}
	else
	{
		exit("No write permission in the current directory, set the current directory attribute changes to:777\n") ;
	}

	$dir = "phpziptest" ;
	$file = "$dir/test.txt.php" ;
	@mkdir($dir, 0777) ;
	$fp = @fopen($file, "wb") ;
	if ( FALSE === $fp )
	{
		@rmdir($dir) ;
		exit ("
No permission to create files in the file folder is created under the program, is likely to be caused by PHP safe mode, the solution is as follows£º<p><center><textarea cols=110 rows=15>$safemode</textarea></center>") ;
	}
	@fclose($fp) ;
	@unlink($file) ;
	@rmdir($dir) ;
	echo " ----------------- OK!<br>\n" ;
}

function HtmlHead($title="", $css_file="")
{
	echo "<html>\n"
		. "\n"
		. "<head>\n"
		. "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=gb2312\">\n"
		. "<title>$title</title>\n"
		. "<style type=\"text/css\">\n"
		. "body,pre,td {font-size:12px; background-color:#fcfcfc; font-family:Tahoma,verdana,Arial}\n"
		. "input,textarea{font-size:12px; background-color:#f0f0f0; font-family:Tahoma,verdana,Arial}\n"
		. "</style>\n"
		. "</head>\n"
		. "\n"
		. "<body>\n" ;
}

function HtmlFoot()
{
	echo "<br><hr color=\"#003388\">\n"
		. "<center>\n"
		. "<p style=\"font-family:verdana; font-size:12px\">Contact us: \n"
		. "<a href=\"http://www.isphp.net/\" target=\"_blank\">http://www.isphp.net/</a></p>\n"
		. "</center>\n"
		. "</body>\n"
		. "\n"
		. "</html>" ;
}

function MessageBox($str)
{
	echo "<script>alert('$str');</script>\n";
}

function hg_exit($str="", $goback=false)
{
	if ( !empty($str) )
	{
		echo ("<center>$str</center>");
	}
	if ( $goback )
	{
		echo ('<big><center><a href="JavaScript:history.go(-1);">Click here to return to the previous page</a></center></big>');
	}
	HtmlFoot();
	exit;
}

?>
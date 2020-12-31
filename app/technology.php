<?php 
	if (isset($_GET['id'])) {
		$id = $_GET['id'];
	} else {
		$id = 'sulphur_granulation';
	}
	
	$title = 'Sulphur Granulation';
	
	if ($id == 'sulphur_pastillation') {
		$title = 'Sulphur Pastillation';
	} elseif ($id == 'storage_packaging') {
		$title = 'Sulphur Storage and Handling';
	}
?>
<?php include('includes/head.php') ?>
	<script type="text/javascript">
		$(document).ready(function() {        
			var slideshow_tabs = new Slideshow({
				id : 'technology_slideshow',
				variableHeight: true,
				variableWidth: true
			});  

			$('#technology_page_nav li a').each(function(){
				//console.log(<?php echo $id ?>);
				if ($(this).attr('href').indexOf("<?php echo $id ?>") != -1 ) {
					$(this).closest('li').addClass('selected');
					return false;
				}
			});
		});
	</script>
	</head>
	<body>
<?php include('includes/sidebar.php') ?>
		<div id="content">
			<div id="technology" class="page">			
<?php include("includes/technology/" . $id . ".html") ?>			
			</div>
		</div>
	</body>
</html>

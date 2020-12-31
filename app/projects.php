<?php 	
	if (isset($_GET['id'])) {
		$id = $_GET['id'];
	} else {
		$id = 'south_pars_gas_12';
	}	
?>
<?php include('includes/head.php') ?>
	</head>
	<body>
<?php include('includes/sidebar.php') ?>
		<div id="content">
			<div id="projects" class="page">
<?php include("includes/projects/" . $id . ".html") ?>			
			</div>
		</div>
	</body>
</html>

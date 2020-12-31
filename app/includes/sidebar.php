<?php 
	$path = $_SERVER["PHP_SELF"] . "?" . $_SERVER["QUERY_STRING"];;
	$info = pathinfo($path);
	//$file =  basename($path,'.'.$info['extension']);
	$file = basename($path);
?>	
    <div id="sidebar">
        <div id="nav">	
			<p class="logo">		
				<a href="index.php">
					<img src="images/logo_new_medium.png" alt="Zafaran Industrial Group" /><br />
					<img src="images/logo.png" alt="Zafaran Industrial Group" />
				</a>
			</p>
            <ul>
                <li><a href="index.php">Home</a></li>
                <li><a href="about.php">About</a></li>
                <li><a href="technology.php?id=sulphur_granulation">Technology</a>
					<ul>
						<li><a href="technology.php?id=sulphur_granulation">Sulphur Granulation</a></li>
						<li><a href="technology.php?id=sulphur_pastillation">Sulphur Pastillation</a></li>
						<li><a href="technology.php?id=storage_packaging">Storage and Handling</a></li>						
					</ul>
				</li>
                <li><a href="projects.php?id=south_pars_gas_12">Projects</a>
					<ul>
						<li><a href="projects.php?id=abadan_handling_storage">Abadan Refinery - Handling & Storage</a></li>
						<li><a href="projects.php?id=abadan_solidification">Abadan Refinery - Solidification</a></li>
						<li><a href="projects.php?id=persian_gulf_star_refinery">Persian Gulf Star Refinery</a></li>					
						<li><a href="projects.php?id=bushehr_petrochemical_company">Bushehr Petrochemical Company</a></li>					
						<li><a href="projects.php?id=south_pars_gas_20_21">South Pars Phase 20 &amp; 21</a></li>						
						<li><a href="projects.php?id=south_pars_gas_17_18">South Pars Phase 17 &amp; 18</a></li>							
						<li><a href="projects.php?id=south_pars_gas_19">South Pars Phase 19</a></li>
						<li><a href="projects.php?id=bandar_abbas_oil_refinery">Bandar Abbas Refinery</a></li>
						<li><a href="projects.php?id=south_pars_gas_12">South Pars Phase 12</a></li>
						<li><a href="projects.php?id=tehran_oil_refinery">Tehran Oil Refinery</a></li>
						<li><a href="projects.php?id=sulfur_bentonite_solidification">Sulphur Bentonite Plant</a></li>
					</ul>
				</li>			
                <!--li><a href="career.php">Careers</a></li-->
                <li><a href="contact.php">Contact</a></li>
            </ul>
        </div>
		<p id="footer">
			&copy; 1981-<?php
			date_default_timezone_set('Europe/Berlin');
			echo date("Y") ?> ZAFARAN Industrial Group<br />
			Site by <a rel="external" href="http://saeidmohadjer.com/">Saeid Mohadjer</a>
		</p>		
    </div>	
	<script>
		var url = "<?php echo $file ?>";
		$('#sidebar ul li a').each(function() {
			if ( $(this).attr('href') == url ) {
				$(this).closest('li').addClass('selected').parents('li').addClass('selected');
				//return false;
			}
		});			
	</script>	
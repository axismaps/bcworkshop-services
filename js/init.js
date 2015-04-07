var map,
	neighborhoods,
	template,
	overlays,
	labels,
	selected = {},
	endpoint = window.location.origin + ':3000';

function init(){
	init_map();
	init_layers( $( ".dropdown-menu" ) );
	init_events();
	init_names();
	resize();
}

function init_map(){
	//Initializing map and tile layer
	map = L.map( 'map', { 
		zoomControl: false,
		minZoom : 10,
		keyboard : false
	}).setView( [ 32.78, -96.8 ], 11 );
	L.tileLayer( tileAddress ).addTo( map );
	
	var url_parameter_id = gup( 'id' );
	
	var layerStyle = L.geoJson( null, {
		style : function( feature ) {
			return { 
				color : '#000',
				weight : 2
			};
    	},
    	onEachFeature : function( feature, layer ) {
	    	layer.on({
				mouseover : highlightFeature,
				mouseout : resetHighlight,
				click : featureClick
			});
			
			if( url_parameter_id == feature.properties.id ) {
				layer.fire( 'click' );
				map.fitBounds( layer.getBounds() );
			}
    	}
	});
	
	//fire intro screen
	$( '#about' ).modal({
		backdrop: 'static',
		keyboard: false
	}).modal( 'show' );
	$( '#about #loading-icon').show();
	$( '#about .close').hide();
		
	neighborhoods = omnivore.topojson( endpoint + "/topojson/neighborhoods/id%2Cname%2Carea/", null, layerStyle )
		.on( 'ready', function() {
			//sets the maxBounds to the neighborhood bounds + 0.1%
			map.setMaxBounds( neighborhoods.getBounds().pad( .2 ) );
			
			var mdl = $( '#about' ).data( 'bs.modal' );
			mdl.options.backdrop = true;
			mdl.options.keyboard = true;
			mdl.escape();
			$( '#about #loading-icon').hide();
			$( '#about .close').show();
		})
		.addTo( map );
}

function init_layers( button ) {
	//init layer group to store labels
	labels = L.layerGroup().addTo( map );
	
	//init layer group to store overlays
	overlays = L.layerGroup().addTo( map );
	
	//hides the loader icon on first view
	$( '#dropdown-toggle i' ).toggle();
	
	//button should be a jquery object
	button.append( '<li role="presentation"><label><input type="radio" name="layers" value="" checked>None</label></li>' );
	_.each( layers, function( layer ) {
		var $li = $( '<li role="presentation"><label><input type="radio" name="layers" value="' + layer.table + '"' + ( layer.default ? ' checked="true"' : '' ) +'>' + layer.name + '</label></li>' );
		$li.data( layer );
		button.append( $li );
	});
	
	button.find( 'input' ).click( function() {
		overlays.clearLayers();
		labels.clearLayers();
		
		if( $( this ).val() != '' ) {
			$( "#dropdown-toggle" ).children().toggle();
			
			var layerStyle = L.geoJson( null, {
				style : function( feature ) {
					return { 
						color : '#ed2a24',
						fillOpacity : 0,
						pointerEvents : 'none'
					};
		    	}
			});
			
			$( "#dropdown-toggle" ).css( "pointer-events", "none" );
			
			if( $( this ).parents( "li" ).data().labels ) {
  				  L.tileLayer( $( this ).parents( "li" ).data().labels ).addTo( labels );
		  }
			
			omnivore.topojson( endpoint + "/topojson/" + $( this ).val(), null, layerStyle ).addTo( overlays ).on( 'ready', function() {
				$( "#dropdown-toggle" ).children().toggle();
				$( "#dropdown-toggle" ).css( "pointer-events", "auto" );
			}); 
		}
		map.getContainer().focus();
	});	
	button.find( 'input:checked' ).trigger( 'click' );
}

function highlightFeature( e ) {
	var layer = e.target;
	
	layer.setStyle({
        color : '#ed2a24'
    });
    
	show_probe( e, layer.feature.properties.name );
}

function resetHighlight( e ) {
	if( $.isEmptyObject( selected ) || e.target.feature.properties.id != selected.feature.properties.id ) neighborhoods.resetStyle( e.target );
	$( "#probe" ).hide();
}

function featureClick( e ) {
	if( selected.hasOwnProperty( 'feature' ) && e.target.feature.properties.id == selected.feature.properties.id ) return;
	
	var executing = $( this );
	if ( executing.data( 'executing' ) ) return;
	executing.data( 'executing', true );
	
	if( $.isEmptyObject( selected ) || e.target.feature.properties.id != selected.feature.properties.id ) {
		neighborhoods.resetStyle( selected );
		$( '#name-input' ).val('');
	}
	selected = e.target;
	selected.setStyle({
		color : '#ed2a24'
	});
	show_details( e.target.feature.properties, executing );
}

function init_events(){	
	$( window ).resize( resize );
	
	$( '#name-input' ).on( 'focus', function(){
		$( 'aside' ).addClass( 'fixfixed' );
	});
	
	$( '#name-input' ).on( 'blur', function(){
		$( 'aside' ).removeClass( 'fixfixed' );
	});
	
	$( "#zoom-out" ).click( function(){
		map.zoomOut();
		if( map.getZoom() - 1 <= map.getMinZoom() ) $( "#zoom-out" ).addClass( "disabled" );
		$( "#zoom-in" ).removeClass( "disabled" );
	});
	$( "#zoom-in" ).click( function() {
		map.zoomIn();
		if( map.getZoom() + 1 >= map.getMaxZoom() ) $( "#zoom-in" ).addClass( "disabled" );
		$( "#zoom-out" ).removeClass( "disabled" );
	});
	keyboard_events();
}

function init_names() {
	var names = new Bloodhound({
		datumTokenizer : Bloodhound.tokenizers.obj.whitespace( 'name' ),
		queryTokenizer : Bloodhound.tokenizers.whitespace,
		limit : 4,
		prefetch : {
			url : endpoint + '/names'
		}
	});
	names.initialize();
	
	$( '#name-input' )
		.typeahead( null, {
			name : 'neighborhoods',
			displayKey : 'name',
			source : names.ttAdapter()
		})
		.on( 'typeahead:selected', function( e, obj ) {
			newFeature = get_feature( obj.id );
			map.fitBounds( newFeature.getBounds() );
			newFeature.setStyle({
				color : '#ed2a24'
			});
			if ( selected ) neighborhoods.resetStyle( selected );
			selected = newFeature;
			show_details( obj );
			$( '#name-input' ).blur();
		})
}

function get_feature( id ) {
	return _.find( neighborhoods.getLayers(), function( l ) {
		return id == l.feature.properties.id;
	})
}

function resize(){
	$( "#map" ).height( $( window ).height() - 140 );
	$( "aside" ).height( $( window ).height() - 200 );
	if ( $( "body" ).hasClass( "details" ) ){
		$( "#map" ).css({
			"margin-left": $( "aside" ).outerWidth() + "px",
			"width": $( window ).width() - $( "aside" ).outerWidth() + "px"
		});
	} else {
		$( "#map" ).css({
			"margin-left": 0,
			"width": "100%"
		});
	}
	map.invalidateSize();
}

init();

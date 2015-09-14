// Languages: name (local), name_en, name_fr, name_es, name_de
@name: '[name_en]';

// Fonts //
@sans: 'PT Sans Regular';
@sans_bold: 'PT Sans Bold';
@sans_italic: 'PT Sans Italic';
@sans_bolditalic: 'PT Sans Bold Italic';

/*
This style is designed to be easily recolored by adjusting the color
variables below. For predicatable feature relationships,
maintain or invert existing value (light to dark) scale.
*/

// Color palette //
@road:  #fff;
@land:  #eee;

@fill1: #fff;
@fill2: #bbb;
@fill3: #777;
@fill4: #b1c6d7;
@natural: #84b400;
@text: #666;

Map {
  background-color: @land;
  background-image: url("img/PolarGranite.jpg");
  background-image-opacity: 0.3;
}

// Political boundaries //
#admin[admin_level=2][maritime=0] {
  line-join: round;
  line-color: mix(@fill3,@fill2,50);
  line-width: 1;
  [zoom>=5] { line-width: 1.4; }
  [zoom>=6] { line-width: 1.8; }
  [zoom>=8] { line-width: 2; }
  [zoom>=10] { line-width: 3; }
  [disputed=1] { line-dasharray: 4,4; }
}

#admin[admin_level>2][maritime=0] {
  line-join: round;
  line-color: @fill2;
  line-width: 1;
  line-dasharray: 3,2;
  [zoom>=6] { line-width: 1.5; }
  [zoom>=8] { line-width: 1.8; }
}

// Land Features //
#landuse[class='cemetery'],
#landuse[class='park'],
#landuse[class='wood'],
#landuse[class='pitch'],
#landuse_overlay {
  polygon-fill: mix(@land,@natural,80%);
  polygon-pattern-file: url("img/PolarGranite.jpg");
  polygon-pattern-opacity: 0.3;
  polygon-pattern-comp-op: multiply;
  //[zoom>=15] { polygon-fill:mix(@land,@fill4,95); }
}

/*
#landuse[class='sand'] { 
  polygon-fill: mix(@land,@fill4,90);
}
*/

#landuse[class='hospital'],
#landuse[class='industrial'],
#landuse[class='school'] { 
  polygon-fill: mix(@land,@fill3,85);
  polygon-pattern-file: url("img/PolarGranite.jpg");
  polygon-pattern-opacity: 0.3;
  polygon-pattern-comp-op: multiply;
}

#building::offset {
    polygon-fill: mix(@fill3,@land,50);
    polygon-opacity: 0.3;
    polygon-geometry-transform: translate(2,2);
}

#building { 
  polygon-fill: @land;
  line-color: @fill2;
  line-width: 0.5;
}

#aeroway {
  ['mapnik::geometry_type'=3][type!='apron'] { 
    polygon-fill: mix(@fill2,@land,25);
    [zoom>=16]{ polygon-fill: mix(@fill2,@land,50);}
  }
  ['mapnik::geometry_type'=2] { 
    line-color: mix(@fill3,@land,50);
    line-width: 1;
    [zoom>=13][type='runway'] { line-width: 4; }
    [zoom>=16] {
      [type='runway'] { line-width: 6; }
      line-width: 3;
      line-color: mix(@fill3,@land,50);
    }
  }
}

// Water Features //
#water {
  ::shadow {
    polygon-fill: @fill4;
  }
  ::fill {
    // a fill and overlay comp-op lighten the polygon-
    // fill from ::shadow.
    polygon-fill: @land;
    comp-op: soft-light;
    // blurring reveals the polygon fill from ::shadow around
    // the edges of the water
    image-filters: agg-stack-blur(10,10);
  }
}

#waterway {
  [type='river'],
  [type='canal'] {
    line-color: @fill4;
    line-width: 0.5;
    [zoom>=12] { line-width: 1; }
    [zoom>=14] { line-width: 2; }
    [zoom>=16] { line-width: 3; }
  }
  [type='stream'] {
    line-color: @fill4;
    line-width: 0.5;
    [zoom>=14] { line-width: 1; }
    [zoom>=16] { line-width: 2; }
    [zoom>=18] { line-width: 3; }
  }
}

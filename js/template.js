var template = [
	{
		"query" : "SELECT description FROM neighborhoods",
		"header" : "",
		"style" : [
			{
				"data" : "description",
				"format" : "<p><i>||data||</i></p>"
			}
		],
		"footer" : ""
	},
	{
		"query" : "SELECT organizations.* FROM neighborhoods INNER JOIN organization_lookup ON neighborhoods.id = neighborhood INNER JOIN organizations ON organizations.id = organization",
		"header" : "<div class='service'><h3><i class='fa fa-tree'></i> Organization</h3></div>",
		"style" : [
			{
				"data" : "name",
				"format" : "<h4>||data||</h4>"
			},
			{
				"data" : "contact",
				"format" : "<h5>Contact person:</h5><p>||data||</p>"
			},
			{
				"data" : "email",
				"format" : "<h5>Email:</h5><p><a href='mailto:||data||'>||data||</a></p>"
			},
			{
				"data" : "phone",
				"format" : "<h5>Phone:</h5><p>||data||</p>"
			},
			{
				"data" : "url",
				"format" : "<p><a href='http://||data||' target='_blank'>Website</a></p>"
			}
		],
		"footer" : "<p><a href='https://docs.google.com/forms/d/1bW0rMDHK-k-T8E0KrcMvd2b2sqLPR9Uvg1BcwtX-_wA/viewform'>Correct Neighborhood Organization information</a></p></div>"
	},
	{
		"query" : "SELECT neighborhoods.id, type, CASE WHEN type='video' THEN SUBSTRING(link FROM 19) END AS video, CASE WHEN type='doc' THEN link END AS doc FROM resources INNER JOIN neighborhoods ON neighborhoods.id = neighborhood",
		"header" : "<div><h3><i class='fa fa-institution'></i> Neighborhood Stories</h3>",
		"style" : [
			{
				"data" : "video",
				"format" : '<iframe src="//player.vimeo.com/video/||data||" width="250" height="140" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
			},
			{
				"data" : "doc",
				"format" : "<p><b><a href=||data||>Neighborhood Story</a></b></p>"
			}
		],
		"footer" : "</div>"
	},
	{
		"query" : "SELECT acs.* FROM acs INNER JOIN neighborhoods ON acs.id = neighborhoods.id",
		"header" : "<div><h3><i class='fa fa-th-list'></i> Summary Stats</h3><table>",
		"style" : [
			{
				"data" : "pop2013",
				"format" : "<tr><td>Population</td><td>||data||</td></tr>"
			},
			{
				"data" : "popdens2013",
				"format" : "<tr><td>Population Density</td><td>||data||</td></tr>"
			},
			{
				"data" : "units2013",
				"format" : "<tr><td>Housing Units</td><td>||data||</td></tr>"
			},
			{
				"data" : "unitdens2013",
				"format" : "<tr><td>Housing Density</td><td>||data||</td></tr>"
			},
			{
				"data" : "singlefamily2013",
				"format" : "<tr><td>Single Family Homes</td><td>||data||</td></tr>"
			},
			{
				"data" : "multifamily2013",
				"format" : "<tr><td>Multi-Family Dwellings</td><td>||data||</td></tr>"
			},
			{
				"data" : "owner2013",
				"format" : "<tr><td>Owner Occupied</td><td>||data||</td></tr>"
			},
			{
				"data" : "renter2013",
				"format" : "<tr><td>Render Occupied</td><td>||data||</td></tr>"
			},
			{
				"data" : "vacant2013",
				"format" : "<tr><td>Vacant Units</td><td>||data||</td></tr>"
			}
		],
		"footer" : "</table></div>"
	},
	{
		"query" : "SELECT council, councilper FROM neighborhoods INNER JOIN city_council ON ST_WITHIN( ST_CENTROID( neighborhoods.geom ), city_council.geom )",
		"header" : "<div><h3><i class='fa fa-info-circle'></i> Key Facts</h3><table>",
		"style" : [
			{
				"data" : "council",
				"format" : "<p><a href=\"http://dallascityhall.com/government/citycouncil/district||data||/Pages/default.aspx\"><b>City Council District ||data||</b></a></p>"
			},
			{
				"data" : "councilper",
				"format" : "<h5>Councilperson:</h5><p>||data||</p>"
			}
		],
		"footer" : "</div>"
	}
];

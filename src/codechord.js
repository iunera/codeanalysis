var focusonincomingconnectionslabel = "Show additional chart: Focus on incoming connections";
var consumestring = "calls";
var consumedstring = "gets called";
var amountname = "times";

// Chart dimensions.
var padding = 0.02;
var w = 1000, h = 1000, r1 = Math.min(w, h) / 4, r0 = r1 - 20, format = d3
		.format(",.0f");// d3.format(",.3r");
// The color scale, for different categories of "worrisome" risk.
var fill = d3.scale.ordinal().domain([ 0, 1, 2 ]).range(
		[ "#69a3f0", "#ca69f0", "#f06969", "#ff0016" ]);

function getUrlVar(key) {
	var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search);
	if (result == null)
		return null;
	return result && unescape(result[1]) || "";
}

// needed to show or hide the currentslection just if any is there
$('#currentselection').hide();
$('#currentselectionlabel').hide();
var file = getUrlVar('file');

if(file==null || file=="" || file==="" ){
	file="jdt.csv";
	var urltext = window.location.href;
	urltext=urltext+"?file="+file;
	window.open(urltext, "_self");

}

var filter = getUrlVar('filter');
var showfocusonincoming = getUrlVar('showincoming');
if (showfocusonincoming == null)
	showfocusonincoming = 'false';

$("label[for='showincomingconnections']").text(focusonincomingconnectionslabel);
if (showfocusonincoming == 'true') {

	$('#showincomingconnections').prop('checked', true);

} else {
	$('#showincomingconnections').prop('checked', false);
}

$("#showincomingconnections").click(
		function() {
			var urltext = window.location.href;

			if (getUrlVar('showincoming') == null) {
				urltext = urltext + "&showincoming=" + true
			} else {
				if (showfocusonincoming == 'false') {
					urltext = urltext.replace(new RegExp("showincoming=false",
							'g'), "showincoming=true");
				} else {
					urltext = urltext.replace(new RegExp("showincoming=true",
							'g'), "showincoming=false");
				}
			}
			window.open(urltext, "_self");
		});

if (filter == null)
	filter = "all";
var filterarray;
$('#Filterscaption').hide();
var drilldown = getUrlVar('drilldown');
if (drilldown == null)
	drilldown = 'false';
if (filter != null && (filter === 'all') == false)
	filterarray = $.parseJSON(filter);
if (filterarray != null) {
	var appliedfilters = "";
	filterarray.forEach(function(entry) {
		appliedfilters = appliedfilters + entry + '<br>';
	});
	$('#Filterscaption').show();
	//document.write('</p> ');
	$('#Filters').html(appliedfilters);
}

var exclude = getUrlVar('exclude');
$('#Excludescaption').hide();
if (exclude == null)
	exclude = "none";
var excludearray;
if (exclude != null && (exclude === 'none') == false)
	excludearray = $.parseJSON(exclude);
if (excludearray != null) {
	var appliedexcludes = "";
	//document.write('<p><b>Excluded elements:</b> <br>');
	excludearray.forEach(function(entry) {
		appliedexcludes = appliedexcludes + entry + '<br>';
	});
	$('#Excludescaption').show();
	$('#Excludes').html(appliedexcludes);
}

function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}

// Square matrices, asynchronously loaded; credits is the transpose of debits.
var debits = [], credits = [];

// The chord layout, for computing the angles of chords and groups.
var layout = d3.layout.chord()
//.sortGroups(d3.descending)
//.sortSubgroups(d3.descending)
.sortChords(d3.descending).padding(.04);

// The arc generator, for the groups.
var arc = d3.svg.arc().innerRadius(r0).outerRadius(r1);

// The chord generator (quadratic Bézier), for the chords.
var chord = d3.svg.chord().radius(r0);

// Add an SVG element for each diagram, and translate the origin to the center.
var svg = d3.select("d3content").data([ debits, credits ]).enter()
		.append("div").style("display", "inline-block")
		.style("width", w + "px").style("height", h + "px").style("margin-top", "70px")
		.append("svg:svg")
		.attr("width", w).attr("height", h).append("svg:g").attr("transform",
				"translate(" + w / 2 + "," + h / 2 + ")")

;

// Load our data file…

d3
		.csv(
				file,
				function(data) {
					data = data.filter(function(row) {
						if ((exclude === 'none') == false) {
							var withouttopdebtor = $.grep(excludearray,
									function(f) {
										return row.debtor === f;
									});
							var withouttopcreditor = $.grep(excludearray,
									function(e) {

										return e === row.creditor;
									});
							var withoutdebtor = $.grep(excludearray,
									function(f) {
										return row.debtor === f;
									});
							var withoutcreditor = $.grep(excludearray,
									function(e) {

										return e === row.creditor;
									});

							if (withouttopdebtor.length != 0
									|| withouttopcreditor.length != 0
									|| withoutdebtor.length != 0
									|| withoutcreditor.length != 0)
								return false;
						}

						if (drilldown === "true") {
							if (filter === 'all')
								return true;

							var b = $.grep(filterarray, function(f) {
								return row.topdebtor === f;
							});
							var a = $.grep(filterarray, function(e) {

								return e === row.topcreditor;
							});
							if (a.length != 0 || b.length != 0) {

								var zddf = a.length != 0 && b.length != 0;
							}

							return a.length != 0 && b.length != 0;

						} else {

							if (filter === 'all')
								return true;
							var b = $.grep(filterarray, function(f) {
								return row.debtor === f;
							});
							var a = $.grep(filterarray, function(e) {

								return e === row.creditor;
							});
							return a.length != 0 && b.length != 0;
						}
					});

					var countries = {}, array = [], n = 0;

					// Compute a unique id for each country.
					data.forEach(function(d) {
						var permanent = false;
						var selectednodes = new Array();

						d.creditor = country(d.creditor);
						d.debtor = country(d.debtor);
						d.debtor.risk = d.risk;
						d.valueOf = value; // convert object to number implicitly

					});

					// Initialize a square matrix of debits and credits.
					for (var i = 0; i < n; i++) {
						debits[i] = [];
						credits[i] = [];
						for (var j = 0; j < n; j++) {
							debits[i][j] = 0;
							credits[i][j] = 0;
						}
					}

					// Populate the matrices, and stash a map from id to country.
					data.forEach(function(d) {
						debits[d.creditor.id][d.debtor.id] = d;
						credits[d.debtor.id][d.creditor.id] = d;
						array[d.creditor.id] = d.creditor;
						array[d.debtor.id] = d.debtor;
					});

					// For each diagram…
					svg
							.each(function(matrix, j) {
								// check if the diagram with focus on incoming connections should also be shown
								if (j == 0 || showfocusonincoming == 'true') {
									var permanent = false;
									var selectednodes = new Array();
									// categroy change listener
									var category = null;
									category = "outgoing and incoming";
									$("input[name='category']")
											.click(
													function() {
														if (j == 1) {
															// we have the second diagram here- invert the mode
															if (this.value === "outgoing")
																category = "incoming";
															if (this.value === "incoming")
																category = "outgoing";
															if (this.value === "outgoing and incoming")
																category = this.value;
														} else
															category = this.value;
														if (permanent == true)
															fadepermanent();
													});

									function generatefilter() {
										var filternodes = new Array();

										selectednodes
												.forEach(function(entry) {
													var o = array[entry];
													filternodes
															.push(array[entry].name);
												});
										return filternodes;
									}

									$("#Filter")
											.click(
													function() {
														if (j == 0) {

															if (selectednodes.length == 0)
																window
																		.open(
																				window.location.pathname
																						+ "?file="
																						+ file
																						+ "&filter=all&drilldown="
																						+ false,
																				"_self");
															else {

																var filternodes = generatefilter();

																fadepermanent();
																filternodes = filternodes
																		.filter(onlyUnique);
																url = window.location.pathname
																		+ "?file="
																		+ file
																		+ "&filter="
																		+ JSON
																				.stringify(filternodes)
																		+ "&drilldown="
																		+ false;
																window
																		.open(
																				url,
																				"_self");

															}
														}
													});

									$("#Exclude")
											.click(
													function() {
														if (j == 0) {

															if (selectednodes.length == 0)
																window
																		.open(
																				window.location.pathname
																						+ "?file="
																						+ file
																						+ "&filter="
																						+ filter
																						+ "&drilldown="
																						+ drilldown
																						+ "&exclude="
																						+ exclude,
																				"_self");
															else {

																var filternodes = generatefilter();

																fadepermanent();
																filternodes = filternodes
																		.filter(onlyUnique);
																if (exclude === 'none') {
																	url = window.location.pathname
																			+ "?file="
																			+ file
																			+ "&exclude="
																			+ JSON
																					.stringify(filternodes)
																			+ "&drilldown="
																			+ drilldown
																			+ "&filter="
																			+ filter;
																} else {
																	var new_array = filternodes
																			.concat(excludearray);
																	url = window.location.pathname
																			+ "?file="
																			+ file
																			+ "&exclude="
																			+ JSON
																					.stringify(new_array)
																			+ "&drilldown="
																			+ drilldown
																			+ "&filter="
																			+ filter;
																}
																window
																		.open(
																				url,
																				"_self");

															}
														}
													});

									function executedrilldown() {

										var uuu = window.location.pathname
												.substring(
														0,
														window.location.pathname
																.lastIndexOf('/') + 1)
												+ file.substring(0, file
														.lastIndexOf('.'))
												+ "_drilldown.csv";
										$
												.ajax({
													type : 'HEAD',
													url : window.location.pathname
															.substring(
																	0,
																	window.location.pathname
																			.lastIndexOf('/') + 1)
															+ file
																	.substring(
																			0,
																			file
																					.lastIndexOf('.'))
															+ "_drilldown.csv",
													complete : function(e, d) {
														if (e.status == 404) {
															alert("ERROR: No drill down file found \n:-(");
															return;
														} else {
															var filedrilldown = file
																	.substring(
																			0,
																			file
																					.lastIndexOf('.'))
																	+ "_drilldown.csv";
															if (selectednodes.length == 0)
																window
																		.open(
																				window.location.pathname
																						+ "?file="
																						+ filedrilldown
																						+ "&filter=all&drilldown="
																						+ true,
																				"_self");
															else {

																var filternodes = generatefilter();

																fadepermanent();
																filternodes = filternodes
																		.filter(onlyUnique);
																url = window.location.pathname
																		+ "?file="
																		+ filedrilldown
																		+ "&filter="
																		+ JSON
																				.stringify(filternodes)
																		+ "&drilldown="
																		+ true;
																window
																		.open(
																				url,
																				"_self");

															}
														}
													}
												});

									}
									$("#DrillDown").click(function() {
										if (j == 0) {
											executedrilldown();
										}

									});
									function fadepermanent() {
										// ensure all chrods are shown and not filtered
										svg.selectAll(".chord").filter(
												function(d) {
													return true;
												}).transition().style(
												"opacity", 1);

										svg.selectAll('.group').filter(
												function(d) {
													return true;
												}).transition().style(
												"opacity", 1);
										// end of showing all chords  

										svg
												.selectAll(".chord")
												.filter(
														function(d) {

															var a = $
																	.grep(
																			selectednodes,
																			function(
																					e) {
																				return e == d.source.index;
																			});
															var b = $
																	.grep(
																			selectednodes,
																			function(
																					e) {
																				return e == d.target.index;
																			});
															if ((category === "outgoing") == true) {
																if (b.length != 0)
																	return false;
															}
															if ((category === "outgoing and incoming") == true) {
																if (a.length != 0)
																	return false;
																if (b.length != 0)
																	return false;
															}
															if ((category === "incoming") == true) {

																if (a.length != 0)
																	return false;
															}

															return true;
														}).transition().style(
														"opacity", 0.08);

										var groups2 = [];
										svg
												.selectAll(".chord")
												.filter(
														function(d) {
															var z = $
																	.grep(
																			selectednodes,
																			function(
																					e) {

																				if (e == d.source.index) {
																					if ((category === "outgoing") == true) {
																						return false;
																					}
																					if ((category === "outgoing and incoming") == true) {
																						groups2
																								.push(d.target.index);
																						groups2
																								.push(d.source.index);
																					}
																					if ((category === "incoming") == true) {
																						groups2
																								.push(d.target.index);
																						groups2
																								.push(d.source.index);
																					}
																					return true;
																				}

																				return false;
																			});
															var u = $
																	.grep(
																			selectednodes,
																			function(
																					e) {

																				if (e == d.target.index) {
																					if ((category === "incoming") == true) {
																						return false;
																					}
																					if ((category === "outgoing and incoming") == true) {
																						groups2
																								.push(d.target.index);
																						groups2
																								.push(d.source.index);
																					}
																					if ((category === "outgoing") == true) {
																						groups2
																								.push(d.target.index);
																						groups2
																								.push(d.source.index);
																					}
																					return true;
																				}

																				return false;
																			});
														});
										// groups.push(i);
										var length = groups2.length;
										svg
												.selectAll('.group')
												.filter(
														function(d) {
															var uu = $
																	.grep(
																			groups2,
																			function(
																					e) {
																				return e == d.index;
																			});
															if (uu.length != 0)
																return false;
															return true;
														}).transition().style(
														"opacity", 0.08);

										// fade the indirectly selected nodes a bit
										svg
												.selectAll('.group')
												.filter(
														function(d) {
															var z = $
																	.grep(
																			selectednodes,
																			function(
																					e) {

																				if (e == d.index)
																					return true;
																				return false;
																			});
															var uu = $
																	.grep(
																			groups2,
																			function(
																					e) {
																				return e == d.index;
																			});
															if (z.length != 0)
																return false;
															if (uu.length != 0)
																return true;

														}).transition().style(
														"opacity", 0.45);

									}

									function fade(opacity) {

										return function(g, i) {
											if (permanent == true) {

												fadepermanent();
											} else {

												svg
														.selectAll(".chord")
														.filter(
																function(d) {
																	//

																	if ((category === "incoming") == true) {
																		if (d.source.index == i)
																			return false;
																	}
																	if ((category === "outgoing and incoming") == true) {
																		if ((d.source.index == i)
																				|| (d.target.index == i))
																			return false;
																		;
																	}
																	if ((category === "outgoing") == true) {

																		if (d.target.index == i)
																			return false;
																	}
																	return true;

																	//

																	//  return d.source.index != i && d.target.index != i;
																}).transition()
														.style("opacity",
																opacity);
												var groups = [];
												svg
														.selectAll(".chord")
														.filter(
																function(d) {
																	if (d.source.index == i) {
																		if ((category === "incoming") == true
																				|| (category === "outgoing and incoming") == true)
																			groups
																					.push(d.target.index);

																		//groups.push(d.target.index);
																	}
																	if (d.target.index == i) {
																		if ((category === "outgoing") == true
																				|| (category === "outgoing and incoming") == true)
																			groups
																					.push(d.source.index);

																	}
																});
												groups.push(i);
												var length = groups.length;
												svg
														.selectAll('.group')
														.filter(
																function(d) {
																	for (var i = 0; i < length; i++) {
																		if (groups[i] == d.index)
																			return false;
																	}
																	return true;
																}).transition()
														.style("opacity",
																opacity);
											}

										};
									}
									;

									var svg = d3.select(this);

									// Add chords.

									// Compute the chord layout.
									layout.matrix(matrix);

									svg
											.selectAll("path.chord")
											.data(layout.chords)
											.enter()
											.append("svg:path")
											.attr("class", "chord")
											.style(
													"fill",
													function(d) {
														return fill(d.source.value.risk);
													})
											.style(
													"stroke",
													function(d) {
														return d3
																.rgb(
																		fill(d.source.value.risk))
																.darker();
													}).attr("d", chord).append(
													"svg:title")
											.text(function(d) {
												return getconsumestring(d);
											});

									function deactivateselection() {
										if (permanent) {
											selectednodes.length = 0;
											permanent = false;
											if (j == 0) {
												$('#currentselection').hide();
												$('#currentselectionlabel')
														.hide();
												$('#currentselectiontext').val("");
											}
											// ensure all chrods are shown and not filtered
											svg.selectAll(".chord").filter(
													function(d) {
														return true;
													}).transition().style(
													"opacity", 1);

											svg.selectAll('.group').filter(
													function(d) {
														return true;
													}).transition().style(
													"opacity", 1);
											// end of showing all chords  
											// removing needed agian that the reset takes place
											var text = svg.selectAll(
													"path.chord").selectAll(
													"title");
											text.remove();
											// add the title to all elements agian
											svg
													.selectAll("path.chord")
													.data(layout.chords)
													.append("svg:title")
													.text(
															function(p) {
																return getconsumestring(p);
															});

										}
									}

									$("#Permanentoff").click(function() {
										deactivateselection();
									});

									// Add groups.
									var g = svg.selectAll("g.group").data(
											layout.groups).enter().append(
											"svg:g").attr("class", "group");

									// Add the group arc.
									g
											.append("svg:path")
											.style(
													"fill",
													function(d) {
														return fill(array[d.index].risk);
													})
											// .style("fill", fill)
											.style("stroke", fill)
											.attr(
													"id",
													function(d, i) {
														return "group"
																+ d.index + "-"
																+ j;
													})
											.attr("d", arc)
											.on("mouseover", fade(0.1))
											.on("mouseout", fade(1))
											.on(
													"click",
													function(d) {
														if ($.inArray(d.index,
																selectednodes) == -1)
															selectednodes
																	.push(d.index);
														else
															selectednodes
																	.splice(
																			$
																					.inArray(
																							d.index,
																							selectednodes),
																			1)
															// show the current selection as string for the first graphic
														if (j == 0) {
															var filternodescurrent = generatefilter();
															$(
																	'#currentselection')
																	.show();
															$(
																	'#currentselectionlabel')
																	.show();
															var selectionstring = "";
															filternodescurrent
																	.forEach(function(
																			entry) {
																		selectionstring = selectionstring
																				+ entry
																				+ ";\n";

																	});

															$(
																	'#currentselectiontext')
																	.val(
																			selectionstring);
															//$('#currentselection').trigger('autosize.resize');
															//$('#currentselection').trigger('updateHeight');
														}

														permanent = true;
														// remove all current titles"path.chord, text.groupLabel"
														var text = svg
																.selectAll(
																		"path.chord")
																.selectAll(
																		"title");
														text.remove();

														// add the titles to the shown elements
														svg
																.selectAll(
																		"path.chord")
																.data(
																		layout.chords)

																.append(
																		"svg:title")
																.text(
																		function(
																				p) {

																			if (permanent == false)
																				return getconsumestring(p);
																			var a = $
																					.grep(
																							selectednodes,
																							function(
																									e) {
																								return e == p.source.index;
																							});
																			var b = $
																					.grep(
																							selectednodes,
																							function(
																									e) {
																								return e == p.target.index;
																							});
																			// check for outgoing and incoming
																			if ((category === "outgoing") == true) {
																				if (b.length != 0)
																					return getconsumestring(p);

																			}
																			if ((category === "incoming") == true)
																				if (a.length != 0)
																					return getconsumestring(p);

																			// end of outgoing incoming check
																			if ((category === "outgoing and incoming") == true)
																				if (a.length != 0
																						|| b.length != 0)
																					return getconsumestring(p);

																			//return " "+d.source.value.creditor.name + " calls "+ format(d.source.value) + " different types out of "  + d.source.value.debtor.name;
																		});

														fadepermanent();

													}).on("dblclick",
													function(d) {
														deactivateselection();

													}).append("svg:title")
											.text(function(d) {
												return getconsumedstring(d);
											});

									// Add the group label (but only for large groups, where it will fit).
									// An alternative labeling mechanism would be nice for the small groups.
									g
											.append("svg:text")
											.each(
													function(d) {
														d.angle = (d.startAngle + d.endAngle) / 2;
													})
											.attr("dy", ".35em")
											.attr(
													"text-anchor",
													function(d) {
														return d.angle > Math.PI ? "end"
																: null;
													})
											.attr(
													"transform",
													function(d) {
														return "rotate("
																+ (d.angle
																		* 180
																		/ Math.PI - 90)
																+ ")"
																+ "translate("
																+ (r0 + 26)
																+ ")"
																+ (d.angle > Math.PI ? "rotate(180)"
																		: "");
													}).attr(
													"xlink:href",
													function(d) {
														return "#group"
																+ d.index + "-"
																+ j;
													}).text(function(d) {
												return array[d.index].name;
											});

								}
							})

					;
					function getconsumestring(p) {
						return " " + p.source.value.creditor.name + " "
								+ consumestring + " "
								+ p.source.value.debtor.name + " "
								+ format(p.source.value) + " " + amountname;
					}

					function getconsumedstring(d) {
						return " "
								+ array[d.index].name
								+ " "
								+ (j ? consumedstring + " " : consumestring
										+ " ") + format(d.value) + " "
								+ amountname;
					}
					// Memorize the specified country, computing a unique id.
					function country(d) {
						return countries[d] || (countries[d] = {
							name : d,
							id : n++
						});
					}

					// Converts a debit object to its primitive numeric value.
					function value() {
						return +this.amount;
					}
				});
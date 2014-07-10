define(['jquery', 'elgg'], function ($, elgg) {
	
	return function(selector, feed_url) {
		var $wrapper = $(selector);
		$wrapper.empty();
		
		var config = $wrapper.data();
		
		var feed_url = config.feedUrl;
		var limit = config.limit;

		$.getJSON(
			"//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=" + limit + "&output=json_xml&q=" + encodeURIComponent(feed_url) + "&hl=en&callback=?",
			function (data) {
				if (data.responseData) {
					var xmlDoc = $.parseXML(data.responseData.xmlString);
					var feed = data.responseData.feed;
					
					var $items = $(xmlDoc).find("item");
					
					var s = "";
					
					if (config.showFeedTitle) {
						s += "<h3><a href='" + feed.link + "' target='_blank'>" + feed.title + "</a></h3>";
					}
					
					s += "<ul class='widget-manager-rss-result elgg-list'>";
					$.each(feed.entries, function (index, item) {
						s += "<li class='clearfix elgg-item'>";
						var description = item.content.replace(/(<([^>]+)>)/ig,"");
						if (config.showExcerpt) {
							s += "<div class='pbm'>";
							s += "<div><a href='" + item.link + "' target='_blank'";
							if (config.showInLightbox) {
								var popup_content = "<div class='elgg-module elgg-module-info elgg-module-rss-popup'>";
								popup_content += "<div class='elgg-head'><h3>" + item.title + "</h3></div>";
								popup_content += "<div class='elgg-body'>" + description + "</div>";
								popup_content += "</div>";
								
								popup_content = popup_content
									.replace(/&/g, '&amp;')
						            .replace(/"/g, '&quot;')
						            .replace(/'/g, '&#39;')
						            .replace(/</g, '&lt;')
						            .replace(/>/g, '&gt;');
								
								s += " class='elgg-lightbox' data-colorbox-opts='{ \"html\":\"" + popup_content + "\", \"innerWidth\": 600 }'";
							}
							
							s += ">" + item.title + "</a></div>";
							s += "<div class='elgg-content'>";
							if (config.showItemIcon) {
								var xml_item = $items[index];
								
								var enclosure = $(xml_item).find("enclosure");
								var enclosure_url = enclosure.attr("url");
								var enclosure_type = enclosure.attr("type");
							
								s += "<a href='" + item.link + "' target='_blank'><img class='widgets_rss_feed_item_image' src='" + enclosure_url + "' /></a>";
							}
							
							s += description;
							s += "</div>";
							
							if (config.postDate) {
								var i = new Date(item.publishedDate);
								s += "<div class='elgg-subtext'>" + i.toLocaleDateString() + "</div>";
							}
							
							s += "</div>";
						} else {
							s += "<div class='elgg-image-block'>";

							s += "<a href='" + item.link + "' target='_blank'";
							if (config.showInLightbox) {
								var popup_content = "<div class='elgg-module elgg-module-info elgg-module-rss-popup'>";
								popup_content += "<div class='elgg-head'><h3>" + item.title + "</h3></div>";
								popup_content += "<div class='elgg-body'>" + description + "</div>";
								popup_content += "</div>";
								
								popup_content = popup_content
									.replace(/&/g, '&amp;')
						            .replace(/"/g, '&quot;')
						            .replace(/'/g, '&#39;')
						            .replace(/</g, '&lt;')
						            .replace(/>/g, '&gt;');
								
								s += " class='elgg-lightbox' data-colorbox-opts='{ \"html\":\"" + popup_content + "\", \"innerWidth\": 600 }'";
							}
							
							s += ">" + item.title + "</a>";
							if (config.postDate) {
								var i = new Date(item.publishedDate);
								s += "<div class='elgg-subtext'>" + i.toLocaleDateString() + "</div>";
							}
							s += "</div>";
						}
						
						s += "</li>";
					});
					s += "</ul>";
					
					$wrapper.replaceWith(s);
				} else {
					$wrapper.append(data.responseDetails);
				}
			}
		);
	};
});

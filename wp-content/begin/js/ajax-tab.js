function ajax_loadTabContent(tab_name, page_num, container, args_obj) {
	var post_not_id = Ajax_post_id.post_not_id;
	var container = jQuery(container);
	var tab_content = container.find("#" + tab_name + "-tab-content");
	var isLoaded = tab_content.data("loaded");
	if (!isLoaded || page_num != 1) {
		if (!container.hasClass("ajax-loading")) {
			container.addClass("ajax-loading");
			tab_content.load(ajax_tab.ajax_url, {
				action: "ajax_widget_content",
				exclude: post_not_id,
				tab: tab_name,
				page: page_num,
				args: args_obj
			},
			function() {
				container.removeClass("ajax-loading");
				tab_content.data("loaded", 1).hide().fadeIn().siblings().hide();
				lazy();
			})
		}
	} else {
		tab_content.fadeIn().siblings().hide()
	}
}

jQuery(document).ready(function() {
	jQuery(".ajax_widget_content").each(function() {
		var $this = jQuery(this);
		var widget_id = this.id;
		var args = $this.data("args");
		$this.find(".ajax-tabs a").click(function(e) {
			e.preventDefault();
			jQuery(this).parent().removeClass("tab-first");
			jQuery(this).parent().addClass("selected").siblings().removeClass("selected");
			var tab_name = this.id.slice(0, -4);
			ajax_loadTabContent(tab_name, 1, $this, args)
		});
		$this.on("click", ".ajax-pagination a",
		function(e) {
			e.preventDefault();
			var $this_a = jQuery(this);
			var tab_name = $this_a.closest(".tab-content").attr("id").slice(0, -12);
			var page_num = parseInt($this_a.closest(".tab-content").children(".page_num").val());
			if ($this_a.hasClass("next")) {
				ajax_loadTabContent(tab_name, page_num + 1, $this, args)
			} else {
				$this.find("#" + tab_name + "-tab-content").data("loaded", 0);
				ajax_loadTabContent(tab_name, page_num - 1, $this, args)
			}
		});
		$this.find(".ajax-tabs a").first().click()
	})
});
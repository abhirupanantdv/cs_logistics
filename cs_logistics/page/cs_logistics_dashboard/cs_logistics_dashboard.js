frappe.pages['cs_logistics_dashboard'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'CS Logistics Dashboard',
		single_column: true
	});

	// Render the container for our React app bundle
	$(wrapper).find('.layout-main-section').empty().append('<div id="root"></div>');
}

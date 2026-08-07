frappe.pages['cs_logistics_dashboard'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'CS Logistics Dashboard',
		single_column: true
	});

	// Render iframe for the CS Logistics app
	$(wrapper).find('.layout-main-section').empty().append(
		'<iframe src="/cs_logistics" style="width: 100%; height: calc(100vh - 100px); border: none; min-height: 700px;"></iframe>'
	);
}

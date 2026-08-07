import os
import frappe

no_cache = 1

def get_context(context):
	context.no_cache = 1
	context.show_sidebar = 0
	context.boot = get_boot()
	index_html_path = frappe.get_app_path("cs_logistics", "public", "cs_logistics_app", "index.html")
	if os.path.exists(index_html_path):
		with open(index_html_path, "r", encoding="utf-8") as f:
			context.app_html = f.read()
	else:
		context.app_html = (
			"<div style='text-align:center; padding: 50px; font-family: sans-serif;'>"
			"<h1>CS Logistics</h1>"
			"<p>Frontend assets not built. Please run <code>npm run build</code> inside <code>apps/cs_logistics/frontend</code>.</p>"
			"</div>"
		)

def get_boot():
	return frappe._dict({
		"site_name": frappe.local.site,
	})

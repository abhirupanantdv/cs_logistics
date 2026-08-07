app_name = "cs_logistics"
app_title = "CS Logistics"
app_publisher = "CS Logistics"
app_description = "CS Logistics dashboard custom application."
app_email = "info@cslogistics.com"
app_license = "mit"

# website route rules
website_route_rules = [
	{"from_route": "/cs_logistics/<path:app_path>", "to_route": "cs_logistics"},
]


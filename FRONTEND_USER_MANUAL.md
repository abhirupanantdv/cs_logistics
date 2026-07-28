# CS-Logistics Frontend - User Manual

This manual serves as a guide for users operating the CS-Logistics web application portal. It covers the login flow, dashboard widgets, container tracking, job card workflows, available logistics operations, and master data management (drivers, fleet, and customers).

---

## 1. Getting Started & Authentication

### 1.1 Accessing the Application
Open the application URL in a web browser. The system will direct you to the **Login Page** if you are not currently authenticated.

### 1.2 Logging In
1. Enter your credentials on the Login screen (Email/Username and Password).
2. Click **Login** to authenticate.
3. Upon successful validation, the system will route you to the **Dashboard**.

### 1.3 Logging Out
To secure your session:
1. Click the **Logout** button located at the bottom of the left sidebar.
2. The application will terminate the active session and redirect you back to the login screen.

---

## 2. Navigation & Layout

The user interface uses a dual-pane layout:
* **Sidebar Navigation (Left Pane)**: Provides quick access to all primary sections:
  * **Dashboard**: Key operational statistics and activity summaries.
  * **Containers**: List and details of all shipping containers.
  * **Job Cards**: Track and log operational status for shipments.
  * **Operations**: Audit logs and history records of container handling actions.
  * **Customers**: Contact details and accounts of partners.
  * **Drivers**: Profiles, employee listings, and status indicators.
  * **Fleet**: Odometer, fuel type, and specifications of operational vehicles.
* **Main Content Area (Right Pane)**: Displays data tables, search filters, charts, and detailed information based on the selected section.

---

## 3. Dashboard Overview

The **Dashboard** is the operational control center, showing real-time KPIs and trends.

### 3.1 Key Performance Indicators (KPI Cards)
* **Total Containers**: Count of containers currently tracked in the system.
* **Total Job Cards**: Overall number of active and closed job cards.
* **Operations**: Aggregate counts of all transaction steps logged.
* **Invoice Revenue (This Month)**: Total monthly revenue generated (shown in Papua New Guinean Kina, **PGK**).

### 3.2 Visual Analytics & Activity Summaries
* **Container Status Chart**: Graphical split of containers by status (e.g., *Available*, *In Transit*, *In Yard*, *Dispatched*, *Delivered*, *Picked Up*).
* **Operations Summary**: A breakdown listing the volume of operations completed under each type.
* **Recent Job Cards**: Direct links to view the details of recently modified or created Job Cards.
* **Upcoming Deliveries & Pickups**: Quick-view list of scheduled gate and dispatch operations.
* **Operations Trend Chart**: Chart showing operational volume over the course of the calendar months.

---

## 4. Containers Management

The **Containers Page** allows you to view and track all container units.

### 4.1 Searching & Filtering
* **Search Box**: Search containers by Container Number, Type/Item, Owner, Status, or Size (feet).
* **Automatic Exclusions**: Standard available containers that do not belong to CSL (e.g. external supplier containers marked as Available) are filtered out automatically to keep the list clean.

### 4.2 Adding a Container
1. Click the **New Container** button at the top-right.
2. Complete the container creation form (ID/Number, Owner, Size, Type).
3. Save to immediately update the main container records.

### 4.3 Container Statuses
Containers move through various statuses as operations progress:
* `Available`: Clean unit ready for placement on job cards.
* `In Transit`: Container currently en route.
* `In Yard`: Stored inside the terminal or yard.
* `Dispatched`: Sent out to the destination.
* `Quoted`: Part of a pending quotation.
* `Invoiced`: Billed to the customer.
* `Rent`: Out on rental service.
* `Delivered`: Arrived at consignee.
* `Picked Up`: Received from the shipper.

---

## 5. Job Cards Workflow

Job Cards represent the core operational unit. A Job Card aggregates containers, tracks operational milestones, and manages financial milestones.

### 5.1 Main Job Cards Listing
* The list displays: Job Card No, Customer Name, a nested view of the container units involved (showing Container No, Owner, Size, Status, and Type), and the **Last Completed Operation**.
* Click the **New Job Card** button to register a new shipment/service requirement.

### 5.2 Performing Operations on a Job Card
Click on any Job Card row to access the **Job Card Details Page**. This page is split into three main sections:
1. **Container Selection (Left Pane)**:
   * Displays all containers tied to the selected Job Card.
   * Use the check-boxes to select which containers you want to operate on.
   * *Note: You must select at least one container before running an operation.*
2. **Available Operations (Middle Pane)**:
   * Select a card to initiate a logistics milestone.
   * Available actions include:
     * **Quotation**: Generate customer pricing estimates.
     * **Gate In**: Log container arrival into the depot.
     * **Gate Out**: Log container departure from the depot.
     * **Pickup & Delivery Docket**: Generate movement dockets.
     * **Equipment Interchange Receipt (EIR)**: Receipt of container condition. *Note: Can only be processed for one container at a time.*
     * **Sales Invoice**: Create customer invoice billing.
3. **Operation History (Right Pane)**:
   * Shows a reverse-chronological list of all operations performed on this Job Card.
   * Columns include: Operation Type, Document ID, Involved Containers, Creation Time, and Remarks.
   * Clicking a container checkbox in the left pane automatically filters the history view to show only records related to the checked container.

---

## 6. Operations & Records Audit

The **Operations Page** provides a central audit trail of all transactions logged in the system.

### 6.1 Browsing Operations
Tabs are provided to filter logs by specific operation types:
* **Gate In / Gate Out Logs**
* **Equipment Interchange Receipts (EIR)**
* **Quotations**
* **Sales Invoices**
* **Pickup Dockets / Delivery Dockets**

### 6.2 Searching & Filtering Records
* Search for any record by Document ID, Job Card No, Customer, or Driver.
* Filter results by date ranges: **All Time**, **Last 30 Days**, **Last 90 Days**, **Last 6 Months**, **Last 1 Year**, or **Custom Range** (via start/end calendar selectors).

### 6.3 Exporting Audit Data
Click the **Export CSV** button on the top right of the operations list to download the filtered dataset directly to your local computer.

---

## 7. Master Data Management

### 7.1 Drivers
* Track the driver workforce active in logistics.
* View Driver ID, Full Name, Status (`Active` or `Inactive`), Profile Photo, and linked ERP Employee ID.
* Use the **New Driver** form to onboard new personnel.

### 7.2 Fleet (Vehicles)
* Track mechanical assets.
* Lists Vehicle ID (License plate/rego), Model, Mileage (based on the latest odometer reading in km), Fuel Type, Make, and Company.
* Add new vehicles using the **New Fleet** modal form.

### 7.3 Customers
* View business partner records.
* Displays Customer Name, Type (Individual/Corporate), Customer Group, Territory, and primary contact information (Email, Mobile).
* Click on any customer to see their billing addresses and full profiles in a pop-up details view.

# Geo Territories n8n Node

[![n8n community node](https://img.shields.io/badge/n8n-community%20node-ff69b4.svg)](https://n8n.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)

Stop managing complex tables of ZIP codes and postal codes. Start drawing visual territories.

This custom n8n node integrates seamlessly with [Geo Territories](https://geoterritories.com/) to bring powerful, visual geofencing capabilities into your automated workflows. With this node, you can instantly validate address coordinate points against your custom-drawn geographic polygons (fences) to route leads, dispatch teams, filter serviceability, and much more.

---

## 🌟 Key Features

*   **Visual Geofencing**: Check whether any geographical point (latitude and longitude) lies within your custom-drawn boundaries.
*   **Flexible Matching Modes**: Validate points against:
    *   **One Fence**: A single selected territory/fence from a dynamic list.
    *   **Multiple Fences**: Multiple selected territories/fences.
    *   **All Fences**: All active territories defined in your account.
*   **Dynamic Dropdowns**: Dynamically queries the Geo Territories API (`GET /fences`) to load your custom boundaries directly in n8n.
*   **OAuth2 Authentication**: Secure connection via standard OAuth2 with PKCE flow.

---

## 🚀 Real-world Use Cases

Integrating Geo Territories into n8n opens up thousands of operational possibilities:

*   **Dynamic Lead Routing**: Automatically detect which sales representative's visual territory a new lead belongs to and instantly assign it in HubSpot, Salesforce, or Zoho.
*   **Serviceability Filtering**: Run a prospect's address coordinates through the node. If they are outside your service boundary, automatically trigger a polite "Not in service area" email, saving time for your sales team.
*   **Competitor Proximity Alerts**: Draw polygons around competitor locations and trigger Slack notifications or specialized conquest marketing campaigns if a lead registers within those boundaries.
*   **Delivery Zone Surcharges**: Check if a Shopify order's shipping address is located inside a congestion or premium delivery zone to automatically append the correct surcharge.
*   **Workforce Dispatching**: Automatically route maintenance, utility, or delivery tickets to the foreman or crew specifically responsible for that territory.
*   **Fleet "No-Go" Zone Alerts**: Track fleet GPS coordinates in real-time and alert operations if a vehicle moves outside its authorized operational boundaries.


## 📖 Node Reference

### Resource: Validate

This resource is designed to check geographic coordinates against your territories.

#### Operation: Validate With Latitude and Longitude

Check custom coordinates against one or more of your drawn geofences.

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| **Validate Against** | Options | Yes | Determine the lookup mode: `Validate Against One Fence`, `Validate Against Multiple Fences`, or `Validate Against All Fences`. |
| **Fence List** | Dropdown | Yes | If validating against one/multiple fences, this dynamically displays all available fences queried from your Geo Territories account. |
| **Latitude** | Number | Yes | The decimal latitude of the point to check (e.g., `40.7128`). |
| **Longitude** | Number | Yes | The decimal longitude of the point to check (e.g., `-74.0060`). |

---

## 🛠️ Local Development & Testing

If you are developing or testing this node package locally, follow these steps:

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Local n8n Dev Environment
Start n8n with this node package installed and hot-reloads active:
```bash
npm run dev
```

This will automatically build your typescript files into `dist/`, launch a local n8n instance, and rebuild the node whenever you save changes.

### 3. Build for Production
When you are ready to compile the final package:
```bash
npm run build
```

### 4. Code Quality & Linting
Run the node linter:
```bash
npm run lint
```
Or fix common linting issues automatically:
```bash
npm run lint:fix
```

---

## 🔗 Additional Resources

*   **Official Website**: [Geo Territories](https://geoterritories.com/)
*   **n8n Documentation**: [n8n Creating Nodes](https://docs.n8n.io/integrations/creating-nodes/)
*   **Community Forums**: [n8n Community](https://community.n8n.io/)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE.md).

Visual Data Core: UI Extension Plugin Guide

UI Extension plugins in Visual Data Core are designed to enhance the platform's interface by injecting new user interface elements such as sidebars, modals, custom settings pages, toolbars, or notifications.

🧩 What is a UI Extension Plugin?

A UI Extension Plugin adds reusable or custom UI blocks that go beyond typical panel or data source usage. These may be accessed globally across the application or conditionally depending on context.

📁 File Structure

Each UI extension resides in its own directory under plugins/extensions/:

plugins/
└── extensions/
    └── my-ui-extension/
        ├── plugin.json
        ├── src/
        │   ├── module.tsx
        │   ├── MyComponent.tsx
        │   └── SettingsPage.tsx (optional)
        └── README.md

📦 plugin.json (Required)

Defines metadata and module path:

{
  "type": "ui-extension",
  "id": "my-ui-extension",
  "name": "My UI Extension",
  "description": "Custom sidebar or settings tab",
  "module": "./src/module.tsx"
}

⚙️ module.tsx (Entry Point)

Registers your extension with the core application:

import { registerUIExtension } from 'vdc-core'
import { MySidebar } from './MyComponent'

registerUIExtension({
  id: 'my-ui-extension',
  name: 'My UI Extension',
  component: MySidebar,
  location: 'sidebar', // or 'settings', 'header', etc.
})

🧱 MyComponent.tsx (Your UI Feature)

Renders your actual UI logic:

import React from 'react'

export const MySidebar = () => {
  return (
    <div className="custom-sidebar">
      <h5>Custom Sidebar</h5>
      <p>Extra controls, navigation, or actions</p>
    </div>
  )
}

✅ Registration in the Platform

UI extensions are automatically loaded from the plugins/extensions/ folder if they export valid metadata and a module.

📚 Available Locations

Location

Description

sidebar

Renders inside the global sidebar

settings

Adds a tab/page in the settings section

toolbar

Adds icons or buttons to top toolbars

footer

Adds elements to the global footer

🧪 Testing

Run the VDC frontend dev server

Open the interface and navigate to your registered location

Your custom UI should appear and function

💡 Best Practices

Keep styles modular and scoped

Use platform theming tokens

Avoid blocking interactions

Lazy-load large components when possible

🚀 Example Use Cases

Notification toasters

Admin-only side panels

Theme switcher UI

Experimental feature toggles

For more information, visit: https://github.com/hcfk/visual-data-core


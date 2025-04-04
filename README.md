![image](https://github.com/user-attachments/assets/c94d76ef-5859-4407-a2cf-a3604d1930db)
# 🧠 Brainyy UI
![image](https://github.com/user-attachments/assets/3909d3ac-21e9-48e8-b9d9-d2566d9ce44b)



**Brainyy UI** is a smart, functional React component library designed to handle common frontend use cases — with built-in logic, helpful UX, and sleek styling using Tailwind CSS.

> 💡 _"Focus on building your app. Let Brainyy handle the UI logic."_

---

## 🚀 Features

- ⚡ Built-in functionality (no need to re-implement common logic)
- 🎨 Beautifully styled using Tailwind CSS
- 🧩 Composable and extendable components
- 🎛️ CLI to add components to your project
- 🤝 Compatible with ShadCN components
- 🛡️ Smart validations and UX patterns

---

## 📦 Installation

```bash
npm install brainy
```

> You also need to have `@radix-ui` components, `react`, and `tailwindcss` installed.

---

## 🧰 Usage via CLI

Brainyy includes a CLI tool to easily add components to your project.

### Step 1: Add CLI globally or use `npx`

```bash
npx brainy add password-analyzer
```

This will:

- Add the component to `src/components` folder
- Give you usage instructions

### ⚠️ Note

For components like `password-analyzer`, you must have these components from [shadcn/ui](https://ui.shadcn.com):

- `Input`
- `Label`
- `Popover`

Make sure to install those first!

---

## 🔐 Password Analyzer Component

Analyze password strength and provide user feedback using zxcvbn.

### Import

```tsx
import PasswordAnalyzer from "@/components/PasswordAnalyzer";
```

### Example Usage

```tsx
<PasswordAnalyzer
  value={password}
  onChange={(val, score, suggestions) => {
    setPassword(val);
    setStrength(score);
    // suggestions array provided too
  }}
  placeholder="••••••••"
  // Optional toggles
  showCrackInfo
  showEntropy
  showPatterns
  showScoreLabel
  showProgress
/>
```

### Props

| Prop             | Type                                                          | Description                             |
| ---------------- | ------------------------------------------------------------- | --------------------------------------- |
| `value`          | `string`                                                      | Password string                         |
| `onChange`       | `(val: string, score: number, suggestions: string[]) => void` | Callback with live score/suggestions    |
| `placeholder`    | `string?`                                                     | Placeholder text                        |
| `showCrackInfo`  | `boolean`                                                     | Show estimated crack time & guesses     |
| `showEntropy`    | `boolean`                                                     | Show entropy info                       |
| `showPatterns`   | `boolean`                                                     | Show detected patterns                  |
| `showScoreLabel` | `boolean`                                                     | Show strength label (e.g., "Very Weak") |
| `showProgress`   | `boolean`                                                     | Show strength progress bar              |

> ✅ Suggestions are **always shown** as they are core to user feedback.

---

## 📁 Folder Structure

```
brainyy/
├── bin/                   # CLI Entry
├── snippets/              # Component sources
│   └── password-analyzer/
├── src/
│   └── components/        # Target output folder
├── example/               # Usage example (can delete node_modules here)
├── package.json
└── README.md
```

---

## 🔄 Contributing

Want to add your own component?

- Fork the repo
- Add your component under `snippets/`
- Update CLI script to support it
- Submit a PR

---

## 📣 License

MIT © 2025 [Spec.AI]

---

## 💬 Questions or Feedback?

Drop issues or ideas in the GitHub repo — we’d love to hear from you!

> Happy Building with **Brainyy 🧠**

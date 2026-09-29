<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/adejareshadrach1/shedi-ai-agentic-browser-extension)
[![Twitter](https://img.shields.io/badge/Twitter-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/shedi_ai)
[![Website](https://img.shields.io/badge/Website-0EA5E9?style=for-the-badge&logo=googlechrome&logoColor=white)](https://shedi.ai)

</div>

## 🌐 Shedi AI Agentic Browser Extension

Shedi AI Agentic Browser Extension is an open-source AI web automation tool that runs in your browser, with flexible LLM options and a multi-agent system.

Created, designed, and developed by **Adebola Shadrach Adejare**.

## 📖 Project Background

Shedi AI is a personal project by Adebola Shadrach Adejare. It extends the open-source
[nanobrowser](https://github.com/nanobrowser/nanobrowser) engine (Apache-2.0) into its own product,
with a substantial re-engineering pass designed and implemented solo:

- **Resilient model selection** — display-label names are rejected at write time and self-heal on
  read (mapped back to real model IDs or safe defaults), ending the `404 model_not_found` task
  failures; retired model IDs are migrated automatically on every read
- **Live model discovery** — model lists refresh straight from each provider's own `/models`
  endpoint, including OpenRouter, Groq, Cerebras and Ollama
- **Clean Engine visuals** — the Set-of-Mark numbered boxes are painted only for the vision
  screenshot frame and stripped immediately after, so users see a clean page while the LLM keeps
  its labeled blueprint
- **Ghost pointer** — a glowing dot with a pulsing neon halo glides between targets with
  cubic-bezier easing and a ripple pulse on click, plus an `animatePointerTo` scripting API
- **Premium side panel** — `#0B0F19` dark theme, glowing agent status badge, and a human-readable
  progress timeline
- **Reliability work** — 3-minute per-call LLM timeouts, vision-for-planner honored from settings,
  Azure deployment-name handling, and expanded unit tests for the model-name and guardrail layers


⬇️ Shedi AI is not published on the Chrome Web Store. Build it from this checkout using the source instructions below.

👏 Learn more at [shedi.ai](https://shedi.ai) | Follow on [X](https://x.com/shedi_ai)

🌟 Loving Shedi AI? Give us a star  and help spread the word!


## 🔥Why Shedi AI?

Looking for a powerful AI browser agent without the $200/month price tag of OpenAI Operator? **Shedi AI** , as a chrome extension, delivers premium web automation capabilities while keeping you in complete control:

- **100% Free** - No subscription fees or hidden costs. Just install and use your own API keys, and you only pay what you use with your own API keys.
- **Privacy-Focused** - Everything runs in your local browser. Your credentials stay with you, never shared with any cloud service.
- **Flexible LLM Options** - Connect to your preferred LLM providers with the freedom to choose different models for different agents.
- **Fully Open Source** - Complete transparency in how your browser is automated. No black boxes or hidden processes.

> **Note:** We currently support OpenAI, Anthropic, Gemini, Ollama, Groq, Cerebras, Llama and custom OpenAI-Compatible providers, more providers will be supported.


## 📊 Key Features

- **Multi-agent System**: Specialized AI agents collaborate to accomplish complex web workflows
- **Interactive Side Panel**: Intuitive chat interface with real-time status updates
- **Task Automation**: Seamlessly automate repetitive web automation tasks across websites
- **Follow-up Questions**: Ask contextual follow-up questions about completed tasks
- **Conversation History**: Easily access and manage your AI agent interaction history
- **Multiple LLM Support**: Connect your preferred LLM providers and assign different models to different agents


## 🌐 Browser Support

**Officially Supported:**
- **Chrome** - Full support with all features
- **Edge** - Full support with all features

**Not Supported:**
- Firefox, Safari, and other Chromium variants (Opera, Arc, etc.)

> **Note**: While Shedi AI may function on other Chromium-based browsers, we recommend using Chrome or Edge for the best experience and guaranteed compatibility.


## 🚀 Quick Start

1. **Build and install this fork from source** using the instructions below.

> **Important Note**: For latest features, install from ["Manually Install Latest Version"](#-manually-install-latest-version) below, as Chrome Web Store version may be delayed due to review process.

2. **Configure Agent Models**:
   * Click the Shedi AI icon in your toolbar to open the sidebar
   * Click the `Settings` icon (top right)
   * Add your LLM API keys
   * Choose which model to use for different agents (Navigator, Planner)

## 🔧 Manually Install Latest Version

To get the most recent version with all the latest features:

1. **Download**
    * Download the latest `shedi-ai.zip` file from the official Github [release page](https://github.com/adejareshadrach1/shedi-ai-agentic-browser-extension/releases).

2. **Install**:
    * Unzip `shedi-ai.zip`.
    * Open `chrome://extensions/` in Chrome
    * Enable `Developer mode` (top right)
    * Click `Load unpacked` (top left)
    * Select the unzipped `shedi-ai` folder.

3. **Configure Agent Models**
    * Click the Shedi AI icon in your toolbar to open the sidebar
    * Click the `Settings` icon (top right).
    * Add your LLM API keys.
    * Choose which model to use for different agents (Navigator, Planner)

4. **Upgrading**:
    * Download the latest `shedi-ai.zip` file from the release page.
    * Unzip and replace your existing Shedi AI files with the new ones.
    * Go to `chrome://extensions/` in Chrome and click the refresh icon on the Shedi AI card.

## 🛠️ Build from Source

If you prefer to build Shedi AI yourself, follow these steps:

1. **Prerequisites**:
   * [Node.js](https://nodejs.org/) (v22.12.0 or higher)
   * [pnpm](https://pnpm.io/installation) (v9.15.1 or higher)

2. **Clone the Repository**:
   ```bash
   git clone https://github.com/adejareshadrach1/shedi-ai-agentic-browser-extension.git
   cd shedi-ai-agentic-browser-extension
   ```

3. **Install Dependencies**:
   ```bash
   pnpm install
   ```

4. **Build the Extension**:
   ```bash
   pnpm build
   ```

5. **Load the Extension**:
   * The built extension will be in the `dist` directory
   * Follow the installation steps from the Manually Install section to load the extension into your browser

6. **Development Mode** (optional):
   ```bash
   pnpm dev
   ```

## 🤖 Choosing Your Models

Shedi AI allows you to configure different LLM models for each agent to balance performance and cost. Here are recommended configurations:

### Better Performance
- **Planner**: Claude Sonnet 4
  - Better reasoning and planning capabilities
- **Navigator**: Claude Haiku 3.5
  - Efficient for web navigation tasks
  - Good balance of performance and cost

### Cost-Effective Configuration
- **Planner**: Claude Haiku or GPT-4o
  - Reasonable performance at lower cost
  - May require more iterations for complex tasks
- **Navigator**: Gemini 2.5 Flash or GPT-4o-mini
  - Lightweight and cost-efficient
  - Suitable for basic navigation tasks

### Local Models
- **Setup Options**:
  - Use Ollama or other custom OpenAI-compatible providers to run models locally
  - Zero API costs and complete privacy with no data leaving your machine

- **Recommended Models**:
  - **Qwen3-30B-A3B-Instruct-2507**
  - **Falcon3 10B**
  - **Qwen 2.5 Coder 14B**
  - **Mistral Small 24B**
  - [Latest test results from community](https://gist.github.com/maximus2600/75d60bf3df62986e2254d5166e2524cb) 
  - We welcome community experience sharing with other local models in our [X](https://x.com/shedi_ai)

- **Prompt Engineering**:
  - Local models require more specific and cleaner prompts
  - Avoid high-level, ambiguous commands
  - Break complex tasks into clear, detailed steps
  - Provide explicit context and constraints

> **Note**: The cost-effective configuration may produce less stable outputs and require more iterations for complex tasks.

> **Tip**: Feel free to experiment with your own model configurations! Found a great combination? Share it with the community in our [X](https://x.com/shedi_ai) to help others optimize their setup.

## 💡 See It In Action

Here are some powerful tasks you can accomplish with just a sentence:

1. **News Summary**:
   > "Go to TechCrunch and extract top 10 headlines from the last 24 hours"

2. **GitHub Research**:
   > "Look for the trending Python repositories on GitHub with most stars"

3. **Shopping Research**:
   > "Find a portable Bluetooth speaker on Amazon with a water-resistant design, under $50. It should have a minimum battery life of 10 hours"

## 🛠️ Roadmap

We're actively developing Shedi AI with exciting features on the horizon, welcome to join us! 

Check out our detailed roadmap and upcoming features in our [GitHub Discussions](https://github.com/adejareshadrach1/shedi-ai-agentic-browser-extension/discussions). 

## 🤝 Contributing

**We need your help to make Shedi AI even better!**  Contributions of all kinds are welcome:

*  **Share Prompts & Use Cases** 
   * share how you're using Shedi AI.  Help us build a library of useful prompts and real-world use cases.
*  **Provide Feedback** 
* **Contribute Code**
   * Check out our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute code to the project.
   * Submit pull requests for bug fixes, features, or documentation improvements.


We believe in the power of open source and community collaboration.  Join us in building the future of web automation!


## 🔒 Security

If you discover a security vulnerability, please **DO NOT** disclose it publicly through issues, pull requests, or discussions.

Instead, please create a [GitHub Security Advisory](https://github.com/adejareshadrach1/shedi-ai-agentic-browser-extension/security/advisories/new) to report the vulnerability responsibly. This allows us to address the issue before it's publicly disclosed.

We appreciate your help in keeping Shedi AI and its users safe!

## 💬 Community

Join our growing community of developers and users:

- [Website](https://shedi.ai) - Product docs and updates
- [Twitter](https://x.com/shedi_ai) - Follow for updates and announcements
- [GitHub Discussions](https://github.com/adejareshadrach1/shedi-ai-agentic-browser-extension/discussions) - Share ideas and ask questions

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

Made with ❤️ by **Adebola Shadrach Adejare**.Like Shedi AI? Give us a star 🌟 and follow us on [X](https://x.com/shedi_ai)



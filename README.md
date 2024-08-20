## webcontainer

WebContainer 是一种基于浏览器的运行时环境，它允许在浏览器中执行 Node.js 应用程序和操作系统命令 。这项技术的核心优势在于它能够在用户的浏览器标签页内本地运行 Node.js，无需服务器资源或在用户计算机上创建 node_modules 目录 。

WebContainer 的底层实现主要依赖于 WebAssembly（Wasm）技术 。WebAssembly 是一种为 Web 浏览器设计的二进制指令格式，能够在现代浏览器中以接近原生的性能运行 。通过将 Node.js 的核心功能编译成 WebAssembly 格式，WebContainer 使浏览器能够解析和执行这些二进制指令，实现 Node.js 在浏览器中的运行 。

此外，WebContainer 包含了一个虚拟的 TCP 网络堆栈，映射到浏览器的 ServiceWorker API，允许用户即时创建实时的 Node.js 服务器，即使在脱机状态下也能继续工作 。它还提供了丰富的 API 和工具，使开发者能够在浏览器端实现服务器端的功能，如数据库操作和文件处理 。

WebContainer 技术的使用案例包括 AI 应用、编程教程、下一代文档和基于浏览器的 IDE 等 。它为开发者提供了一种全新的方式，可以在浏览器中直接运行和测试 Node.js 代码，提高了开发效率并降低了环境配置的复杂性 。

## vercel 托管页面

https://vercel.com/lightfishs-projects/node-playground

原因: github page 不能修改 服务响应头。但是 WebContainers 只能在文档上设置以下标头的情况下运行。

```
"headers": [
  {
    "key": "Cross-Origin-Embedder-Policy",
    "value": "require-corp"
  },
  {
    "key": "Cross-Origin-Opener-Policy",
    "value": "same-origin"
  }
]
```

- 原因

WebContainer 在运行时需要配置特定的 HTTP 响应头，如 Cross-Origin-Embedder-Policy 和 Cross-Origin-Opener-Policy，主要是出于安全考虑。这些响应头是跨域隔离（Cross-Origin Embedder Policy, COEP）和跨域开放器策略（Cross-Origin Opener Policy, COOP）的一部分，它们是浏览器安全机制的扩展，用于提供额外的保护层，防止某些类型的安全漏洞。

Cross-Origin Embedder Policy (COEP): 这个策略通过要求资源通过相同的起源或者经过允许的跨域源来嵌入，来限制那些可能被用于侧信道攻击的资源加载。当设置为 require-corp 时，意味着所有嵌入的资源（如 <img>, <script>, <link> 等）必须符合同源策略或者通过 CORS 预检请求。

Cross-Origin Opener Policy (COOP): 这个策略通过隔离来自不同来源的窗口，有助于防止诸如 tabnabbing 这类攻击。当设置为 same-origin 时，新打开的窗口或 iframe 必须与其打开者共享相同的源，否则它们将无法相互访问。

在 WebContainer 的上下文中，这些安全特性尤为重要，因为它涉及到在浏览器中运行可能包含敏感操作的 Node.js 代码。通过实施 COEP 和 COOP，WebContainer 可以确保：

所有加载的资源都经过安全检查，防止潜在的跨站脚本攻击（XSS）。
防止恶意网站通过 iframe 嵌入或打开新的窗口来窃取用户信息或操纵用户会话。
配置这些响应头有助于创建一个更安全的沙盒环境，使 WebContainer 能够在浏览器中安全地执行 Node.js 代码，同时减少安全漏洞的风险。这些安全措施是现代 Web 应用和浏览器技术的重要组成部分，特别是在涉及复杂和强大的客户端运行时环境时。

## webContainer 使用说明

https://webcontainers.io/tutorial/1-build-your-first-webcontainer-app

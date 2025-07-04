---
title: docker部署nodejs服务需要注意的问题
date: 2025-07-04 16:53:33
tags: [docker]
---

# 无头浏览器完成任务后关闭浏览器

---

### 详细说明

`你希望在任务完成后关闭 Playwright 启动的浏览器。你当前的 a(type) 函数里，浏览器是在函数开头启动的，但在上传图片后没有关闭。正确做法是在上传完成（无论成功或失败）后调用 browser.close()。`

> 1. 在 a(type) 函数中，上传图片的 Promise 完成后（resolve 或 reject 前），都调用 await browser.close()。
> 2. 可以用 try...finally 保证无论上传成功还是失败都能关闭浏览器。

修改如下：

```js
async function a(type) {
	const start = Date.now();
	const browser = await chromium.launch({ headless: true });
	const page = await browser.newPage();
	// ... 省略部分代码 ...
	try {
		// ... 省略页面操作和截图 ...
		return await new Promise((resolve, reject) => {
			cos.putObject(
				{
					// ... 省略参数 ...
				},
				(err, data) => {
					if (err) {
						console.log("上传失败", err);
						reject({ code: "E0002", msg: "图片上传失败" });
					} else {
						console.log("上传成功", data.Location);
						if (data.statusCode == "200") {
							const url = `https://${data.Location}`;
							logger.info({ 图片上传完成: url });
							resolve({ code: "0000", msg: "success", data: { url } });
						}
					}
				}
			);
		});
	} finally {
		await browser.close();
	}
}
```

这样可以确保无论上传成功还是失败，浏览器都能被正确关闭，避免资源泄漏。

**问题**

```javascript
UID          PID    PPID  C STIME TTY          TIME CMD
root           1       0  0 07:36 ?        00:00:01 node index.js
root         149       1  0 07:38 ?        00:00:00 [headless_shell] <defunct>
root         150       1  0 07:38 ?        00:00:00 [headless_shell] <defunct>
root         152       1  0 07:38 ?        00:00:00 [headless_shell] <defunct>
root         153       1  0 07:38 ?        00:00:00 [headless_shell] <defunct>
root         256       1  0 07:38 ?        00:00:00 [headless_shell] <defunct>
root         257       1  0 07:38 ?        00:00:00 [headless_shell] <defunct>
root         296       1  0 07:43 ?        00:00:00 [headless_shell] <defunct>
root         297       1  0 07:43 ?        00:00:00 [headless_shell] <defunct>
root         299       1  0 07:43 ?        00:00:00 [headless_shell] <defunct>
root         300       1  0 07:43 ?        00:00:00 [headless_shell] <defunct>
root         434       1  0 07:46 ?        00:00:00 [headless_shell] <defunct>
root         435       1  0 07:46 ?        00:00:00 [headless_shell] <defunct>
root         437       1  0 07:46 ?        00:00:00 [headless_shell] <defunct>
root         438       1  0 07:46 ?        00:00:00 [headless_shell] <defunct>
root         547       1  0 07:46 ?        00:00:00 [headless_shell] <defunct>
root         575       1  0 07:46 ?        00:00:00 [headless_shell] <defunct>
root         576       1  0 07:46 ?        00:00:00 [headless_shell] <defunct>
root         578       1  0 07:46 ?        00:00:00 [headless_shell] <defunct>
root         579       1  0 07:46 ?        00:00:00 [headless_shell] <defunct>
root         663       1  0 07:46 ?        00:00:00 [headless_shell] <defunct>
root         707       0  0 07:48 pts/0    00:00:00 bash
root         715     707  0 07:48 pts/0    00:00:00 ps -ef
```

在 Docker 部署后，发现有大量 `[headless_shell] <defunct>` 进程（僵尸进程），这说明 Playwright 启动的 Chromium 浏览器虽然调用了 `browser.close()`，但其子进程没有被正确回收，导致僵尸进程。

### 原因分析

- 这通常是 Node.js 进程作为 PID 1 运行在容器内时（即没有被其他进程如 `tini` 或 `dumb-init` 包裹），不会自动回收子进程，导致僵尸进程堆积。
- 这不是代码问题，而是 Docker 容器内 Node 进程管理的问题。

### 解决方法

修改 dockerfile 文件

```dockerfile
   # 安装 tini
   RUN apt-get update && apt-get install -y tini

   # 用 tini 启动你的应用
   ENTRYPOINT ["/usr/bin/tini", "--"]
   CMD ["node", "index.js"]
```

**如果不改影响性能吗**

**短期内影响不大，长期会有影响。**

1. **僵尸进程本身不会占用太多 CPU 和内存**
   僵尸进程只是占用很少的系统资源（主要是进程表项），不会消耗 CPU，也不会占用大量内存。

2. **但僵尸进程数量多了会有隐患**

   - 每个僵尸进程会占用一个进程号（PID），Linux 系统的 PID 是有限的（通常最多 32768 或更高）。
   - 如果僵尸进程持续累积，最终可能导致系统无法分配新的 PID，届时无法再创建新进程（包括新的浏览器、shell、甚至系统服务），这会导致服务异常甚至崩溃。
   - 进程表项过多，也会让系统管理进程的效率下降，极端情况下影响系统性能。

3. **容器重启后会清空僵尸进程**
   但如果你的服务是高并发、长时间运行的，僵尸进程会不断累积，风险会逐渐变大。

### 结论

- **短时间/低并发下影响不大。**
- **长期/高并发下，僵尸进程会越来越多，最终影响系统稳定性和性能。**
- **最佳实践：一开始就用 tini 或 dumb-init，彻底解决僵尸进程问题。**

### dockerfile

```shell
# 使用 Playwright 的官方基础镜像
FROM mcr.microsoft.com/playwright:v1.49.0-noble
RUN npm config set registry https://registry.npmmirror.com
# 安装 pnpm
RUN npm install -g pnpm

# 安装 tini
RUN apt-get update && apt-get install -y tini

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml 文件
COPY package.json pnpm-lock.yaml ./

# 安装项目依赖
RUN pnpm install

# 复制项目文件
COPY . .

# 用 tini 启动 node
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "index.js"]

```

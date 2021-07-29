---
title: macOS安装jenkins
tags: ['jenkins']
---

`
官方推荐使用Homebrew的方式安装，本机安装的方式已经不支[下载](https://www.jenkins.io/download/lts/macos/)
`

# 安装

## 安装最新版
```
brew install jenkins-lts
```

## 安装稳定版
```
brew install jenkins-lts@YOUR_VERSION
```

# 启动
```
brew services start jenkins-lts
```

# 重启
```
brew services restart jenkins-lts
```

# 更新jenkins
```
brew upgrade jenkins-lts
```

`但是要启动jenkins，必须要有java jdk，所以还需下载(https://www.oracle.com/java/technologies/javase-jdk16-downloads.html)`

下载安装版即可


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 

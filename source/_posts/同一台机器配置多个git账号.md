---
title: 同一台机器配置多个git账号.md
---

不论是出于何种需要，我们有时候会有配置多个git账号的需求，下面是我个人实践的一种方式。（网上有许多可以实现的方法，但个人感觉它们都缺乏逻辑，不好记忆。）





```
总的来说分以下几步：
1、 删除已经配置的全局账号（如果还没有配置全局账号则可省略）

2、 命令行生成不同的密匙（注意密匙文件不能同名，最好放在默认目录下）

3、 在默认目录下添加config文件（文件名就是config，没有后缀）,配置哪个git账号使用哪个git密匙

```

示例

```
# github
Host github.com    //随便取
HostName github.com  //需要链接的网址
IdentityFile ~/.ssh/id_rsa_office_github  //对应的密匙文件名
PreferredAuthentications publickey
User hanshuang-ai  //对应的git用户名


# gitab
Host gitlab
HostName 49.233.21.66
PreferredAuthentications publickey
IdentityFile ~/.ssh/id_rsa
User LCY
```
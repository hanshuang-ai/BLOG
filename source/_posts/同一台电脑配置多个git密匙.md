---
title: 同一台电脑配置多个git密匙
date: 2022-10-14 18:10:42
tag: ['实战','git']
categories: ['实战','git']
---

首先由于需要配置多个git账户，可能是github、gitlab、gitee等等，所以
***`不需要global email和username`***
直接使用随便一个值覆盖即可。

---

覆盖global email和userName后，需要3步
## 1、 生成不同的github密匙
`生成的时候一定要注意密匙名称，因为同名会被覆盖`
`另外，名称最好见名知意，不一定要id_rsa开头`
```javascript
ssh-keygen -t rsa  -f ~/.ssh/XXX   //使用-f 来命名生成的文件名
```

## 2、 将对应的公匙放入对应的平台
github、gitlab、gitee操作都是大同小异的，将本地的公匙复制好放进去即可。

假如本地有个github密匙名称是github_one，(公匙与私匙的区别就是公匙后面带.pub)，所以我们将github_one.pub里面的内容复制好放入网络平台即可。

## 3、配置本地密匙

这里有两种方法：

### 3.1比较麻烦的方法
将生成的密匙以ssh-add的方法添加入本地

还是以github_one为例，所以我们需要在`密匙所在目录下运行命令行`ssh-add github_one

一般会提示`Identity added: github_one (你生成该密匙时使用的邮箱)`

#### 注意
`但是这样的话可能重启电脑就会失效`，在使用的时候需要重新ssh-add下

但是我觉得这样问题也不大，熟悉了就好


### 3.2一劳永逸的方法
`另一种方法就是在密匙所在目录下配置config文件`

一般情况下，保存密匙的文件夹下不会存在config文件，这时我们需要自己创建。

`注意：文件名就叫config，不需要任何后缀`

创建config文件后，我们队不同的密匙进行分别配置，示例如下


```java
# ~/.ssh/github_rsa github的ssh密钥
Host github.com  //对应的平台，这个值是随便写的，只要你知道代表的平台即可，只是一个标识作用
    HostName github.com  // 这是对应平台的网址，这个一定要弄好，不可随意填写
    User git //
    IdentityFile ~/.ssh/github_rsa  //该平台对应的私匙名称
    IdentitiesOnly yes

# ~/.ssh/gitee_rsa gitee的ssh密钥
Host gitee.com
    HostName gitee.com
    User git
    IdentityFile ~/.ssh/gitee_rsa
    IdentitiesOnly yes
```

配置完成后（或者每配置一个平台后），可以通过`ssh -T git@配置平台的HostName`进行测试。

出现欢迎语`Hi,....,You're successfully.....`时，即配置成功
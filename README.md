## Web Hook Configuration 网钩配置
Follow the steps to automatically pull update when the project is pushed to master branch  
根据以下步骤操作，当项目的 master 分支被推时，将自动拉取更新


### Add Webhook 增加网钩

Config in the Github webside  
在 GitHub 网站中设置

>Project - Setting -- Webhooks -- Add webhook  
项目 -- 设置 -- 网钩 -- 增加网钩

### Add Variable (optional) 增加变量（可选）

>nono /etc/profile.d/github-webhook.sh
```
export GITHUB_WEBHOOK_PORT=NUMBER
export GITHUB_WEBHOOK_SECRET=STRING
```
>source /etc/profile

Change NUMBER and STRING to what you like, and if not variable is added, the app will use 3000 as default port, without secret  
跟据喜好更改 NUMBER 和 STRING，如果没有添加任何变量，应用将使用 3000 作为默认端口，并不使用密钥


### Run App 启动应用

>cd PROJECT_PARENT  
git clone git@github.com:vinzid/github-webhook.git  
cd github-webhook  
pm2 start app.js --name github-webhook  

PROJECT_PARENT is the directroy where project's directory is located; you can directly use `ndoe app` to substitue `pm2` for testing  
PROJECT_PARENT 为项目目录所在的目录；可以直接 `ndoe app` 替代 pm2 进行测试



## Local Hook Configuration (optional) 本地钩子配置（可选）
If the project need to be built after pull update, the local hook can be set, following is hexo blog as example  
如果项目在拉取更新后需要构建，那么可以设置本地钩子，以下以 hexo 博客为例  

>cd blog/.git/hooks  
nano post-merge
```
#!/bin/sh
yarn build
```
>chmod +x post-merge
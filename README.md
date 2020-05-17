# vue-admin

### Git基础命令

拷贝项目：git clone <仓库地址>

创建分支：git branch <name>

创建并进入分支：git checkout -b <name>

切换分支：git checkout <name>

查看状态：git status

添加所有文件：git add .

提交：git commit -m "这里是当前提交的描述"

git commit --amend（可以修改最后一次提交的信息.但是如果你已经push过了，那么其历史最后一次，永远也不能修改了）

拉取：git pull

推送：git push

查看分支：git branch --list

查看分支（包含远程分支）：git branch -a

合并分支：git merge --on-ff -m '描述' <name>

删除远程分支：git push origin --delete <name>

删除本地分支：git branch -d <name>

把创建好的本地分支提交到远程去（切记要先切换到你要提交的这个分支上再提交）：git push --set-upstream origin <name>

master：主分支，一般不会在此分支上开发项目

dev：开发分支，一般会在此分支上开发

学习vue遇到的问题

vuex存储数据刷新时会重置回原来的初始化数据的解决方法
  1.利用HTML5的本地存储
  2.利用cookie npm i --save cookie_js


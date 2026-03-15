---
title: "如何手动离线安装WSL"
description: 如果你使用LTSC版本的Windows系统（未预装Microsoft Store），或者不想通过Microsoft Store安装WSL，那么只需要多花一点时间，就可以手动离线安装WSL。
date: 2026-03-14 22:56:00 +0800
categories: []
tags: [draft-under-validation]
---

## **1 启用Windows Subsystem for Linux**

[Option 1]通过控制面板启用：控制面板 -> 程序 -> 启用或关闭Windows功能 -> **适用于Linux的Windows子系统**。

[Option 2][**推荐**]通过**PowerShell**启用（右键Windows按钮 -> 终端管理员 -> 执行如下命令[^1]）：
```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

## **2 启用Virtual Machine Platform**

[Option 1]通过控制面板启用：控制面板 -> 程序 -> 启用或关闭Windows功能 -> **Virtual Machine Platform**。

[Option 2][**推荐**]通过**PowerShell**启用（右键Windows按钮 -> 终端管理员 -> 执行如下命令[^2]）：
```powershell
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

## **3 安装Linux内核更新包**

下载最新的**Linux内核更新包**并安装：
- [WSL2 Linux kernel update package for x64 machines](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)
- [WSL2 Linux kernel update package for ARM64 machines](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_arm64.msi)

然后设置**WSL2**为默认版本：
```powershell
wsl --set-default-version 2
```

## **4 下载Linux发行版**

[Option 1][**推荐**]从微软下载**AppxBundle**（各大发行版下载连接详见[Downloading distributions](https://learn.microsoft.com/en-us/windows/wsl/install-manual#downloading-distributions)）：
- [Ubuntu 24.04 LTS (x64, arm64)](https://wslstorestorage.blob.core.windows.net/wslblob/Ubuntu2404-240425.AppxBundle)
- [Ubuntu 22.04 LTS (x64, arm64)](https://aka.ms/wslubuntu2204)
- [Ubuntu 20.04 LTS (x64, arm64)](https://wslstorestorage.blob.core.windows.net/wslblob/Ubuntu2404-240425.AppxBundle)
- [**推荐**: 不臃肿][Debian 11.3 (x64, arm64)](https://aka.ms/wsl-debian-gnulinux)

[Option 2]直接下载**rootfs tarball**：
- [Ubuntu 22.04.5 LTS (x64, arm64)](https://cloud-images.ubuntu.com/wsl/jammy/current/)

## **5 安装Linux发行版**

### [Option 1]通过Add-AppxPackage命令安装appx

详见[Installing the Appx package with Add-AppxPackage](https://learn.microsoft.com/en-us/windows/wsl/install-manual#installing-the-appx-package-with-add-appxpackage)。

### [Option 2][**推荐**]通过wsl --import命令导入rootfs tarball

用法：`wsl --import <发行版名称> <安装位置> <tarball路径> --version <Version>`。

> [**推荐**]可以从AppxBundle中提取rootfs tarball。
> 
> 以Debian为例，使用7-Zip解压`TheDebianProject.DebianGNULinux_1.12.2.0_neutral___76v4gfsz19hv4.AppxBundle`，再次解压`DistroLauncher-Appx_1.12.2.0_x64.appx`，找到`install.tar.gz`，它就是rootfs tarball。

## **安装之后**

### 一些常用的wsl命令：

导入Debian rootfs tarball：
```powershell
wsl --import Debian_11.3 D:\WSL\Debian_11.3\ D:\WSL\Debian_11.3\install.tar.gz --version 2
```

查看已安装的发行版（简写`wsl -l -v`）：
```powershell
wsl --list --verbose
```

运行指定的发行版（简写`wsl -d`）：
```powershell
wsl --distribution Debian_11.3
```

终止指定的发行版（简写`wsl -t`）：
```powershell
wsl --terminate Debian_11.3
```

### 创建sudo用户

创建用户：
```bash
adduser alice
```

添加到sudo群组：
```bash
usermod --append --groups sudo alice
```

设置为默认登录用户：
```bash
sudo tee --append /etc/wsl.conf > /dev/null <<EOF
[user]
default=alice
EOF
```

> 要让/etc/wsl.conf修改生效，先执行`wsl -t Debian_11.3`终止发行版，再执行`wsl -d Debian_11.3`重新运行。

### 更换源

先备份软件源：
```bash
sudo cp /etc/apt/sources.list /etc/apt/sources.list.backup
```

然后替换为国内源[^4]：
```bash
sudo tee /etc/apt/sources.list > /dev/null <<EOF
# 默认注释了源码仓库，如有需要可自行取消注释
deb http://mirrors.ustc.edu.cn/debian bullseye main contrib non-free
# deb-src http://mirrors.ustc.edu.cn/debian bullseye main contrib non-free
deb http://mirrors.ustc.edu.cn/debian bullseye-updates main contrib non-free
# deb-src http://mirrors.ustc.edu.cn/debian bullseye-updates main contrib non-free

# backports 软件源，请按需启用
# deb http://mirrors.ustc.edu.cn/debian bullseye-backports main contrib non-free
# deb-src http://mirrors.ustc.edu.cn/debian bullseye-backports main contrib non-free
EOF
```

最后更新软件源：
```bash
sudo apt-get update
```

### 开启systemd

开启systemd[^3]，注意不要覆盖/etc/wsl.conf：
```bash
sudo tee --append /etc/wsl.conf > /dev/null <<EOF
[boot]
systemd=true
EOF
```

安装libpam-systemd：
```bash
sudo apt-get install libpam-systemd
```

> 缺少libpam-systemd时会报错：`wsl: Failed to start the systemd user session for 'alice'. See journalctl for more details.`。

> 要让/etc/wsl.conf修改生效，先执行`wsl -t Debian_11.3`终止发行版，再执行`wsl -d Debian_11.3`重新运行。

### 备份和还原

备份（导出tarball、压缩tarball）：
```bat
wsl --export Debian_11.3 1_changeSource.tar
tar -cjvf 1_changeSource.tar.bz2 1_changeSource.tar
```

还原（解压bz2，导入tarball）：
```bat
tar -xjvf 1_changeSource.tar.bz2
wsl --unregister Debian_11.3
wsl --import Debian_11.3 D:\WSL\Debian_11.3\ D:\WSL\Debian_11.3\1_changeSource.tar --version 2
```

## References
[^1]: [Step 1 - Enable the Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/install-manual#step-1---enable-the-windows-subsystem-for-linux)
[^2]: [Step 3 - Enable Virtual Machine feature](https://learn.microsoft.com/en-us/windows/wsl/install-manual#step-3---enable-virtual-machine-feature)
[^3]: [How to enable systemd?](https://learn.microsoft.com/en-us/windows/wsl/systemd#how-to-enable-systemd)
[^4]: [Debian - USTC Mirror Help](https://cmcc.mirrors.ustc.edu.cn/help/debian.html)
